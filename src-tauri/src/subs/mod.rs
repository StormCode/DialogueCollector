//! Subtitle parsing: ASS and SRT → `Cue`s, in Rust (F2, decided 2026-09-29).
//!
//! - Encoding: a BOM wins, then strict UTF-8, then chardetng's guess — older Traditional
//!   Chinese subtitles are often Big5.
//! - ASS: only `Dialogue:` events (`Comment:` is skipped); fields follow the `[Events]`
//!   `Format:` line, with Text taking the rest of the line so commas in it survive; `{...}`
//!   override blocks are stripped, vector drawings (`\p1`…`\p0`) dropped, `\N`/`\n` become
//!   newlines and `\h` a space. Typesetting often repeats one line on several layers: events
//!   with the same start, end and text are kept once.
//! - SRT: `<i>`-style tags and `{\an8}`-style overrides are stripped.
//!
//! Cues are returned in start-time order; `index` keeps each one's position in the file.

use std::path::{Path, PathBuf};

use chardetng::{EncodingDetector, Iso2022JpDetection, Utf8Detection};
use encoding_rs::{Encoding, UTF_16BE, UTF_16LE, UTF_8};
use serde::{Deserialize, Serialize};

pub const SUBTITLE_EXTENSIONS: &[&str] = &["ass", "srt"];

/// One timed line from a subtitle file.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cue {
    /// Position in the source file, 0-based.
    pub index: u32,
    pub start_ms: u64,
    pub end_ms: u64,
    /// Plain text, override tags stripped, `\N` turned into a newline.
    pub text: String,
}

#[derive(Debug, thiserror::Error)]
pub enum SubsError {
    #[error("subtitle file not found: {0}")]
    NotFound(PathBuf),

    #[error("cannot read {path}: {source}")]
    Io {
        path: PathBuf,
        #[source]
        source: std::io::Error,
    },

    #[error("unsupported subtitle format: {0}")]
    UnsupportedFormat(String),

    #[error("subtitle file could not be parsed: {0}")]
    Parse(String),

    /// Parsed, but not one line of dialogue (the 無法提取台詞 toast).
    #[error("no dialogue lines found in the subtitle file")]
    NoCues,
}

impl SubsError {
    pub fn kind(&self) -> &'static str {
        match self {
            Self::NotFound(_) => "NotFound",
            Self::Io { .. } => "Io",
            Self::UnsupportedFormat(_) => "UnsupportedFormat",
            Self::Parse(_) => "Parse",
            Self::NoCues => "NoCues",
        }
    }
}

/// Reads and parses a subtitle file, choosing the parser by extension.
pub fn parse_file(path: &Path) -> Result<Vec<Cue>, SubsError> {
    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .map(str::to_ascii_lowercase)
        .unwrap_or_default();
    if !SUBTITLE_EXTENSIONS.contains(&ext.as_str()) {
        return Err(SubsError::UnsupportedFormat(ext));
    }
    let bytes = std::fs::read(path).map_err(|source| match source.kind() {
        std::io::ErrorKind::NotFound => SubsError::NotFound(path.to_owned()),
        _ => SubsError::Io {
            path: path.to_owned(),
            source,
        },
    })?;
    let text = decode(&bytes);
    let cues = if ext == "ass" {
        parse_ass(&text)?
    } else {
        parse_srt(&text)?
    };
    if cues.is_empty() {
        return Err(SubsError::NoCues);
    }
    Ok(cues)
}

/// Bytes → text: BOM, then strict UTF-8, then a detected legacy encoding.
pub fn decode(bytes: &[u8]) -> String {
    if let Some((encoding, bom)) = Encoding::for_bom(bytes) {
        return encoding
            .decode_without_bom_handling(&bytes[bom..])
            .0
            .into_owned();
    }
    if let Ok(text) = std::str::from_utf8(bytes) {
        return text.to_owned();
    }
    let mut detector = EncodingDetector::new(Iso2022JpDetection::Deny);
    detector.feed(bytes, true);
    let encoding = detector.guess(None, Utf8Detection::Allow);
    // UTF-16 without a BOM is not something chardetng guesses; neither do subtitle tools.
    debug_assert!(encoding != UTF_16LE && encoding != UTF_16BE);
    let encoding = if encoding == UTF_8 {
        encoding_rs::WINDOWS_1252
    } else {
        encoding
    };
    encoding.decode_without_bom_handling(bytes).0.into_owned()
}

// ---------------------------------------------------------------------------------------- SRT

pub fn parse_srt(text: &str) -> Result<Vec<Cue>, SubsError> {
    let text = text.replace("\r\n", "\n").replace('\r', "\n");
    let mut cues = Vec::new();
    let mut lines = text.lines().peekable();
    let mut position = 0u32;

    while lines.peek().is_some() {
        // Find the next timing line; a numeric counter line before it is optional.
        let Some(timing) = lines.by_ref().find(|l| l.contains("-->")) else {
            break;
        };
        let (start, end) = parse_srt_timing(timing)
            .ok_or_else(|| SubsError::Parse(format!("bad SRT timing: {timing}")))?;
        let mut body = Vec::new();
        while let Some(line) = lines.peek() {
            if line.trim().is_empty() {
                lines.next();
                break;
            }
            body.push(*line);
            lines.next();
        }
        let cleaned = clean_srt_text(&body.join("\n"));
        if !cleaned.is_empty() {
            cues.push(Cue {
                index: position,
                start_ms: start,
                end_ms: end,
                text: cleaned,
            });
        }
        position += 1;
    }
    Ok(sort(cues))
}

fn parse_srt_timing(line: &str) -> Option<(u64, u64)> {
    let (a, b) = line.split_once("-->")?;
    // Anything after the end time (position coordinates) is ignored.
    let b = b.split_whitespace().next()?;
    Some((parse_clock(a.trim())?, parse_clock(b)?))
}

/// `H:MM:SS,mmm` / `H:MM:SS.cc`: the fraction is scaled by its number of digits, so both
/// SRT milliseconds and ASS centiseconds come out right.
fn parse_clock(s: &str) -> Option<u64> {
    let (hms, frac) = match s.find([',', '.']) {
        Some(i) => (&s[..i], &s[i + 1..]),
        None => (s, ""),
    };
    let mut parts = hms.split(':').map(|p| p.trim().parse::<u64>());
    let (h, m, sec) = match (parts.next(), parts.next(), parts.next(), parts.next()) {
        (Some(h), Some(m), Some(s), None) => (h.ok()?, m.ok()?, s.ok()?),
        (Some(m), Some(s), None, None) => (0, m.ok()?, s.ok()?),
        _ => return None,
    };
    let frac = frac.trim();
    let ms = if frac.is_empty() {
        0
    } else {
        let digits: String = frac.chars().take(3).collect();
        let value: u64 = digits.parse().ok()?;
        value * 10u64.pow(3 - digits.len() as u32)
    };
    Some(((h * 60 + m) * 60 + sec) * 1000 + ms)
}

fn clean_srt_text(text: &str) -> String {
    let without_braces = strip_braces(text);
    let mut out = String::with_capacity(without_braces.len());
    let mut in_tag = false;
    for ch in without_braces.chars() {
        match ch {
            '<' => in_tag = true,
            '>' if in_tag => in_tag = false,
            _ if !in_tag => out.push(ch),
            _ => {}
        }
    }
    normalize(&out)
}

// ---------------------------------------------------------------------------------------- ASS

pub fn parse_ass(text: &str) -> Result<Vec<Cue>, SubsError> {
    let mut in_events = false;
    let mut format: Option<Vec<String>> = None;
    let mut cues = Vec::new();
    let mut seen = std::collections::HashSet::new();
    let mut position = 0u32;

    for raw in text.lines() {
        let line = raw.trim_start_matches('\u{feff}').trim();
        if line.starts_with('[') {
            in_events = line.eq_ignore_ascii_case("[events]");
            continue;
        }
        if !in_events {
            continue;
        }
        if let Some(rest) = line.strip_prefix("Format:") {
            format = Some(
                rest.split(',')
                    .map(|f| f.trim().to_ascii_lowercase())
                    .collect(),
            );
            continue;
        }
        let is_dialogue = line.starts_with("Dialogue:");
        if !is_dialogue && !line.starts_with("Comment:") {
            continue;
        }
        let this_position = position;
        position += 1;
        if !is_dialogue {
            continue; // Comment: events never become cues
        }
        let fields = format
            .as_ref()
            .ok_or_else(|| SubsError::Parse("Dialogue before the [Events] Format line".into()))?;
        let body = &line["Dialogue:".len()..];
        let values: Vec<&str> = body.splitn(fields.len(), ',').collect();
        if values.len() != fields.len() {
            return Err(SubsError::Parse(format!("malformed event: {line}")));
        }
        let field = |name: &str| {
            fields
                .iter()
                .position(|f| f == name)
                .map(|i| values[i].trim())
        };
        let (Some(start), Some(end), Some(raw_text)) = (
            field("start"),
            field("end"),
            fields.iter().position(|f| f == "text"),
        ) else {
            return Err(SubsError::Parse("Format lacks Start, End or Text".into()));
        };
        let start_ms =
            parse_clock(start).ok_or_else(|| SubsError::Parse(format!("bad ASS time: {start}")))?;
        let end_ms =
            parse_clock(end).ok_or_else(|| SubsError::Parse(format!("bad ASS time: {end}")))?;
        let text = clean_ass_text(values[raw_text]);
        if text.is_empty() {
            continue;
        }
        if !seen.insert((start_ms, end_ms, text.clone())) {
            continue; // the same line repeated on another layer
        }
        cues.push(Cue {
            index: this_position,
            start_ms,
            end_ms,
            text,
        });
    }
    Ok(sort(cues))
}

fn clean_ass_text(text: &str) -> String {
    let mut out = String::with_capacity(text.len());
    let mut drawing = false;
    let mut rest = text;
    while let Some(open) = rest.find('{') {
        if !drawing {
            out.push_str(&rest[..open]);
        }
        let Some(close) = rest[open..].find('}') else {
            rest = "";
            break;
        };
        let block = &rest[open + 1..open + close];
        if let Some(level) = drawing_level(block) {
            drawing = level > 0;
        }
        rest = &rest[open + close + 1..];
    }
    if !drawing {
        out.push_str(rest);
    }
    let out = out
        .replace("\\N", "\n")
        .replace("\\n", "\n")
        .replace("\\h", " ");
    normalize(&out)
}

/// The last `\pN` in an override block, if any (`\pos` and `\pbo` are other tags).
fn drawing_level(block: &str) -> Option<u32> {
    block.rsplit('\\').find_map(|tag| {
        let digits = tag.strip_prefix('p')?;
        (!digits.is_empty() && digits.bytes().all(|b| b.is_ascii_digit()))
            .then(|| digits.parse().ok())
            .flatten()
    })
}

// ------------------------------------------------------------------------------------- common

fn strip_braces(text: &str) -> String {
    let mut out = String::with_capacity(text.len());
    let mut depth = 0u32;
    for ch in text.chars() {
        match ch {
            '{' => depth += 1,
            '}' if depth > 0 => depth -= 1,
            _ if depth == 0 => out.push(ch),
            _ => {}
        }
    }
    out
}

/// Trims every line, drops empty ones, and joins them with `\n`.
fn normalize(text: &str) -> String {
    text.lines()
        .map(str::trim)
        .filter(|l| !l.is_empty())
        .collect::<Vec<_>>()
        .join("\n")
}

fn sort(mut cues: Vec<Cue>) -> Vec<Cue> {
    cues.sort_by_key(|c| (c.start_ms, c.index));
    cues
}

#[cfg(test)]
mod tests;

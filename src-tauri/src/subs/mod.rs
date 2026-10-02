//! Subtitle parsing: ASS and SRT → `Cue`s, in Rust (F2, decided 2026-09-29).
//!
//! - Encoding: a BOM wins, then strict UTF-8, then chardetng's guess — older Traditional
//!   Chinese subtitles are often Big5.
//! - ASS: only `Dialogue:` events (`Comment:` is skipped); fields follow the `[Events]`
//!   `Format:` line, with Text taking the rest of the line so commas in it survive; `{...}`
//!   override blocks are stripped, vector drawings (`\p1`…`\p0`) dropped, the hard break `\N`
//!   splits lines while the soft `\n` and `\h` are spaces (the default wrap style). Typesetting
//!   often repeats one line on several layers: events with the same start, end and text are
//!   kept once.
//! - SRT: `<i>`-style tags and `{\an8}`-style overrides are stripped.
//! - 原文／譯文 follow the subtitle's own lines (decided 2026-09-29): the first line is the
//!   text, any further lines the translation.
//! - Bilingual ASS that puts each language in its own event (`Text - JP` and `Text - CN` with
//!   the same timing) is paired into one cue (user 2026-09-29): see `pair_bilingual`.
//! - ASS 主／副字幕 (user 2026-10-02): players can't tell them apart either, but the main one
//!   is usually set larger. When a bilingual line's two parts are drawn at different sizes
//!   (the style's Fontsize × ScaleY, or `\fs`/`\fscy` overrides), the larger is the 原文.
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
    /// 原文: the first line, override tags stripped.
    pub text: String,
    /// 譯文: the remaining lines joined with `\n`, if there are any.
    pub translation: Option<String>,
}

impl Cue {
    fn new(index: u32, start_ms: u64, end_ms: u64, lines: &str) -> Self {
        let (text, translation) = match lines.split_once('\n') {
            Some((first, rest)) => (first.to_owned(), Some(rest.to_owned())),
            None => (lines.to_owned(), None),
        };
        Self {
            index,
            start_ms,
            end_ms,
            text,
            translation,
        }
    }
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
            cues.push(Cue::new(position, start, end, &cleaned));
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

/// A style's font size and vertical scale (%), from `[V4+ Styles]`.
#[derive(Debug, Clone, Copy, PartialEq)]
struct Size {
    font: f64,
    scale_y: f64,
}

impl Size {
    /// The height the text is drawn at.
    fn height(self) -> f64 {
        self.font * self.scale_y / 100.0
    }
}

/// One event as `pair_bilingual` sees it: its style, its cue, and the height its 原文 is drawn
/// at (`None` when the style isn't declared).
struct Event {
    style: String,
    cue: Cue,
    height: Option<f64>,
}

#[derive(PartialEq)]
enum Section {
    Styles,
    Events,
    Other,
}

pub fn parse_ass(text: &str) -> Result<Vec<Cue>, SubsError> {
    let mut section = Section::Other;
    let mut format: Option<Vec<String>> = None;
    let mut style_format: Option<Vec<String>> = None;
    let mut styles: std::collections::HashMap<String, Size> = std::collections::HashMap::new();
    let mut events: Vec<Event> = Vec::new();
    let mut seen = std::collections::HashSet::new();
    let mut position = 0u32;

    for raw in text.lines() {
        let line = raw.trim_start_matches('\u{feff}').trim();
        if line.starts_with('[') {
            section = if line.eq_ignore_ascii_case("[events]") {
                Section::Events
            } else if line.to_ascii_lowercase().ends_with("styles]") {
                Section::Styles
            } else {
                Section::Other
            };
            continue;
        }
        if section == Section::Styles {
            if let Some(rest) = line.strip_prefix("Format:") {
                style_format = Some(
                    rest.split(',')
                        .map(|f| f.trim().to_ascii_lowercase())
                        .collect(),
                );
            } else if let (Some(rest), Some(fields)) = (line.strip_prefix("Style:"), &style_format)
            {
                if let Some((name, size)) = parse_style(fields, rest) {
                    styles.insert(name, size);
                }
            }
            continue;
        }
        if section != Section::Events {
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
        let style = field("style").unwrap_or("").to_owned();
        let lines = ass_lines(values[raw_text], styles.get(&style).copied(), &styles);
        if lines.is_empty() {
            continue;
        }
        let joined = lines
            .iter()
            .map(|(l, _)| l.as_str())
            .collect::<Vec<_>>()
            .join("\n");
        if !seen.insert((start_ms, end_ms, joined)) {
            continue; // the same line repeated on another layer
        }
        let (cue, height) = cue_from_lines(this_position, start_ms, end_ms, &lines);
        events.push(Event { style, cue, height });
    }
    Ok(sort(pair_bilingual(events)))
}

/// A `Style:` line's name and size; `None` if it lacks them.
fn parse_style(fields: &[String], rest: &str) -> Option<(String, Size)> {
    let values: Vec<&str> = rest.split(',').map(str::trim).collect();
    let field = |name: &str| {
        fields
            .iter()
            .position(|f| f == name)
            .and_then(|i| values.get(i).copied())
    };
    let font = field("fontsize")?.parse().ok()?;
    let scale_y = field("scaley")
        .and_then(|v| v.parse().ok())
        .unwrap_or(100.0);
    Some((field("name")?.to_owned(), Size { font, scale_y }))
}

/// A cue from an event's lines. Lines drawn at different heights put the tallest first as the
/// 原文 (主字幕) and the rest, in order, as the 譯文; otherwise the first line is the 原文. Also
/// returns the 原文's height.
fn cue_from_lines(
    index: u32,
    start_ms: u64,
    end_ms: u64,
    lines: &[(String, Option<f64>)],
) -> (Cue, Option<f64>) {
    let heights: Option<Vec<f64>> = lines.iter().map(|(_, h)| *h).collect();
    let tallest = heights
        .as_ref()
        .and_then(|hs| hs.iter().copied().reduce(f64::max))
        .filter(|&max| {
            heights
                .as_ref()
                .is_some_and(|hs| hs.iter().any(|&h| h < max))
        });
    let (main, rest): (Vec<_>, Vec<_>) = match tallest {
        Some(max) => lines.iter().partition(|(_, h)| *h == Some(max)),
        None => {
            let (first, rest) = lines.split_first().expect("lines is not empty");
            (vec![first], rest.iter().collect())
        }
    };
    let text = main
        .iter()
        .map(|(l, _)| l.as_str())
        .collect::<Vec<_>>()
        .join(" ");
    let translation = (!rest.is_empty()).then(|| {
        rest.iter()
            .map(|(l, _)| l.as_str())
            .collect::<Vec<_>>()
            .join("\n")
    });
    let height = main[0].1;
    (
        Cue {
            index,
            start_ms,
            end_ms,
            text,
            translation,
        },
        height,
    )
}

/// Which language a style name says its events are in, from tags like `JP` in `Text - JP`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum StyleLanguage {
    Japanese,
    Chinese,
    Unknown,
}

fn style_language(style: &str) -> StyleLanguage {
    let mut found = StyleLanguage::Unknown;
    for tag in style.split(|c: char| !c.is_ascii_alphanumeric()) {
        match tag.to_ascii_uppercase().as_str() {
            "JP" | "JA" | "JPN" | "JAP" => return StyleLanguage::Japanese,
            "CN" | "CH" | "ZH" | "CHS" | "CHT" | "SC" | "TC" | "CHI" | "GB" | "BIG5" => {
                found = StyleLanguage::Chinese
            }
            _ => {}
        }
    }
    found
}

fn has_kana(text: &str) -> bool {
    text.chars()
        .any(|c| matches!(c, '\u{3041}'..='\u{309F}' | '\u{30A0}'..='\u{30FF}' | '\u{31F0}'..='\u{31FF}'))
}

/// Bilingual ASS often carries each language as its own event: `Text - JP` and `Text - CN`
/// with exactly the same start and end, sometimes several per language (a line split in two, a
/// spell name with its reading). Events sharing a timing are paired into one cue when every one
/// of them is plainly Japanese or Chinese, by its style's tag or else by kana, and both
/// languages are there: the Japanese, joined in file order, is the 原文 and the Chinese the
/// 譯文. Two one-line events in different, untagged styles pair too when exactly one has kana:
/// that one is the 原文. Anything else sharing a timing (two lines in one style, a title card's
/// two lines, an event of neither language among them) is left as it is. Whichever side is
/// drawn larger is the 原文 (主字幕), overriding the language when every size is known
/// (user 2026-10-02): sizes alone don't decide *whether* to pair, as two speakers at once often
/// differ in size too.
fn pair_bilingual(events: Vec<Event>) -> Vec<Cue> {
    use std::collections::{HashMap, HashSet};
    let mut by_time: HashMap<(u64, u64), Vec<usize>> = HashMap::new();
    for (i, Event { cue, .. }) in events.iter().enumerate() {
        by_time
            .entry((cue.start_ms, cue.end_ms))
            .or_default()
            .push(i);
    }
    let mut merged: HashMap<usize, Cue> = HashMap::new();
    let mut dropped = HashSet::new();
    for group in by_time.values_mut() {
        if group.len() < 2 || group.iter().any(|&i| events[i].cue.translation.is_some()) {
            continue;
        }
        group.sort_by_key(|&i| events[i].cue.index);
        let language = |i: usize| match style_language(&events[i].style) {
            StyleLanguage::Unknown if has_kana(&events[i].cue.text) => StyleLanguage::Japanese,
            other => other,
        };
        let japanese: Vec<usize> = group
            .iter()
            .copied()
            .filter(|&i| language(i) == StyleLanguage::Japanese)
            .collect();
        let chinese: Vec<usize> = group
            .iter()
            .copied()
            .filter(|&i| language(i) == StyleLanguage::Chinese)
            .collect();
        let (originals, translations) = if !japanese.is_empty()
            && !chinese.is_empty()
            && japanese.len() + chinese.len() == group.len()
        {
            (japanese, chinese)
        } else if let [a, b] = group[..] {
            // Two lines, neither style tagged: different styles and exactly one with kana, which
            // leads. Without kana nothing says which is the original (a title card's two lines,
            // two speakers), so they stay apart.
            let (style_a, style_b) = (&events[a].style, &events[b].style);
            let (ja, jb) = (has_kana(&events[a].cue.text), has_kana(&events[b].cue.text));
            let untagged = style_language(style_a) == StyleLanguage::Unknown
                && style_language(style_b) == StyleLanguage::Unknown;
            if style_a == style_b || !untagged || ja == jb {
                continue;
            }
            if jb {
                (vec![b], vec![a])
            } else {
                (vec![a], vec![b])
            }
        } else {
            continue;
        };
        let (originals, translations) = if taller(&events, &translations, &originals) {
            (translations, originals)
        } else {
            (originals, translations)
        };
        let join = |ids: &[usize]| {
            ids.iter()
                .map(|&i| events[i].cue.text.as_str())
                .collect::<Vec<_>>()
                .join(" ")
        };
        let keep = originals[0];
        merged.insert(
            keep,
            Cue {
                text: join(&originals),
                translation: Some(join(&translations)),
                ..events[keep].cue.clone()
            },
        );
        dropped.extend(group.iter().copied().filter(|&i| i != keep));
    }
    events
        .into_iter()
        .enumerate()
        .filter(|(i, _)| !dropped.contains(i))
        .map(|(i, Event { cue, .. })| merged.remove(&i).unwrap_or(cue))
        .collect()
}

/// Whether every event in `a` and `b` has a known size and `a`'s tallest is taller than `b`'s.
fn taller(events: &[Event], a: &[usize], b: &[usize]) -> bool {
    let tallest = |ids: &[usize]| -> Option<f64> {
        ids.iter()
            .map(|&i| events[i].height)
            .collect::<Option<Vec<_>>>()?
            .into_iter()
            .reduce(f64::max)
    };
    matches!((tallest(a), tallest(b)), (Some(x), Some(y)) if x > y)
}

/// An event's text as its hard lines (`\N`), override tags stripped and drawings dropped, each
/// with the height it starts at: `base` (its style's size), changed by `\fs`, `\fscy` and
/// `\r` as they come. Heights are `None` when the style's size isn't known.
fn ass_lines(
    text: &str,
    base: Option<Size>,
    styles: &std::collections::HashMap<String, Size>,
) -> Vec<(String, Option<f64>)> {
    // The visible text, in chunks between override blocks, each with the size in effect.
    let mut chunks: Vec<(&str, Option<Size>)> = Vec::new();
    let mut size = base;
    let mut drawing = false;
    let mut rest = text;
    while let Some(open) = rest.find('{') {
        if !drawing {
            chunks.push((&rest[..open], size));
        }
        let Some(close) = rest[open..].find('}') else {
            rest = "";
            break;
        };
        let block = &rest[open + 1..open + close];
        if let Some(level) = drawing_level(block) {
            drawing = level > 0;
        }
        size = apply_size_tags(block, size, base, styles);
        rest = &rest[open + close + 1..];
    }
    if !drawing {
        chunks.push((rest, size));
    }

    // The soft break and the hard space are spaces; a line's height is where its text starts.
    let visible = |s: &str| s.replace("\\n", " ").replace("\\h", " ");
    let mut lines = Vec::new();
    let mut line = String::new();
    let mut height: Option<Option<f64>> = None;
    for (chunk, size) in chunks {
        for (i, piece) in chunk.split("\\N").enumerate() {
            if i > 0 {
                let done = visible(&std::mem::take(&mut line)).trim().to_owned();
                if !done.is_empty() {
                    lines.push((done, height.flatten()));
                }
                height = None;
            }
            if height.is_none() && !visible(piece).trim().is_empty() {
                height = Some(size.map(Size::height));
            }
            line.push_str(piece);
        }
    }
    let done = visible(&line).trim().to_owned();
    if !done.is_empty() {
        lines.push((done, height.flatten()));
    }
    lines
}

/// `\fs`, `\fscy` and `\r` in an override block, in order. Animated ones (`\t(...)`) are
/// skipped: the line starts at its own size.
fn apply_size_tags(
    block: &str,
    mut size: Option<Size>,
    base: Option<Size>,
    styles: &std::collections::HashMap<String, Size>,
) -> Option<Size> {
    let mut depth = 0u32;
    let mut plain = String::with_capacity(block.len());
    for ch in block.chars() {
        match ch {
            '(' => depth += 1,
            ')' => depth = depth.saturating_sub(1),
            _ if depth == 0 => plain.push(ch),
            _ => {}
        }
    }
    for tag in plain.split('\\').map(str::trim) {
        let number = |prefix: &str| -> Option<f64> {
            let v = tag.strip_prefix(prefix)?;
            (!v.is_empty() && v.bytes().all(|b| b.is_ascii_digit() || b == b'.'))
                .then(|| v.parse().ok())
                .flatten()
        };
        if let Some(scale_y) = number("fscy") {
            size = size.map(|s| Size { scale_y, ..s });
        } else if let Some(font) = number("fs") {
            size = size.map(|s| Size { font, ..s });
        } else if let Some(name) = tag.strip_prefix('r') {
            size = if name.is_empty() {
                base
            } else {
                styles.get(name).copied()
            };
        }
    }
    size
}

#[cfg(test)]
fn clean_ass_text(text: &str) -> String {
    ass_lines(text, None, &Default::default())
        .into_iter()
        .map(|(l, _)| l)
        .collect::<Vec<_>>()
        .join("\n")
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

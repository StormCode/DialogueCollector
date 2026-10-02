//! Invoking the ffmpeg sidecar.

use std::path::Path;
use std::sync::atomic::AtomicBool;
use std::time::{Duration, Instant};

use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

use super::{process, MediaError};

/// Sidecar name: the file stem registered under `bundle.externalBin` (`binaries/ffmpeg`).
const FFMPEG: &str = "ffmpeg";

/// One cue: `[start_ms, end_ms)` of `source`'s first audio stream, encoded to AAC in an m4a
/// container at `out`. Input-side `-ss` is fast and, because the audio is re-encoded,
/// sample-accurate.
pub async fn cut_cue(
    app: &AppHandle,
    source: &Path,
    start_ms: u64,
    end_ms: u64,
    out: &Path,
) -> Result<Duration, MediaError> {
    let args = cut_cue_args(source, start_ms, end_ms, out);
    run(app, &args).await
}

pub(crate) fn cut_cue_args(source: &Path, start_ms: u64, end_ms: u64, out: &Path) -> Vec<String> {
    let secs = |ms: u64| format!("{}.{:03}", ms / 1000, ms % 1000);
    [
        "-hide_banner",
        "-nostdin",
        "-v",
        "error",
        "-ss",
        &secs(start_ms),
        "-i",
        &source.to_string_lossy(),
        "-t",
        &secs(end_ms.saturating_sub(start_ms)),
        "-map",
        "0:a:0",
        "-vn",
        "-sn",
        "-dn",
        "-c:a",
        "aac",
        "-b:a",
        "160k",
        "-movflags",
        "+faststart",
        // The output may carry a `.tmp` suffix, so the muxer cannot come from the extension.
        "-f",
        "ipod",
        "-y",
        &out.to_string_lossy(),
    ]
    .into_iter()
    .map(str::to_owned)
    .collect()
}

/// Imports: encode one cue with the sidecar at `ffmpeg`, killed at once if `cancel` is set.
pub fn encode_cue(
    ffmpeg: &Path,
    source: &Path,
    start_ms: u64,
    end_ms: u64,
    out: &Path,
    cancel: &AtomicBool,
) -> Result<Duration, MediaError> {
    let args = cut_cue_args(source, start_ms, end_ms, out);
    Ok(process::run(process::command(ffmpeg, &args), cancel)?.elapsed)
}

/// 直接匯入 of a video: its whole first audio stream, encoded as `cut_cue_args` does.
pub(crate) fn extract_audio_args(source: &Path, out: &Path) -> Vec<String> {
    [
        "-hide_banner",
        "-nostdin",
        "-v",
        "error",
        "-i",
        &source.to_string_lossy(),
        "-map",
        "0:a:0",
        "-vn",
        "-sn",
        "-dn",
        "-c:a",
        "aac",
        "-b:a",
        "160k",
        "-movflags",
        "+faststart",
        "-f",
        "ipod",
        "-y",
        &out.to_string_lossy(),
    ]
    .into_iter()
    .map(str::to_owned)
    .collect()
}

/// Encodes the whole of `source`'s first audio stream to m4a at `out`; killed at once if
/// `cancel` is set.
pub fn extract_audio(
    ffmpeg: &Path,
    source: &Path,
    out: &Path,
    cancel: &AtomicBool,
) -> Result<Duration, MediaError> {
    let args = extract_audio_args(source, out);
    Ok(process::run(process::command(ffmpeg, &args), cancel)?.elapsed)
}

/// A subtitle stream inside a video, as 選擇字幕軌 lists it.
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubtitleTrack {
    /// The stream's index in the container: `-map 0:<index>` extracts it.
    pub index: u32,
    /// subrip, ass, mov_text, webvtt, …
    pub codec: String,
    /// ISO 639 code from the stream tags (jpn, chi, eng, …), if any.
    pub language: Option<String>,
    /// The stream's title or handler name, if any.
    pub title: Option<String>,
}

/// Text subtitle codecs ffmpeg can turn into ASS or SRT. Picture-based ones (PGS, VobSub,
/// DVB) have no text to read and are left out.
const TEXT_SUBTITLE_CODECS: &[&str] =
    &["subrip", "srt", "ass", "ssa", "mov_text", "webvtt", "text"];

/// The video's text subtitle streams, in container order.
pub fn probe_subtitle_tracks(
    ffprobe: &Path,
    source: &Path,
    cancel: &AtomicBool,
) -> Result<Vec<SubtitleTrack>, MediaError> {
    let args: Vec<String> = [
        "-v",
        "error",
        "-select_streams",
        "s",
        "-show_entries",
        "stream=index,codec_name:stream_tags=language,title,handler_name",
        "-of",
        "json",
    ]
    .into_iter()
    .map(str::to_owned)
    .chain([source.to_string_lossy().into_owned()])
    .collect();
    let out = process::run(process::command(ffprobe, &args), cancel)?;
    parse_subtitle_tracks(&out.stdout)
}

pub(crate) fn parse_subtitle_tracks(json: &[u8]) -> Result<Vec<SubtitleTrack>, MediaError> {
    #[derive(serde::Deserialize)]
    struct Raw {
        #[serde(default)]
        streams: Vec<Stream>,
    }
    #[derive(serde::Deserialize)]
    struct Stream {
        index: u32,
        codec_name: Option<String>,
        #[serde(default)]
        tags: std::collections::HashMap<String, String>,
    }
    let raw: Raw = serde_json::from_slice(json).map_err(|e| MediaError::Exit {
        code: None,
        stderr_tail: format!("unreadable ffprobe output: {e}"),
    })?;
    let tag = |tags: &std::collections::HashMap<String, String>, name: &str| {
        tags.iter()
            .find(|(k, _)| k.eq_ignore_ascii_case(name))
            .map(|(_, v)| v.trim().to_owned())
            .filter(|v| !v.is_empty() && !v.eq_ignore_ascii_case("und"))
    };
    Ok(raw
        .streams
        .into_iter()
        .filter_map(|s| {
            let codec = s.codec_name?.to_ascii_lowercase();
            TEXT_SUBTITLE_CODECS
                .contains(&codec.as_str())
                .then(|| SubtitleTrack {
                    index: s.index,
                    language: tag(&s.tags, "language"),
                    // A handler name like "SubtitleHandler" says nothing; only a real one counts.
                    title: tag(&s.tags, "title").or_else(|| {
                        tag(&s.tags, "handler_name")
                            .filter(|h| !h.to_ascii_lowercase().contains("handler"))
                    }),
                    codec,
                })
        })
        .collect())
}

/// The file extension a track is extracted to: ASS stays ASS (its styles pair bilingual
/// lines), everything else becomes SRT.
pub fn subtitle_extension(codec: &str) -> &'static str {
    if matches!(codec, "ass" | "ssa") {
        "ass"
    } else {
        "srt"
    }
}

pub(crate) fn extract_subtitle_args(
    source: &Path,
    index: u32,
    codec: &str,
    out: &Path,
) -> Vec<String> {
    let encoder = if subtitle_extension(codec) == "ass" {
        "copy"
    } else {
        "srt"
    };
    let format = subtitle_extension(codec);
    [
        "-hide_banner",
        "-nostdin",
        "-v",
        "error",
        "-i",
        &source.to_string_lossy(),
        "-map",
        &format!("0:{index}"),
        "-c:s",
        encoder,
        "-f",
        format,
        "-y",
        &out.to_string_lossy(),
    ]
    .into_iter()
    .map(str::to_owned)
    .collect()
}

/// Writes subtitle stream `index` of `source` to `out` as ASS or SRT (see `subtitle_extension`).
pub fn extract_subtitle(
    ffmpeg: &Path,
    source: &Path,
    index: u32,
    codec: &str,
    out: &Path,
    cancel: &AtomicBool,
) -> Result<(), MediaError> {
    let args = extract_subtitle_args(source, index, codec, out);
    process::run(process::command(ffmpeg, &args), cancel).map(|_| ())
}

/// What an import needs to know about a video before cutting it.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Probe {
    /// `None` when the container does not state one.
    pub duration_ms: Option<u64>,
    pub has_audio: bool,
}

/// Reads the container duration and whether any audio stream exists, with ffprobe.
pub fn probe(ffprobe: &Path, source: &Path, cancel: &AtomicBool) -> Result<Probe, MediaError> {
    let args: Vec<String> = [
        "-v",
        "error",
        "-show_entries",
        "format=duration:stream=codec_type",
        "-of",
        "json",
    ]
    .into_iter()
    .map(str::to_owned)
    .chain([source.to_string_lossy().into_owned()])
    .collect();
    let out = process::run(process::command(ffprobe, &args), cancel)?;
    parse_probe(&out.stdout)
}

pub(crate) fn parse_probe(json: &[u8]) -> Result<Probe, MediaError> {
    #[derive(serde::Deserialize)]
    struct Raw {
        #[serde(default)]
        streams: Vec<Stream>,
        format: Option<Format>,
    }
    #[derive(serde::Deserialize)]
    struct Stream {
        codec_type: Option<String>,
    }
    #[derive(serde::Deserialize)]
    struct Format {
        duration: Option<String>,
    }
    let raw: Raw = serde_json::from_slice(json).map_err(|e| MediaError::Exit {
        code: None,
        stderr_tail: format!("unreadable ffprobe output: {e}"),
    })?;
    let duration_ms = raw
        .format
        .and_then(|f| f.duration)
        .and_then(|d| d.parse::<f64>().ok())
        .filter(|d| d.is_finite() && *d > 0.0)
        .map(|d| (d * 1000.0).round() as u64);
    let has_audio = raw
        .streams
        .iter()
        .any(|s| s.codec_type.as_deref() == Some("audio"));
    Ok(Probe {
        duration_ms,
        has_audio,
    })
}

/// Run the sidecar to completion and map its outcome onto `MediaError`.
pub async fn run(app: &AppHandle, args: &[String]) -> Result<Duration, MediaError> {
    let started = Instant::now();
    let output = app
        .shell()
        .sidecar(FFMPEG)
        .map_err(|e| MediaError::SidecarUnusable(e.to_string()))?
        .args(args)
        .output()
        .await
        .map_err(|e| MediaError::SidecarUnusable(e.to_string()))?;

    if output.status.success() {
        return Ok(started.elapsed());
    }
    let stderr = String::from_utf8_lossy(&output.stderr);
    let tail = super::process::stderr_tail(&stderr);
    match output.status.code() {
        // No exit code: terminated by a signal.
        None => Err(MediaError::Killed),
        code => Err(MediaError::Exit {
            code,
            stderr_tail: tail,
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn subtitle_tracks_keep_text_streams_with_their_tags() {
        let json = br#"{"streams":[
            {"index":2,"codec_name":"subrip","tags":{"language":"jpn","title":"\u65e5\u672c\u8a9e"}},
            {"index":3,"codec_name":"hdmv_pgs_subtitle","tags":{"language":"chi"}},
            {"index":4,"codec_name":"ass","tags":{"LANGUAGE":"chi","handler_name":"SubtitleHandler"}},
            {"index":5,"codec_name":"mov_text","tags":{"language":"und"}}
        ]}"#;
        let tracks = parse_subtitle_tracks(json).unwrap();
        assert_eq!(
            tracks.iter().map(|t| t.index).collect::<Vec<_>>(),
            [2, 4, 5],
            "PGS has no text"
        );
        assert_eq!(tracks[0].language.as_deref(), Some("jpn"));
        assert_eq!(tracks[0].title.as_deref(), Some("日本語"));
        assert_eq!(tracks[1].language.as_deref(), Some("chi"));
        assert_eq!(tracks[1].title, None, "a bare handler name is no title");
        assert_eq!(tracks[2].language, None, "und is no language");
        assert_eq!(subtitle_extension(&tracks[1].codec), "ass");
        assert_eq!(subtitle_extension(&tracks[2].codec), "srt");
    }

    #[test]
    fn extract_args_take_the_whole_first_audio_stream() {
        let args = extract_audio_args(Path::new("/v/ep01.mkv"), Path::new("/l/.tmp/A.tmp"));
        assert!(!args.iter().any(|a| a == "-ss" || a == "-t"));
        let map = args.iter().position(|a| a == "-map").unwrap();
        assert_eq!(args[map + 1], "0:a:0");
        assert_eq!(args.last().unwrap(), "/l/.tmp/A.tmp");
        let format = args.iter().position(|a| a == "-f").unwrap();
        assert_eq!(args[format + 1], "ipod");
    }

    #[test]
    fn cut_args_seek_on_input_and_encode_audio_only() {
        let args = cut_cue_args(
            Path::new("/v/ep01.mkv"),
            61_050,
            63_500,
            Path::new("/l/A.m4a"),
        );
        let at = |flag: &str| args[args.iter().position(|a| a == flag).unwrap() + 1].clone();
        assert!(args.iter().position(|a| a == "-ss") < args.iter().position(|a| a == "-i"));
        assert_eq!(at("-ss"), "61.050");
        assert_eq!(at("-t"), "2.450");
        assert_eq!(at("-map"), "0:a:0");
        assert_eq!(at("-c:a"), "aac");
        assert!(args.contains(&"-vn".to_owned()));
        assert_eq!(args.last().unwrap(), "/l/A.m4a");
    }

    #[test]
    fn probe_reads_duration_and_audio() {
        let json = br#"{"streams":[{"codec_type":"video"},{"codec_type":"audio"}],
                        "format":{"duration":"1441.458000"}}"#;
        assert_eq!(
            parse_probe(json).unwrap(),
            Probe {
                duration_ms: Some(1_441_458),
                has_audio: true
            }
        );
        let silent = br#"{"streams":[{"codec_type":"video"}],"format":{}}"#;
        assert_eq!(
            parse_probe(silent).unwrap(),
            Probe {
                duration_ms: None,
                has_audio: false
            }
        );
    }
}

/// The real sidecars: an MKV carrying an SRT and an ASS track lists both, and each comes back
/// out as text the parser reads. Skipped where the pinned binaries are not built.
#[cfg(test)]
mod real_sidecars {
    use std::sync::atomic::AtomicBool;

    use super::*;

    #[test]
    fn real_ffmpeg_lists_and_extracts_embedded_subtitles() {
        let triple = match (std::env::consts::ARCH, std::env::consts::OS) {
            ("aarch64", "macos") => "aarch64-apple-darwin",
            ("x86_64", "macos") => "x86_64-apple-darwin",
            ("x86_64", "windows") => "x86_64-pc-windows-msvc",
            _ => return,
        };
        let bin = |name: &str| {
            Path::new(env!("CARGO_MANIFEST_DIR"))
                .join("binaries")
                .join(format!("{name}-{triple}{}", std::env::consts::EXE_SUFFIX))
        };
        let (ffmpeg, ffprobe) = (bin("ffmpeg"), bin("ffprobe"));
        if !ffmpeg.is_file() || !ffprobe.is_file() {
            eprintln!("skipped: {} not built", ffmpeg.display());
            return;
        }
        let dir = tempfile::tempdir().unwrap();
        let srt = dir.path().join("jp.srt");
        std::fs::write(&srt, "1\n00:00:01,000 --> 00:00:02,500\nこんにちは\n").unwrap();
        let ass = dir.path().join("cn.ass");
        std::fs::write(
            &ass,
            "[Script Info]\nScriptType: v4.00+\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize\nStyle: Text - CN,Arial,20\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\nDialogue: 0,0:00:01.00,0:00:02.50,Text - CN,,0,0,0,,你好\n",
        )
        .unwrap();
        let video = dir.path().join("ep.mkv");
        let ok = std::process::Command::new(&ffmpeg)
            .args(["-v", "error", "-f", "lavfi", "-i", "sine=duration=3"])
            .arg("-i")
            .arg(&srt)
            .arg("-i")
            .arg(&ass)
            .args([
                "-map", "0", "-map", "1", "-map", "2", "-c:a", "aac", "-c:s:0", "srt", "-c:s:1",
                "copy",
            ])
            .args([
                "-metadata:s:s:0",
                "language=jpn",
                "-metadata:s:s:1",
                "language=chi",
                "-y",
            ])
            .arg(&video)
            .status()
            .unwrap()
            .success();
        assert!(ok, "could not build the test video");

        let never = AtomicBool::new(false);
        let tracks = probe_subtitle_tracks(&ffprobe, &video, &never).unwrap();
        assert_eq!(tracks.len(), 2, "{tracks:?}");
        assert_eq!(tracks[0].language.as_deref(), Some("jpn"));
        for (track, expected) in tracks.iter().zip(["こんにちは", "你好"]) {
            let out = dir.path().join(format!(
                "t{}.{}",
                track.index,
                subtitle_extension(&track.codec)
            ));
            extract_subtitle(&ffmpeg, &video, track.index, &track.codec, &out, &never).unwrap();
            let cues = crate::subs::parse_file(&out).unwrap();
            assert_eq!(cues.len(), 1, "{out:?}");
            assert_eq!(cues[0].text, expected);
            assert_eq!((cues[0].start_ms, cues[0].end_ms), (1000, 2500));
        }
    }
}

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

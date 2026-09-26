//! Invoking the ffmpeg sidecar.

use std::path::Path;
use std::time::{Duration, Instant};

use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

use super::MediaError;

/// Sidecar name: the file stem registered under `bundle.externalBin` (`binaries/ffmpeg`).
const FFMPEG: &str = "ffmpeg";

/// Bytes of stderr kept for error reports and logs (T19 wants the last line).
const STDERR_TAIL: usize = 600;

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
    let tail = stderr_tail(&stderr);
    match output.status.code() {
        // No exit code: terminated by a signal.
        None => Err(MediaError::Killed),
        code => Err(MediaError::Exit {
            code,
            stderr_tail: tail,
        }),
    }
}

fn stderr_tail(stderr: &str) -> String {
    let trimmed = stderr.trim_end();
    let start = trimmed
        .char_indices()
        .rev()
        .nth(STDERR_TAIL)
        .map_or(0, |(i, _)| i);
    trimmed[start..].to_owned()
}

#[cfg(test)]
mod tests {
    use super::*;

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
    fn stderr_tail_keeps_the_end() {
        let long = "x".repeat(2000) + "last line";
        let tail = stderr_tail(&long);
        assert!(tail.ends_with("last line"));
        assert!(tail.chars().count() <= STDERR_TAIL + 1);
    }
}

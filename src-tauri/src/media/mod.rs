//! The bundled ffmpeg sidecar (D7 → A). One ffmpeg pass per cue: seek + audio-only + encode
//! straight to `.m4a` — there is no intermediate video segment and no temp video dir (D1).
//!
//! TODO(T1/T3): register `binaries/ffmpeg` (and `ffprobe`) under `bundle.externalBin` once an
//! LGPL build is pinned with a SHA256 per target. Until then the sidecar is not bundled.
//! TODO(T2/ET8): measure per-cue cost; if > 500 ms/cue, fall back to one invocation per source
//! with many `-ss`/`-to` outputs, chunked under Windows' 32767-char argv limit.

use rand::Rng;

/// Sidecar name as registered in `tauri.conf.json` `bundle.externalBin`.
pub const FFMPEG_SIDECAR: &str = "binaries/ffmpeg";

/// Containers accepted by the subtitle path (G3: TS was cut).
pub const VIDEO_EXTENSIONS: &[&str] = &["mkv", "mp4", "webm"];

pub const CLIP_EXTENSION: &str = "m4a";
const CLIP_NAME_LEN: usize = 12;
const CLIP_NAME_ALPHABET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

#[derive(Debug, thiserror::Error)]
pub enum MediaError {
    #[error("failed to spawn ffmpeg: {0}")]
    Spawn(String),

    #[error("ffmpeg exited with code {code:?}: {stderr_tail}")]
    Exit {
        code: Option<i32>,
        stderr_tail: String,
    },

    #[error("ffmpeg was killed")]
    Killed,
}

/// A new clip filename: 12 random uppercase alphanumerics plus `.m4a`.
/// Uniqueness is enforced by `lines(audio_filename) UNIQUE`, not by this function.
pub fn new_clip_filename() -> String {
    let mut rng = rand::rng();
    let stem: String = (0..CLIP_NAME_LEN)
        .map(|_| CLIP_NAME_ALPHABET[rng.random_range(0..CLIP_NAME_ALPHABET.len())] as char)
        .collect();
    format!("{stem}.{CLIP_EXTENSION}")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn clip_filename_is_twelve_uppercase_alphanumerics() {
        let name = new_clip_filename();
        let (stem, ext) = name.split_once('.').unwrap();
        assert_eq!(ext, "m4a");
        assert_eq!(stem.len(), 12);
        assert!(stem.bytes().all(|b| CLIP_NAME_ALPHABET.contains(&b)));
    }
}

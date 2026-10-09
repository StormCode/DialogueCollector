//! The bundled ffmpeg sidecar. One ffmpeg pass per cue: seek + audio-only + encode
//! straight to `.m4a` — there is no intermediate video segment and no temp video dir.
//!
//! The sidecar binaries are LGPL builds pinned in `scripts/ffmpeg/pins.json` and
//! registered under `bundle.externalBin`.
//! TODO: measure per-cue cost; if > 500 ms/cue, fall back to one invocation per source
//! with many `-ss`/`-to` outputs, chunked under Windows' 32767-char argv limit.

pub mod ffmpeg;
pub mod process;

use rand::Rng;

/// Sources the subtitle path cuts from (the board lists MKV、MP4、WEBM、OGG、M4A、MP3; TS was dropped).
/// Audio files work too: the cut takes the first audio stream either way.
pub const SOURCE_EXTENSIONS: &[&str] = &["mkv", "mp4", "webm", "ogg", "m4a", "mp3"];

pub const CLIP_EXTENSION: &str = "m4a";

/// Extensions a clip in the library may have: `m4a` from ffmpeg, or an audio file that 直接匯入
/// copied in as it was: WAV, M4A, MP3 (schema v3).
pub const CLIP_EXTENSIONS: &[&str] = &["m4a", "mp3", "wav"];
const CLIP_NAME_LEN: usize = 12;
const CLIP_NAME_ALPHABET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

#[derive(Debug, thiserror::Error)]
pub enum MediaError {
    /// The bundled binary exists but cannot run: missing, quarantined, unsigned, or lost its
    /// `+x` bit. User-visible as 「內建的 ffmpeg 無法執行」.
    #[error("the bundled ffmpeg cannot be executed: {0}")]
    SidecarUnusable(String),

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
    new_clip_filename_with(CLIP_EXTENSION)
}

/// The same with another of `CLIP_EXTENSIONS`.
pub fn new_clip_filename_with(extension: &str) -> String {
    debug_assert!(CLIP_EXTENSIONS.contains(&extension));
    let mut rng = rand::rng();
    let stem: String = (0..CLIP_NAME_LEN)
        .map(|_| CLIP_NAME_ALPHABET[rng.random_range(0..CLIP_NAME_ALPHABET.len())] as char)
        .collect();
    format!("{stem}.{extension}")
}

/// Whether `name` is a clip this app wrote: 12 uppercase alphanumerics and a clip extension.
pub fn is_clip_name(name: &str) -> bool {
    name.split_once('.').is_some_and(|(stem, ext)| {
        CLIP_EXTENSIONS.contains(&ext)
            && stem.len() == CLIP_NAME_LEN
            && stem.bytes().all(|b| CLIP_NAME_ALPHABET.contains(&b))
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn clip_names_keep_one_of_the_clip_extensions() {
        assert!(new_clip_filename_with("mp3").ends_with(".mp3"));
        assert!(is_clip_name(&new_clip_filename_with("wav")));
        assert!(!is_clip_name("ABCDEFGHIJKL.ogg"));
        assert!(is_clip_name("ABCDEFGHIJKL.m4a"));
        assert!(!is_clip_name("ABCDEFGHIJKL.flac"));
        assert!(!is_clip_name("abcdefghijkl.mp3"));
        assert!(!is_clip_name("ABCDEFGHIJK.mp3"));
        assert!(!is_clip_name("ABCDEFGHIJKL.m4a.tmp"));
    }

    #[test]
    fn clip_filename_is_twelve_uppercase_alphanumerics() {
        let name = new_clip_filename();
        let (stem, ext) = name.split_once('.').unwrap();
        assert_eq!(ext, "m4a");
        assert_eq!(stem.len(), 12);
        assert!(stem.bytes().all(|b| CLIP_NAME_ALPHABET.contains(&b)));
    }
}

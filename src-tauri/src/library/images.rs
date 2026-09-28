//! Portraits and banner posters live in `<library>/images/<name>.<ext>` (R1, T12), so export,
//! import and 驗證收藏庫 carry them with the library.
//!
//! A file is accepted by its header, never its extension: PNG, JPEG or GIF magic bytes, at most
//! `MAX_BYTES`, and at most `MAX_PIXELS` as declared in the header — a small file can still
//! decode to a huge image (S3), so the dimensions are checked without decoding anything.

use std::fs;
use std::io::Write;
use std::path::Path;

use imagesize::ImageType;
use rand::Rng;

use super::paths::{IMAGES_DIR, TMP_DIR};

pub const MAX_BYTES: u64 = 20 * 1024 * 1024;
pub const MAX_PIXELS: u64 = 32_000_000;

#[derive(Debug, thiserror::Error)]
pub enum ImageError {
    #[error("{path}: {source}")]
    Io {
        path: std::path::PathBuf,
        #[source]
        source: std::io::Error,
    },
    /// Not a PNG, JPEG or GIF, whatever the extension says.
    #[error("not a PNG, JPEG or GIF image")]
    Unsupported,
    #[error("image is too large ({0})")]
    TooLarge(String),
}

impl ImageError {
    pub fn kind(&self) -> &'static str {
        match self {
            Self::Io { .. } => "Io",
            Self::Unsupported => "Unsupported",
            Self::TooLarge(_) => "TooLarge",
        }
    }

    fn io(path: &Path, source: std::io::Error) -> Self {
        Self::Io {
            path: path.to_owned(),
            source,
        }
    }
}

/// Validates `source` and copies it into `<library>/images/` under a fresh name. Returns the
/// file name (relative to `images/`), which is what `characters.portrait_file` stores.
pub fn store(library: &Path, source: &Path) -> Result<String, ImageError> {
    let bytes_on_disk = fs::metadata(source)
        .map_err(|e| ImageError::io(source, e))?
        .len();
    if bytes_on_disk > MAX_BYTES {
        return Err(ImageError::TooLarge(format!("{bytes_on_disk} bytes")));
    }
    let data = fs::read(source).map_err(|e| ImageError::io(source, e))?;
    let ext = validate(&data)?;

    let images = library.join(IMAGES_DIR);
    for _ in 0..8 {
        let name = format!("{}.{ext}", random_stem());
        let target = images.join(&name);
        if target.exists() {
            continue;
        }
        // Written under .tmp first so a crash never leaves half an image under images/.
        let staged = library.join(TMP_DIR).join(format!("{name}.tmp"));
        let mut file = fs::File::create(&staged).map_err(|e| ImageError::io(&staged, e))?;
        file.write_all(&data)
            .and_then(|()| file.sync_all())
            .map_err(|e| ImageError::io(&staged, e))?;
        drop(file);
        fs::rename(&staged, &target).map_err(|e| ImageError::io(&target, e))?;
        return Ok(name);
    }
    Err(ImageError::io(
        &images,
        std::io::Error::new(std::io::ErrorKind::AlreadyExists, "no free image name"),
    ))
}

/// The accepted format's extension, checked by magic bytes and declared size.
pub fn validate(data: &[u8]) -> Result<&'static str, ImageError> {
    let ext = match imagesize::image_type(data) {
        Ok(ImageType::Png) => "png",
        Ok(ImageType::Jpeg) => "jpg",
        Ok(ImageType::Gif) => "gif",
        _ => return Err(ImageError::Unsupported),
    };
    let size = imagesize::blob_size(data).map_err(|_| ImageError::Unsupported)?;
    let pixels = size.width as u64 * size.height as u64;
    if pixels == 0 {
        return Err(ImageError::Unsupported);
    }
    if pixels > MAX_PIXELS {
        return Err(ImageError::TooLarge(format!(
            "{}×{}",
            size.width, size.height
        )));
    }
    Ok(ext)
}

fn random_stem() -> String {
    const ALPHABET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let mut rng = rand::rng();
    (0..12)
        .map(|_| ALPHABET[rng.random_range(0..ALPHABET.len())] as char)
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::library::folder::Library;

    /// A minimal PNG header declaring `width` × `height` (enough for header checks).
    fn png(width: u32, height: u32) -> Vec<u8> {
        let mut data = b"\x89PNG\r\n\x1a\n\0\0\0\rIHDR".to_vec();
        data.extend_from_slice(&width.to_be_bytes());
        data.extend_from_slice(&height.to_be_bytes());
        data.extend_from_slice(&[8, 6, 0, 0, 0, 0, 0, 0, 0]);
        data
    }

    #[test]
    fn a_real_png_is_stored_under_images() {
        let dir = tempfile::tempdir().unwrap();
        let lib = Library::create(&dir.path().join("lib")).unwrap();
        let src = dir.path().join("frieren.png");
        fs::write(&src, png(512, 512)).unwrap();

        let name = store(lib.root(), &src).unwrap();
        assert!(name.ends_with(".png") && name.len() == 16);
        assert_eq!(
            fs::read(lib.root().join(IMAGES_DIR).join(&name)).unwrap(),
            png(512, 512)
        );
        assert_eq!(fs::read_dir(lib.root().join(TMP_DIR)).unwrap().count(), 0);
    }

    #[test]
    fn a_fake_png_is_refused_by_its_header() {
        assert!(matches!(
            validate(b"just text, named .png"),
            Err(ImageError::Unsupported)
        ));
    }

    #[test]
    fn an_eighty_megapixel_bomb_is_refused() {
        assert!(matches!(
            validate(&png(10_000, 8_000)),
            Err(ImageError::TooLarge(_))
        ));
        assert_eq!(validate(&png(5_000, 5_000)).unwrap(), "png");
    }

    #[test]
    fn jpeg_and_gif_are_recognised_by_magic_bytes() {
        let gif = b"GIF89a\x40\x01\xf0\x00\0\0\0".to_vec(); // 320×240
        assert_eq!(validate(&gif).unwrap(), "gif");
        // SOI, then a SOF0 segment declaring 640×480.
        let jpeg = [
            0xFF, 0xD8, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x01, 0xE0, 0x02, 0x80, 0x03, 0x01, 0x22,
            0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0xFF, 0xD9,
        ];
        assert_eq!(validate(&jpeg).unwrap(), "jpg");
    }
}

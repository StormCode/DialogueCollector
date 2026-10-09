//! Portraits and banner posters live in `<library>/images/<name>.<ext>`, so export,
//! import and 驗證收藏庫 carry them with the library.
//!
//! A file is accepted by its header, never its extension: PNG, JPEG or GIF magic bytes, at most
//! `MAX_BYTES`, and at most `MAX_PIXELS` as declared in the header — a small file can still
//! decode to a huge image, so the dimensions are checked without decoding anything.

use std::fs;
use std::io::Write;
use std::path::Path;

use imagesize::ImageType;
use rand::Rng;

use super::paths::{IMAGES_DIR, TMP_DIR};

pub const MAX_BYTES: u64 = 20 * 1024 * 1024;
pub const MAX_PIXELS: u64 = 32_000_000;

/// A portrait whose sides both pass this is scaled down, keeping its shape, until the shorter
/// side is this long: 480 × N or N × 480, so 編輯角色's 240 px preview stays
/// sharp on a 2× screen (the 台詞本 card shows it at 72 px), cropped to fill.
pub const PORTRAIT_SHORT_SIDE: u32 = 480;

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

/// Validates `source` and copies it into `<library>/images/` under a fresh name, as it is (a
/// banner poster). Returns the file name (relative to `images/`), which is what the database
/// stores.
pub fn store(library: &Path, source: &Path) -> Result<String, ImageError> {
    let (data, ext) = read_valid(source)?;
    write_new(library, &data, ext)
}

/// `store` for a character portrait: scaled down first when both sides pass
/// `PORTRAIT_SHORT_SIDE` (see `shrink`).
pub fn store_portrait(library: &Path, source: &Path) -> Result<String, ImageError> {
    let (data, ext) = read_valid(source)?;
    let data = shrink(data, ext, PORTRAIT_SHORT_SIDE)?;
    write_new(library, &data, ext)
}

/// Scales a PNG or JPEG down, keeping its shape, so its shorter side is `short_side`, when both
/// sides are longer; re-encoded in its own format (a PNG keeps its transparency). Smaller images
/// and GIFs (whose animation would be lost) are returned as they are.
pub fn shrink(data: Vec<u8>, ext: &'static str, short_side: u32) -> Result<Vec<u8>, ImageError> {
    let format = match ext {
        "png" => image::ImageFormat::Png,
        "jpg" => image::ImageFormat::Jpeg,
        _ => return Ok(data),
    };
    let size = imagesize::blob_size(&data).map_err(|_| ImageError::Unsupported)?;
    let (w, h) = (size.width as u64, size.height as u64);
    if w.min(h) <= short_side as u64 {
        return Ok(data);
    }
    let decoded =
        image::load_from_memory_with_format(&data, format).map_err(|_| ImageError::Unsupported)?;
    let (nw, nh) = if w <= h {
        (short_side, ((h * short_side as u64 + w / 2) / w) as u32)
    } else {
        (((w * short_side as u64 + h / 2) / h) as u32, short_side)
    };
    let resized = decoded.resize_exact(nw, nh, image::imageops::FilterType::Lanczos3);
    let mut out = std::io::Cursor::new(Vec::new());
    let encoded = match format {
        image::ImageFormat::Jpeg => resized.to_rgb8().write_with_encoder(
            image::codecs::jpeg::JpegEncoder::new_with_quality(&mut out, 90),
        ),
        _ => resized.write_to(&mut out, format),
    };
    encoded.map_err(|_| ImageError::Unsupported)?;
    Ok(out.into_inner())
}

/// The file's bytes and extension, once it passes the size and format checks.
fn read_valid(source: &Path) -> Result<(Vec<u8>, &'static str), ImageError> {
    let bytes_on_disk = fs::metadata(source)
        .map_err(|e| ImageError::io(source, e))?
        .len();
    if bytes_on_disk > MAX_BYTES {
        return Err(ImageError::TooLarge(format!("{bytes_on_disk} bytes")));
    }
    let data = fs::read(source).map_err(|e| ImageError::io(source, e))?;
    let ext = validate(&data)?;
    Ok((data, ext))
}

/// Writes `data` into `<library>/images/` under a fresh name.
fn write_new(library: &Path, data: &[u8], ext: &str) -> Result<String, ImageError> {
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
        file.write_all(data)
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

    /// A real image `width` × `height` in `format`, half transparent when PNG.
    fn encoded(width: u32, height: u32, format: image::ImageFormat) -> Vec<u8> {
        let img = image::RgbaImage::from_fn(width, height, |x, _| {
            image::Rgba([200, 100, 50, if x < width / 2 { 0 } else { 255 }])
        });
        let mut out = std::io::Cursor::new(Vec::new());
        match format {
            image::ImageFormat::Jpeg => image::DynamicImage::ImageRgba8(img)
                .to_rgb8()
                .write_to(&mut out, format),
            _ => img.write_to(&mut out, format),
        }
        .unwrap();
        out.into_inner()
    }

    fn stored_size(lib: &Library, name: &str) -> (u32, u32) {
        let size = imagesize::size(lib.root().join(IMAGES_DIR).join(name)).unwrap();
        (size.width as u32, size.height as u32)
    }

    #[test]
    fn a_large_portrait_is_scaled_down_to_a_480_px_short_side() {
        let dir = tempfile::tempdir().unwrap();
        let lib = Library::create(&dir.path().join("lib")).unwrap();
        let wide = dir.path().join("wide.png");
        fs::write(&wide, encoded(1200, 600, image::ImageFormat::Png)).unwrap();
        let tall = dir.path().join("tall.jpg");
        fs::write(&tall, encoded(600, 1200, image::ImageFormat::Jpeg)).unwrap();

        let name = store_portrait(lib.root(), &wide).unwrap();
        assert!(name.ends_with(".png"));
        assert_eq!(stored_size(&lib, &name), (960, 480));
        // Its transparency survives.
        let back = image::open(lib.root().join(IMAGES_DIR).join(&name))
            .unwrap()
            .to_rgba8();
        assert_eq!(back.get_pixel(5, 240)[3], 0);
        assert_eq!(back.get_pixel(955, 240)[3], 255);

        let name = store_portrait(lib.root(), &tall).unwrap();
        assert!(name.ends_with(".jpg"));
        assert_eq!(stored_size(&lib, &name), (480, 960));
    }

    #[test]
    fn small_portraits_gifs_and_posters_are_kept_as_they_are() {
        let dir = tempfile::tempdir().unwrap();
        let lib = Library::create(&dir.path().join("lib")).unwrap();
        let read = |name: &str| fs::read(lib.root().join(IMAGES_DIR).join(name)).unwrap();

        // One side within 480 px: no shorter side to bring down.
        let small = encoded(800, 400, image::ImageFormat::Png);
        let src = dir.path().join("small.png");
        fs::write(&src, &small).unwrap();
        assert_eq!(read(&store_portrait(lib.root(), &src).unwrap()), small);

        // A GIF header declaring 300 × 300: never decoded, so the header is enough.
        let mut gif = b"GIF89a".to_vec();
        gif.extend_from_slice(&300u16.to_le_bytes());
        gif.extend_from_slice(&300u16.to_le_bytes());
        gif.extend_from_slice(&[0, 0, 0, 0x3b]);
        let src = dir.path().join("anim.gif");
        fs::write(&src, &gif).unwrap();
        assert_eq!(read(&store_portrait(lib.root(), &src).unwrap()), gif);

        // A banner poster keeps its full size.
        let poster = encoded(1600, 400, image::ImageFormat::Png);
        let src = dir.path().join("poster.png");
        fs::write(&src, &poster).unwrap();
        assert_eq!(read(&store(lib.root(), &src).unwrap()), poster);
    }
}

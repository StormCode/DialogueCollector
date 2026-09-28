//! Fixed OS locations.
//!
//! - Settings directory (ENG17, not user-relocatable):
//!   macOS `~/Library/Preferences/DialogueCollector/`, Windows `%APPDATA%\DialogueCollector\`.
//!   Files there must never be named `*.plist` — `cfprefsd` owns that namespace on macOS.
//! - Default library folder (draft 檔案管理, user-relocatable):
//!   macOS `~/Library/Application Support/DialogueCollector`,
//!   Windows `%LOCALAPPDATA%\DialogueCollector`.

use std::path::PathBuf;

use super::LibraryError;

pub const APP_DIR_NAME: &str = "DialogueCollector";

pub const SETTINGS_FILE: &str = "settings.json";
pub const MACHINE_FILE: &str = "machine.json";

pub const DB_FILE: &str = "library.sqlite";
pub const IMAGES_DIR: &str = "images";
pub const TMP_DIR: &str = ".tmp";

pub fn settings_dir() -> Result<PathBuf, LibraryError> {
    // macOS: ~/Library/Preferences; Windows: Roaming AppData.
    dirs::preference_dir()
        .map(|d| d.join(APP_DIR_NAME))
        .ok_or(LibraryError::NoOsDir("preferences"))
}

pub fn default_library_dir() -> Result<PathBuf, LibraryError> {
    // macOS: ~/Library/Application Support; Windows: Local AppData.
    dirs::data_local_dir()
        .map(|d| d.join(APP_DIR_NAME))
        .ok_or(LibraryError::NoOsDir("local data"))
}

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
    // Not `dirs::preference_dir()` on Windows: that is Local AppData there, which would put the
    // settings files inside the default library folder (the 0.1.0/0.1.1 bug).
    #[cfg(windows)]
    let base = dirs::config_dir();
    #[cfg(not(windows))]
    let base = dirs::preference_dir();
    base.map(|d| d.join(APP_DIR_NAME))
        .ok_or(LibraryError::NoOsDir("preferences"))
}

/// Where 0.1.0 and 0.1.1 wrote the settings files on Windows: the default library folder.
/// `SettingsFiles::from_os` moves them out so that folder can become a library.
#[cfg(windows)]
pub fn legacy_settings_dir() -> Option<PathBuf> {
    dirs::data_local_dir().map(|d| d.join(APP_DIR_NAME))
}

pub fn default_library_dir() -> Result<PathBuf, LibraryError> {
    // macOS: ~/Library/Application Support; Windows: Local AppData.
    dirs::data_local_dir()
        .map(|d| d.join(APP_DIR_NAME))
        .ok_or(LibraryError::NoOsDir("local data"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn settings_never_live_in_or_around_the_default_library() {
        let settings = settings_dir().unwrap();
        let library = default_library_dir().unwrap();
        assert!(
            !settings.starts_with(&library) && !library.starts_with(&settings),
            "{} vs {}",
            settings.display(),
            library.display()
        );
    }
}

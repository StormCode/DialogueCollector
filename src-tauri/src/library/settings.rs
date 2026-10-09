//! The two settings files.
//!
//! | file            | contents                                              | in export zip |
//! |-----------------|-------------------------------------------------------|---------------|
//! | `settings.json` | theme, locale, per-page counts, line font, auto-update | yes           |
//! | `machine.json`  | library folder path, window geometry, last picker dir  | never         |
//!
//! "Import must not overwrite the library pointer" is structural: the pointer lives in a file
//! that never enters the archive. When adding a setting, the only decision is which struct it
//! belongs to — anything machine-specific (a path, a geometry) goes in `MachineSettings`.

use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use super::paths::{self, MACHINE_FILE, SETTINGS_FILE};
use super::LibraryError;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Theme {
    /// 靛藍 (default)
    Indigo,
    /// 舒適淺藍
    LightBlue,
    /// 寶石紅
    Ruby,
    /// 翠綠
    Emerald,
    /// 夕陽橘
    Sunset,
    /// 口紅粉
    Lipstick,
    /// 夜光黑
    Midnight,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Locale {
    #[serde(rename = "zh-Hant")]
    ZhHant,
    #[serde(rename = "zh-Hans")]
    ZhHans,
    #[serde(rename = "ja")]
    Ja,
    #[serde(rename = "en")]
    En,
}

/// Font for the 台詞 content area only; the interface stays on the system font.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum LineFont {
    ChironGoRoundTC,
    KosugiMaru,
    Yomogi,
}

pub const PER_PAGE_RANGE: std::ops::RangeInclusive<u32> = 1..=100;
pub const PLAY_GAP_RANGE: std::ops::RangeInclusive<f64> = 0.0..=30.0;

/// Portable settings: travel inside the export zip and are overwritten by import.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Settings {
    pub theme: Theme,
    pub locale: Locale,
    pub characters_per_page: u32,
    pub lines_per_page: u32,
    pub line_font: LineFont,
    /// 全部播放每句切換秒數: pause between clips when playing a list (canvas Settings board).
    pub play_all_gap_seconds: f64,
    pub auto_update: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            theme: Theme::Indigo,
            locale: Locale::ZhHant,
            characters_per_page: 8,
            lines_per_page: 10,
            line_font: LineFont::ChironGoRoundTC,
            play_all_gap_seconds: 2.0,
            auto_update: false,
        }
    }
}

impl Settings {
    pub fn validated(self) -> Result<Self, LibraryError> {
        for (field, value) in [
            ("charactersPerPage", self.characters_per_page),
            ("linesPerPage", self.lines_per_page),
        ] {
            if !PER_PAGE_RANGE.contains(&value) {
                return Err(LibraryError::InvalidSetting {
                    field,
                    reason: format!(
                        "{value} is outside {}..={}",
                        PER_PAGE_RANGE.start(),
                        PER_PAGE_RANGE.end()
                    ),
                });
            }
        }
        let gap = self.play_all_gap_seconds;
        // Half-second steps, as the board's number field allows.
        if !PLAY_GAP_RANGE.contains(&gap) || (gap * 2.0).fract() != 0.0 {
            return Err(LibraryError::InvalidSetting {
                field: "playAllGapSeconds",
                reason: format!("{gap} is not a multiple of 0.5 within 0..=30"),
            });
        }
        Ok(self)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct WindowGeometry {
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
}

/// Machine-local settings: never exported, never touched by import.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct MachineSettings {
    /// `None` means there is no pointer: the renderer enters the re-point flow.
    pub library_path: Option<PathBuf>,
    pub window: Option<WindowGeometry>,
    pub last_picker_dir: Option<PathBuf>,
}

pub struct Loaded {
    pub settings: Settings,
    pub machine: MachineSettings,
    pub first_run: bool,
}

/// Handle on the fixed settings directory.
pub struct SettingsFiles {
    dir: PathBuf,
    default_library: PathBuf,
}

impl SettingsFiles {
    pub fn from_os() -> Result<Self, LibraryError> {
        let files = Self::new(paths::settings_dir()?, paths::default_library_dir()?);
        #[cfg(windows)]
        if let Some(legacy) = paths::legacy_settings_dir() {
            files.adopt_legacy(&legacy)?;
        }
        Ok(files)
    }

    /// Moves `settings.json` and `machine.json` out of `legacy` into the settings directory.
    /// A file already present at the new location wins and the stale copy is removed, so
    /// `legacy` (the default library folder on Windows) no longer reads as "not a library".
    pub fn adopt_legacy(&self, legacy: &Path) -> Result<(), LibraryError> {
        if legacy == self.dir {
            return Ok(());
        }
        for name in [SETTINGS_FILE, MACHINE_FILE] {
            let from = legacy.join(name);
            if !from.is_file() {
                continue;
            }
            let to = self.dir.join(name);
            if to.exists() {
                fs::remove_file(&from).map_err(|e| LibraryError::io(&from, e))?;
                log::info!("removed stale {}", from.display());
                continue;
            }
            fs::create_dir_all(&self.dir).map_err(|e| LibraryError::io(&self.dir, e))?;
            if fs::rename(&from, &to).is_err() {
                fs::copy(&from, &to).map_err(|e| LibraryError::io(&to, e))?;
                fs::remove_file(&from).map_err(|e| LibraryError::io(&from, e))?;
            }
            log::info!("moved {} to {}", from.display(), to.display());
        }
        Ok(())
    }

    pub fn new(dir: PathBuf, default_library: PathBuf) -> Self {
        Self {
            dir,
            default_library,
        }
    }

    pub fn dir(&self) -> &Path {
        &self.dir
    }

    fn settings_path(&self) -> PathBuf {
        self.dir.join(SETTINGS_FILE)
    }

    fn machine_path(&self) -> PathBuf {
        self.dir.join(MACHINE_FILE)
    }

    /// Startup handling, each file independently:
    /// - both missing: first run, create both with defaults
    /// - `settings.json` missing: recreate defaults, keep the library pointer
    /// - `machine.json` missing: no pointer, so `library_path` is `None` → re-point flow
    pub fn load_or_init(&self) -> Result<Loaded, LibraryError> {
        let settings = read_json::<Settings>(&self.settings_path())?;
        let machine = read_json::<MachineSettings>(&self.machine_path())?;
        let first_run = settings.is_none() && machine.is_none();

        let settings = match settings {
            Some(s) => s,
            None => {
                let s = Settings::default();
                self.save_settings(&s)?;
                s
            }
        };
        let machine = match machine {
            Some(m) => m,
            None => {
                let m = MachineSettings {
                    library_path: first_run.then(|| self.default_library.clone()),
                    ..MachineSettings::default()
                };
                self.save_machine(&m)?;
                m
            }
        };

        Ok(Loaded {
            settings,
            machine,
            first_run,
        })
    }

    pub fn save_settings(&self, settings: &Settings) -> Result<(), LibraryError> {
        write_json_atomic(&self.settings_path(), settings)
    }

    pub fn save_machine(&self, machine: &MachineSettings) -> Result<(), LibraryError> {
        write_json_atomic(&self.machine_path(), machine)
    }
}

fn read_json<T: for<'de> Deserialize<'de>>(path: &Path) -> Result<Option<T>, LibraryError> {
    let bytes = match fs::read(path) {
        Ok(b) => b,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(source) => {
            return Err(LibraryError::SettingsIo {
                path: path.to_owned(),
                source,
            })
        }
    };
    serde_json::from_slice(&bytes)
        .map(Some)
        .map_err(|source| LibraryError::SettingsParse {
            path: path.to_owned(),
            source,
        })
}

/// Write to a sibling temp file, fsync, then rename over the target.
fn write_json_atomic<T: Serialize>(path: &Path, value: &T) -> Result<(), LibraryError> {
    let io_err = |source| LibraryError::SettingsIo {
        path: path.to_owned(),
        source,
    };
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(io_err)?;
    }
    let json = serde_json::to_vec_pretty(value).expect("settings always serialize");
    let tmp = path.with_extension("json.tmp");
    let mut file = fs::File::create(&tmp).map_err(io_err)?;
    file.write_all(&json).map_err(io_err)?;
    file.sync_all().map_err(io_err)?;
    drop(file);
    fs::rename(&tmp, path).map_err(io_err)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 0.1.0/0.1.1 on Windows wrote both files into the default library folder, so the first
    /// launch reported 找不到收藏庫 (NotALibrary) instead of creating the library.
    #[test]
    fn legacy_files_in_the_default_library_are_moved_out_and_the_library_is_created() {
        let dir = tempfile::tempdir().unwrap();
        let library = dir.path().join("Local/DialogueCollector");
        let legacy = SettingsFiles::new(library.clone(), library.clone());
        let written = legacy.load_or_init().unwrap();
        assert!(written.first_run);

        let files = SettingsFiles::new(
            dir.path().join("Roaming/DialogueCollector"),
            library.clone(),
        );
        files.adopt_legacy(&library).unwrap();
        assert!(
            fs::read_dir(&library).unwrap().next().is_none(),
            "legacy folder emptied"
        );

        let loaded = files.load_or_init().unwrap();
        assert!(!loaded.first_run, "settings carried over, not reset");
        assert_eq!(
            loaded.machine.library_path.as_deref(),
            Some(library.as_path())
        );
        let state = crate::library::LibraryState::at_startup(Some(&library), &library);
        assert!(state.library().is_some(), "{:?}", state.status());
    }

    #[test]
    fn adopting_keeps_the_new_file_and_drops_the_stale_one() {
        let dir = tempfile::tempdir().unwrap();
        let legacy = dir.path().join("old");
        let files = SettingsFiles::new(dir.path().join("new"), dir.path().join("lib"));
        files.load_or_init().unwrap();
        let current = fs::read(files.dir().join(SETTINGS_FILE)).unwrap();
        fs::create_dir_all(&legacy).unwrap();
        fs::write(legacy.join(SETTINGS_FILE), b"{\"theme\":\"ruby\"}").unwrap();

        files.adopt_legacy(&legacy).unwrap();
        assert!(!legacy.join(SETTINGS_FILE).exists());
        assert_eq!(fs::read(files.dir().join(SETTINGS_FILE)).unwrap(), current);
    }

    fn files(dir: &tempfile::TempDir) -> SettingsFiles {
        SettingsFiles::new(dir.path().join("prefs"), dir.path().join("library"))
    }

    #[test]
    fn first_run_creates_both_files_with_default_library() {
        let tmp = tempfile::tempdir().unwrap();
        let f = files(&tmp);
        let loaded = f.load_or_init().unwrap();
        assert!(loaded.first_run);
        assert_eq!(loaded.settings, Settings::default());
        assert_eq!(
            loaded.machine.library_path,
            Some(tmp.path().join("library"))
        );
        assert!(f.settings_path().exists());
        assert!(f.machine_path().exists());
    }

    #[test]
    fn missing_settings_keeps_the_library_pointer() {
        let tmp = tempfile::tempdir().unwrap();
        let f = files(&tmp);
        let machine = MachineSettings {
            library_path: Some("/elsewhere".into()),
            ..Default::default()
        };
        f.save_machine(&machine).unwrap();
        let loaded = f.load_or_init().unwrap();
        assert!(!loaded.first_run);
        assert_eq!(loaded.machine, machine);
        assert_eq!(loaded.settings, Settings::default());
    }

    #[test]
    fn missing_machine_file_means_no_pointer() {
        let tmp = tempfile::tempdir().unwrap();
        let f = files(&tmp);
        f.save_settings(&Settings {
            theme: Theme::Ruby,
            ..Default::default()
        })
        .unwrap();
        let loaded = f.load_or_init().unwrap();
        assert!(!loaded.first_run);
        assert_eq!(loaded.machine.library_path, None);
        assert_eq!(loaded.settings.theme, Theme::Ruby);
    }

    #[test]
    fn unknown_and_missing_keys_fall_back_to_defaults() {
        let tmp = tempfile::tempdir().unwrap();
        let f = files(&tmp);
        fs::create_dir_all(f.dir()).unwrap();
        fs::write(f.settings_path(), r#"{"locale":"ja","someFutureKey":1}"#).unwrap();
        let loaded = f.load_or_init().unwrap();
        assert_eq!(loaded.settings.locale, Locale::Ja);
        assert_eq!(loaded.settings.characters_per_page, 8);
    }

    #[test]
    fn play_gap_must_be_half_second_steps_within_range() {
        for bad in [-0.5, 30.5, 1.25, f64::NAN] {
            let s = Settings {
                play_all_gap_seconds: bad,
                ..Default::default()
            };
            assert!(s.validated().is_err(), "{bad} accepted");
        }
        for ok in [0.0, 0.5, 2.0, 30.0] {
            let s = Settings {
                play_all_gap_seconds: ok,
                ..Default::default()
            };
            assert!(s.validated().is_ok(), "{ok} rejected");
        }
    }

    #[test]
    fn per_page_out_of_range_is_rejected() {
        let s = Settings {
            lines_per_page: 0,
            ..Default::default()
        };
        assert!(matches!(
            s.validated(),
            Err(LibraryError::InvalidSetting {
                field: "linesPerPage",
                ..
            })
        ));
    }
}

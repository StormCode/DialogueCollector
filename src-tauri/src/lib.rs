//! Rust core of 台詞收藏家.
//!
//! Five authored modules (PLAN.md eng review, D5 → B):
//! - `subs`    — subtitle parsing (ASS / SRT) into cues
//! - `media`   — the bundled ffmpeg sidecar: one pass per cue, seek + audio-only + encode
//! - `store`   — SQLite access, schema versioning, the single-writer task
//! - `library` — the self-contained library folder, its pointer, settings files, export/import
//! - `import`  — the cue → clip pipeline, partial failure, retry and cancel
//!
//! The updater is configuration (`tauri.conf.json` + a minisign key), not a module.

mod commands;
mod error;
mod library;
mod smoke;

// Skeleton modules: their types exist ahead of their callers. Drop each `allow` once the
// module is wired into a command.
#[allow(dead_code)]
mod import;
#[allow(dead_code)]
mod media;
#[allow(dead_code)]
mod store;
#[allow(dead_code)]
mod subs;

use std::sync::Mutex;

use library::settings::{MachineSettings, Settings, SettingsFiles};

/// Process-wide state shared by the Tauri commands.
pub struct AppState {
    pub settings_files: SettingsFiles,
    pub settings: Mutex<Settings>,
    pub machine: Mutex<MachineSettings>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepSome(5))
                .max_file_size(5 * 1024 * 1024)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            use tauri::Manager;

            let smoke = smoke::SmokeMode::from_args();
            smoke.arm_watchdog();
            app.manage(smoke);

            let files = SettingsFiles::from_os()?;
            let loaded = files.load_or_init()?;
            log::info!(
                "settings loaded from {} (first_run={})",
                files.dir().display(),
                loaded.first_run
            );
            app.manage(AppState {
                settings_files: files,
                settings: Mutex::new(loaded.settings),
                machine: Mutex::new(loaded.machine),
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::app_info,
            commands::get_settings,
            commands::save_settings,
            smoke::smoke_mode,
            smoke::run_smoke,
            smoke::smoke_finish,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

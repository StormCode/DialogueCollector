//! Rust core of 台詞收藏家.
//!
//! Five authored modules (PLAN.md eng review, D5 → B):
//! - `subs`    — subtitle parsing (ASS / SRT) into cues
//! - `media`   — the bundled ffmpeg sidecar: one pass per cue, seek + audio-only + encode
//! - `store`   — SQLite access, schema versioning, the single-writer task
//! - `library` — the self-contained library folder, its pointer, settings files, export/import
//! - `import`  — the cue → clip pipeline, partial failure, retry and cancel
//!
//! The updater is configuration (`tauri.conf.json` + a minisign key); `updater` only holds the
//! glue deciding when to check and when to install.

mod commands;
mod error;
mod library;
mod smoke;
mod updater;

// Skeleton modules: their types exist ahead of their callers. Drop each `allow` once the
// module is wired into a command.
#[allow(dead_code)]
mod import;
#[allow(dead_code)]
mod media;
mod store;
#[allow(dead_code)]
mod subs;

use std::sync::atomic::AtomicBool;
use std::sync::Mutex;

use library::settings::{MachineSettings, Settings, SettingsFiles};
use library::LibraryState;

/// Process-wide state shared by the Tauri commands.
pub struct AppState {
    pub settings_files: SettingsFiles,
    pub settings: Mutex<Settings>,
    pub machine: Mutex<MachineSettings>,
    pub library: Mutex<LibraryState>,
    /// Set while a relocation, export or import runs, so no two overlap and the library does
    /// not change underneath an export (ExportError::Concurrent).
    pub library_busy: AtomicBool,
    /// Set by `cancel_export`; checked between files by the running export.
    pub export_cancel: std::sync::Arc<AtomicBool>,
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
        .plugin(tauri_plugin_updater::Builder::new().build())
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
            let library = LibraryState::at_startup(
                loaded.machine.library_path.as_deref(),
                &library::paths::default_library_dir()?,
            );
            if let Some(ready) = library.library() {
                commands::grant_asset_scope(app.handle(), ready.root());
            }
            let auto_update = loaded.settings.auto_update;
            app.manage(updater::UpdaterState::default());
            app.manage(AppState {
                settings_files: files,
                settings: Mutex::new(loaded.settings),
                machine: Mutex::new(loaded.machine),
                library: Mutex::new(library),
                library_busy: AtomicBool::new(false),
                export_cancel: std::sync::Arc::new(AtomicBool::new(false)),
            });
            if auto_update && !app.state::<smoke::SmokeMode>().enabled {
                tauri::async_runtime::spawn(updater::stage_in_background(app.handle().clone()));
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::app_info,
            commands::get_settings,
            commands::save_settings,
            commands::library_status,
            commands::choose_library_location,
            commands::export_library,
            commands::cancel_export,
            commands::inspect_backup,
            commands::import_backup,
            commands::check_for_update,
            commands::verify_library,
            smoke::smoke_mode,
            smoke::run_smoke,
            smoke::smoke_finish,
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app, event| {
            if let tauri::RunEvent::Exit = event {
                updater::install_staged_on_exit(app);
            }
        });
}

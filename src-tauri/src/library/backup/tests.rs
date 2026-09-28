use std::collections::BTreeMap;
use std::io::Write;

use super::*;
use crate::library::settings::{Locale, Theme};

/// Every file under `root` (excluding WAL side files and .tmp) with its bytes.
fn snapshot(root: &Path) -> BTreeMap<PathBuf, Vec<u8>> {
    let mut out = BTreeMap::new();
    let mut stack = vec![root.to_path_buf()];
    while let Some(dir) = stack.pop() {
        for entry in fs::read_dir(&dir).unwrap().flatten() {
            let path = entry.path();
            let relative = path.strip_prefix(root).unwrap().to_path_buf();
            let name = relative.to_string_lossy().into_owned();
            if name.starts_with(TMP_DIR) || name.ends_with("-wal") || name.ends_with("-shm") {
                continue;
            }
            if path.is_dir() {
                stack.push(path);
            } else {
                out.insert(relative, fs::read(&path).unwrap());
            }
        }
    }
    out
}

fn make_library(root: &Path, character: &str, clip: &str) -> Library {
    let lib = Library::create(root).unwrap();
    fs::write(root.join(clip), format!("audio of {character}")).unwrap();
    fs::write(root.join(IMAGES_DIR).join("p.png"), b"png").unwrap();
    lib.conn()
        .execute(
            "INSERT INTO characters (name, category, source, portrait_file, created_at, updated_at)
             VALUES (?1, 'anime', '作品', 'p.png', 0, 0)",
            [character],
        )
        .unwrap();
    lib.conn()
        .execute(
            "INSERT INTO lines (character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
             VALUES (1, 'セリフ', ?1, 12, 2000, 0, 0)",
            [clip],
        )
        .unwrap();
    lib
}

fn settings_file(dir: &Path, settings: &Settings) -> PathBuf {
    let path = dir.join("settings.json");
    fs::write(&path, serde_json::to_vec(settings).unwrap()).unwrap();
    path
}

fn export_to(lib: &Library, dir: &Path, settings: &Settings) -> PathBuf {
    let dest = dir.join("backup.zip");
    let settings_path = settings_file(dir, settings);
    export(
        lib,
        &settings_path,
        &dest,
        "0.1.0",
        &AtomicBool::new(false),
        |_| {},
    )
    .unwrap();
    dest
}

fn entry_names(archive: &Path) -> Vec<String> {
    let mut zip = ZipArchive::new(fs::File::open(archive).unwrap()).unwrap();
    (0..zip.len())
        .map(|i| zip.by_index(i).unwrap().name().to_owned())
        .collect()
}

#[test]
fn export_contains_settings_library_and_manifest_but_no_tmp_or_wal() {
    let dir = tempfile::tempdir().unwrap();
    let lib = make_library(&dir.path().join("lib"), "芙莉蓮", "AAAAAAAAAAAA.m4a");
    fs::write(dir.path().join("lib/.tmp/stale.tmp"), b"x").unwrap();
    let archive = export_to(&lib, dir.path(), &Settings::default());

    let names = entry_names(&archive);
    assert!(names.contains(&"settings.json".to_owned()));
    assert!(names.contains(&"manifest.json".to_owned()));
    assert!(names.contains(&"library/library.sqlite".to_owned()));
    assert!(names.contains(&"library/AAAAAAAAAAAA.m4a".to_owned()));
    assert!(names.contains(&"library/images/p.png".to_owned()));
    assert!(!names
        .iter()
        .any(|n| n.contains(".tmp") || n.ends_with("-wal") || n.ends_with("-shm")));
    assert!(!names.iter().any(|n| n.contains("machine.json")));
    assert_eq!(
        names.last().unwrap(),
        "manifest.json",
        "manifest must be written last"
    );

    let manifest = inspect(&archive).unwrap();
    assert_eq!(manifest.schema_version, SCHEMA_VERSION);
    assert_eq!(manifest.clip_count, 1);
    assert_eq!(manifest.character_count, 1);
    assert!(!dir.path().join("backup.zip.part").exists());
}

#[test]
fn import_replaces_the_library_and_returns_the_archive_settings() {
    let dir = tempfile::tempdir().unwrap();
    let source = make_library(&dir.path().join("a"), "芙莉蓮", "AAAAAAAAAAAA.m4a");
    let exported = Settings {
        theme: Theme::Ruby,
        locale: Locale::Ja,
        ..Default::default()
    };
    let archive = export_to(&source, dir.path(), &exported);
    let expected = snapshot(&dir.path().join("a"));

    let target = dir.path().join("b");
    make_library(&target, "費倫", "BBBBBBBBBBBB.m4a")
        .close()
        .unwrap();

    let (staging, settings) = unpack(&archive, &target).unwrap();
    assert_eq!(settings, exported);
    swap_in(&staging, &target).unwrap();

    let lib = Library::open(&target).unwrap();
    let name: String = lib
        .conn()
        .query_row("SELECT name FROM characters", [], |r| r.get(0))
        .unwrap();
    assert_eq!(name, "芙莉蓮");
    assert!(target.join("AAAAAAAAAAAA.m4a").is_file());
    assert!(!target.join("BBBBBBBBBBBB.m4a").exists());
    assert!(!previous_path(&target).exists());
    assert!(!staging_path(&target).exists());

    // Every clip and image arrived byte for byte.
    let imported = snapshot(&target);
    for (path, bytes) in expected.iter().filter(|(p, _)| !p.ends_with(DB_FILE)) {
        assert_eq!(
            imported.get(path),
            Some(bytes),
            "{} differs",
            path.display()
        );
    }
}

#[test]
fn cancelled_export_leaves_nothing_behind() {
    let dir = tempfile::tempdir().unwrap();
    let lib = make_library(&dir.path().join("lib"), "a", "AAAAAAAAAAAA.m4a");
    let dest = dir.path().join("out.zip");
    let settings_path = settings_file(dir.path(), &Settings::default());
    let err = export(
        &lib,
        &settings_path,
        &dest,
        "0.1.0",
        &AtomicBool::new(true),
        |_| {},
    )
    .unwrap_err();
    assert!(matches!(err, BackupError::Cancelled));
    assert!(!dest.exists());
    assert!(!dest.with_extension("zip.part").exists());
    assert!(fs::read_dir(dir.path().join("lib/.tmp"))
        .unwrap()
        .next()
        .is_none());
}

#[test]
fn inspect_rejects_foreign_newer_and_broken_archives() {
    let dir = tempfile::tempdir().unwrap();

    let not_zip = dir.path().join("a.zip");
    fs::write(&not_zip, b"hello").unwrap();
    assert!(matches!(inspect(&not_zip), Err(BackupError::NotOurArchive)));

    let no_manifest = write_zip(dir.path(), "b.zip", &[("settings.json", b"{}")]);
    assert!(matches!(
        inspect(&no_manifest),
        Err(BackupError::NotOurArchive)
    ));

    let mut manifest = sample_manifest();
    manifest.schema_version = SCHEMA_VERSION + 1;
    let newer = write_zip(
        dir.path(),
        "c.zip",
        &[("manifest.json", &serde_json::to_vec(&manifest).unwrap())],
    );
    assert!(matches!(
        inspect(&newer),
        Err(BackupError::SchemaTooNew { found, supported }) if found == SCHEMA_VERSION + 1 && supported == SCHEMA_VERSION
    ));

    let mut manifest = sample_manifest();
    manifest.format = "something-else".into();
    let foreign = write_zip(
        dir.path(),
        "d.zip",
        &[("manifest.json", &serde_json::to_vec(&manifest).unwrap())],
    );
    assert!(matches!(inspect(&foreign), Err(BackupError::NotOurArchive)));
}

fn sample_manifest() -> Manifest {
    Manifest {
        format: FORMAT.into(),
        format_version: FORMAT_VERSION,
        schema_version: SCHEMA_VERSION,
        app_version: "0.1.0".into(),
        created_at: 0,
        clip_count: 0,
        character_count: 0,
        bytes: 0,
    }
}

fn write_zip(dir: &Path, name: &str, entries: &[(&str, &[u8])]) -> PathBuf {
    let path = dir.join(name);
    let mut zip = ZipWriter::new(fs::File::create(&path).unwrap());
    for (entry, bytes) in entries {
        zip.start_file(*entry, SimpleFileOptions::default())
            .unwrap();
        zip.write_all(bytes).unwrap();
    }
    zip.finish().unwrap();
    path
}

#[test]
fn zip_slip_entries_are_refused_and_the_library_is_untouched() {
    let dir = tempfile::tempdir().unwrap();
    let target = dir.path().join("lib");
    make_library(&target, "a", "AAAAAAAAAAAA.m4a")
        .close()
        .unwrap();
    let before = snapshot(&target);
    let manifest = serde_json::to_vec(&sample_manifest()).unwrap();
    let settings = serde_json::to_vec(&Settings::default()).unwrap();

    for (i, evil) in ["library/../../evil.txt", "../evil.txt", "/etc/evil.txt"]
        .iter()
        .enumerate()
    {
        let archive = write_zip(
            dir.path(),
            &format!("evil{i}.zip"),
            &[
                ("manifest.json", &manifest),
                ("settings.json", &settings),
                (evil, b"pwned"),
            ],
        );
        let err = unpack(&archive, &target).unwrap_err();
        assert!(
            matches!(err, BackupError::PathTraversal(_)),
            "{evil}: {err:?}"
        );
    }
    assert!(!dir.path().join("evil.txt").exists());
    assert!(!staging_path(&target).exists());
    assert_eq!(snapshot(&target), before);
}

#[test]
fn a_failed_import_leaves_the_existing_library_byte_identical() {
    let dir = tempfile::tempdir().unwrap();
    let target = dir.path().join("lib");
    make_library(&target, "a", "AAAAAAAAAAAA.m4a")
        .close()
        .unwrap();
    let before = snapshot(&target);

    // A plausible archive whose database is missing.
    let archive = write_zip(
        dir.path(),
        "broken.zip",
        &[
            (
                "settings.json",
                &serde_json::to_vec(&Settings::default()).unwrap(),
            ),
            ("library/ZZZZZZZZZZZZ.m4a", b"audio"),
            (
                "manifest.json",
                &serde_json::to_vec(&sample_manifest()).unwrap(),
            ),
        ],
    );
    assert!(matches!(
        unpack(&archive, &target),
        Err(BackupError::NotOurArchive)
    ));
    assert!(!staging_path(&target).exists());
    assert_eq!(snapshot(&target), before);
}

#[test]
fn invalid_settings_in_an_archive_are_refused() {
    let dir = tempfile::tempdir().unwrap();
    let target = dir.path().join("lib");
    let archive = write_zip(
        dir.path(),
        "bad-settings.zip",
        &[
            ("settings.json", br#"{"linesPerPage": 0}"#),
            (
                "manifest.json",
                &serde_json::to_vec(&sample_manifest()).unwrap(),
            ),
        ],
    );
    assert!(matches!(
        unpack(&archive, &target),
        Err(BackupError::InvalidSettings(_))
    ));
}

#[test]
fn recovery_restores_the_library_after_a_crash_between_the_renames() {
    let dir = tempfile::tempdir().unwrap();
    let target = dir.path().join("lib");
    make_library(&target, "a", "AAAAAAAAAAAA.m4a")
        .close()
        .unwrap();
    let before = snapshot(&target);

    // Crash after `<lib>` → `.lib.previous`, before the staging folder was renamed in.
    fs::rename(&target, previous_path(&target)).unwrap();
    fs::create_dir_all(staging_path(&target)).unwrap();
    recover_interrupted_import(&target);

    assert_eq!(snapshot(&target), before);
    assert!(!previous_path(&target).exists());
    assert!(!staging_path(&target).exists());
}

#[test]
fn recovery_finishes_an_import_that_crashed_before_cleanup() {
    let dir = tempfile::tempdir().unwrap();
    let target = dir.path().join("lib");
    make_library(&target, "new", "NNNNNNNNNNNN.m4a")
        .close()
        .unwrap();
    let after = snapshot(&target);
    make_library(&previous_path(&target), "old", "OOOOOOOOOOOO.m4a")
        .close()
        .unwrap();

    recover_interrupted_import(&target);
    assert_eq!(snapshot(&target), after);
    assert!(!previous_path(&target).exists());
}

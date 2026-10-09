use std::collections::HashSet;
use std::process::{Command, Stdio};
use std::time::Duration;

use rand::Rng;

use super::*;
use crate::library::folder::Library;
use crate::library::paths::{DB_FILE, TMP_DIR};
use crate::media::new_clip_filename;

// Crashes are real: a child process (this test binary re-run on `chaos_child`) aborts at a
// step or is SIGKILLed. Unwinding a panic in-process would run destructors — a transaction's
// rollback among them — which a real crash does not.
const CHILD_TEST: &str = "import::commit::tests::chaos_child";
const ENV_LIBRARY: &str = "DC_CHAOS_LIBRARY";
const ENV_MODE: &str = "DC_CHAOS_MODE";

fn library(dir: &Path) -> PathBuf {
    let root = dir.join("lib");
    let lib = Library::create(&root).unwrap();
    lib.conn()
        .execute(
            "INSERT INTO characters (id, name, category, source, created_at, updated_at)
             VALUES (1, '芙莉蓮', 'anime', '葬送的芙莉蓮', 0, 0)",
            [],
        )
        .unwrap();
    lib.close().unwrap();
    root
}

/// What the encoder leaves before `commit_cue`: a clip under `<library>/.tmp/`.
fn stage(root: &Path) -> PathBuf {
    let path = root
        .join(TMP_DIR)
        .join(format!("{}.tmp", new_clip_filename()));
    fs::write(&path, vec![7u8; 4096]).unwrap();
    path
}

fn line() -> NewLine {
    NewLine {
        character_id: 1,
        text: "人類的壽命真的很短暫呢。".into(),
        translation: None,
        duration_ms: 2000,
        extension: "m4a",
    }
}

fn rows(root: &Path) -> Vec<String> {
    let lib = Library::open(root).unwrap();
    let mut stmt = lib
        .conn()
        .prepare("SELECT audio_filename FROM lines ORDER BY id")
        .unwrap();
    let names = stmt
        .query_map([], |r| r.get(0))
        .unwrap()
        .map(Result::unwrap)
        .collect();
    names
}

fn clips_on_disk(root: &Path) -> HashSet<String> {
    fs::read_dir(root)
        .unwrap()
        .flatten()
        .filter_map(|e| e.file_name().into_string().ok())
        .filter(|n| n.ends_with(".m4a"))
        .collect()
}

fn tmp_entries(root: &Path) -> usize {
    fs::read_dir(root.join(TMP_DIR)).unwrap().count()
}

#[test]
fn a_committed_cue_is_a_file_and_a_row() {
    let dir = tempfile::tempdir().unwrap();
    let root = library(dir.path());
    let writer = Writer::open(&root.join(DB_FILE)).unwrap();
    let staged = stage(&root);

    let committed = commit_cue(&root, &writer, &staged, line()).unwrap();
    drop(writer);

    assert!(!staged.exists());
    assert_eq!(committed.audio_bytes, 4096);
    assert!(root.join(&committed.audio_filename).is_file());
    assert_eq!(rows(&root), [committed.audio_filename]);
    assert!(Library::open(&root)
        .unwrap()
        .orphan_files()
        .unwrap()
        .is_empty());
}

#[test]
fn a_refused_row_takes_its_file_back_out() {
    let dir = tempfile::tempdir().unwrap();
    let root = library(dir.path());
    let writer = Writer::open(&root.join(DB_FILE)).unwrap();
    let staged = stage(&root);

    let bad = NewLine {
        character_id: 999, // no such character: the foreign key refuses the row
        ..line()
    };
    let err = commit_cue(&root, &writer, &staged, bad).unwrap_err();
    drop(writer);

    assert!(matches!(err, ImportError::Store(_)), "{err:?}");
    assert!(rows(&root).is_empty());
    assert!(clips_on_disk(&root).is_empty());
}

fn run_child(root: &Path, mode: &str) -> std::process::Child {
    Command::new(std::env::current_exe().unwrap())
        .args([CHILD_TEST, "--exact", "--ignored", "--test-threads=1"])
        .env(ENV_LIBRARY, root)
        .env(ENV_MODE, mode)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .unwrap()
}

/// The child side of the chaos tests; does nothing unless a parent test set it up.
#[test]
#[ignore = "run by the chaos tests in a child process"]
fn chaos_child() {
    let (Ok(root), Ok(mode)) = (std::env::var(ENV_LIBRARY), std::env::var(ENV_MODE)) else {
        return;
    };
    let root = PathBuf::from(root);
    let writer = Writer::open(&root.join(DB_FILE)).unwrap();
    match mode.as_str() {
        "loop" => loop {
            commit_cue(&root, &writer, &stage(&root), line()).unwrap();
        },
        step => {
            let crash_at = match step {
                "synced" => Step::FileSynced,
                "renamed" => Step::Renamed,
                "inserted" => Step::Inserted,
                other => panic!("unknown mode {other}"),
            };
            let probe: Probe = Arc::new(move |at| {
                if at == crash_at {
                    std::process::abort();
                }
            });
            let _ = commit_cue_with(&root, &writer, &stage(&root), line(), probe);
            unreachable!("the probe aborts");
        }
    }
}

fn crash_at(mode: &str) -> PathBuf {
    let dir = tempfile::tempdir().unwrap().keep();
    let root = library(&dir);
    let status = run_child(&root, mode).wait().unwrap();
    assert!(!status.success(), "the child should have crashed");
    root
}

#[test]
fn a_crash_before_the_rename_leaves_only_a_tmp_that_the_next_open_sweeps() {
    let root = crash_at("synced");
    assert_eq!(tmp_entries(&root), 1);
    assert!(rows(&root).is_empty()); // opening the library sweeps .tmp
    assert_eq!(tmp_entries(&root), 0);
    assert!(clips_on_disk(&root).is_empty());
    fs::remove_dir_all(root.parent().unwrap()).unwrap();
}

#[test]
fn a_crash_between_rename_and_insert_leaves_an_orphan_that_verify_reports() {
    let root = crash_at("renamed");
    assert!(rows(&root).is_empty());
    let orphans = Library::open(&root).unwrap().orphan_files().unwrap();
    assert_eq!(orphans.len(), 1);
    assert_eq!(clips_on_disk(&root), orphans.into_iter().collect());
    fs::remove_dir_all(root.parent().unwrap()).unwrap();
}

#[test]
fn a_crash_between_insert_and_commit_leaves_no_row_and_an_orphan() {
    let root = crash_at("inserted");
    assert!(
        rows(&root).is_empty(),
        "the uncommitted row must not survive"
    );
    let orphans = Library::open(&root).unwrap().orphan_files().unwrap();
    assert_eq!(orphans.len(), 1);
    fs::remove_dir_all(root.parent().unwrap()).unwrap();
}

/// SIGKILL the committing process (not ffmpeg) 50 times at random moments. Afterwards no
/// row points at a missing file, files >= rows, and the next open leaves no `.tmp`.
#[test]
fn fifty_sigkills_never_leave_a_row_without_its_file() {
    let dir = tempfile::tempdir().unwrap();
    let root = library(dir.path());
    let mut rng = rand::rng();

    for round in 0..50 {
        let mut child = run_child(&root, "loop");
        std::thread::sleep(Duration::from_millis(rng.random_range(40..160)));
        child.kill().unwrap(); // SIGKILL on Unix, TerminateProcess on Windows
        child.wait().unwrap();

        let rows = rows(&root); // opens the library: sweeps .tmp
        let files = clips_on_disk(&root);
        for name in &rows {
            assert!(
                files.contains(name),
                "round {round}: row {name} has no file"
            );
        }
        assert!(files.len() >= rows.len(), "round {round}");
        assert_eq!(tmp_entries(&root), 0, "round {round}");
    }
    let rows = rows(&root);
    let orphans = Library::open(&root).unwrap().orphan_files().unwrap();
    eprintln!("50 kills: {} rows, {} orphans", rows.len(), orphans.len());
    assert!(!rows.is_empty(), "the child never committed anything");
}

//! 設定頁 → 檔案管理 → 瀏覽: pointing the app at a different library location.
//!
//! Decided by the user on 2026-09-28:
//! 1. The chosen location already holds a library → switch to it.
//! 2. It is empty (or missing) → move the current library there. With no current library,
//!    create a new one there instead.
//! 3. It has other content and is not a library → use a `DialogueCollector` subfolder inside it,
//!    then apply 1 or 2.
//!
//! A move never leaves the app without a valid library: the pointer (`machine.json`) is only
//! rewritten after the library is complete at its new location, and the old copy is removed
//! last. A same-volume move is a single rename. A cross-volume move copies into a hidden
//! staging folder next to the target, verifies it, then renames it into place.

use std::fs;
use std::path::{Path, PathBuf};

use super::folder::{check_volume, classify_dir, DirKind};
use super::paths::{DB_FILE, TMP_DIR};
use super::LibraryError;

pub const SUBFOLDER_NAME: &str = "DialogueCollector";

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Plan {
    /// The target is already the current library.
    Unchanged,
    /// Switch to the library that is already at `target`.
    OpenExisting { target: PathBuf },
    /// Move the current library from `from` to `target`.
    Move { from: PathBuf, target: PathBuf },
    /// No usable current library: create a new one at `target`.
    Create { target: PathBuf },
}

/// Turn the folder the user picked into a concrete plan. `current` is the root of the library
/// that is open right now, if any.
pub fn plan(chosen: &Path, current: Option<&Path>) -> Result<Plan, LibraryError> {
    let target = match classify_dir(chosen)? {
        DirKind::Other => {
            let sub = chosen.join(SUBFOLDER_NAME);
            if classify_dir(&sub)? == DirKind::Other {
                return Err(LibraryError::TargetNotEmpty(sub));
            }
            sub
        }
        _ => chosen.to_owned(),
    };
    check_volume(&target)?;

    if let Some(current) = current {
        if same_path(&target, current) {
            return Ok(Plan::Unchanged);
        }
        if is_inside(&target, current) {
            return Err(LibraryError::TargetInsideLibrary(target));
        }
    }

    Ok(match (classify_dir(&target)?, current) {
        (DirKind::Library, _) => Plan::OpenExisting { target },
        (_, Some(current)) => Plan::Move {
            from: current.to_owned(),
            target,
        },
        (_, None) => Plan::Create { target },
    })
}

/// Move a closed library folder from `from` to `to` (missing or empty). `progress` receives
/// (bytes copied, total bytes) during a cross-volume copy.
pub fn move_library(
    from: &Path,
    to: &Path,
    mut progress: impl FnMut(u64, u64),
) -> Result<(), LibraryError> {
    if let Some(parent) = to.parent() {
        fs::create_dir_all(parent).map_err(|e| LibraryError::io(parent, e))?;
    }
    remove_if_empty(to)?;

    match fs::rename(from, to) {
        Ok(()) => {
            log::info!(
                "library moved by rename: {} → {}",
                from.display(),
                to.display()
            );
            return Ok(());
        }
        Err(e) if e.kind() == std::io::ErrorKind::CrossesDevices => {}
        Err(e) => return Err(LibraryError::io(from, e)),
    }

    copy_then_swap(from, to, &mut progress)?;
    // The library is complete and verified at `to`. Failing to remove the old copy must not
    // fail the move: rolling back would mean reopening a folder that may be half deleted.
    if let Err(e) = fs::remove_dir_all(from) {
        log::warn!(
            "library moved, but the old copy at {} remains: {e}",
            from.display()
        );
    }
    log::info!(
        "library moved by copy: {} → {}",
        from.display(),
        to.display()
    );
    Ok(())
}

/// Cross-volume half of a move. Public within the crate so tests can force it on one volume.
pub(crate) fn copy_then_swap(
    from: &Path,
    to: &Path,
    progress: &mut impl FnMut(u64, u64),
) -> Result<(), LibraryError> {
    let files = collect_files(from)?;
    let total: u64 = files.iter().map(|(_, len)| len).sum();

    let staging = staging_path(to);
    if staging.exists() {
        fs::remove_dir_all(&staging).map_err(|e| LibraryError::io(&staging, e))?;
    }
    let result = (|| {
        let mut copied = 0u64;
        progress(0, total);
        for (relative, len) in &files {
            let src = from.join(relative);
            let dst = staging.join(relative);
            if let Some(parent) = dst.parent() {
                fs::create_dir_all(parent).map_err(|e| LibraryError::io(parent, e))?;
            }
            copy_file_synced(&src, &dst)?;
            copied += len;
            progress(copied, total);
        }
        fs::create_dir_all(staging.join(TMP_DIR)).map_err(|e| LibraryError::io(&staging, e))?;

        // Verify before the swap: same files, same sizes.
        let copied_files = collect_files(&staging)?;
        if copied_files != files {
            return Err(LibraryError::MoveVerifyFailed(staging.clone()));
        }
        fs::rename(&staging, to).map_err(|e| LibraryError::io(to, e))
    })();
    if result.is_err() {
        let _ = fs::remove_dir_all(&staging);
    }
    result
}

/// Every file to carry over, as (path relative to the root, length), sorted, with the
/// database last so a partially copied tree never looks like a library. `.tmp/` is skipped.
fn collect_files(root: &Path) -> Result<Vec<(PathBuf, u64)>, LibraryError> {
    let mut out = Vec::new();
    let mut stack = vec![root.to_path_buf()];
    while let Some(dir) = stack.pop() {
        for entry in fs::read_dir(&dir).map_err(|e| LibraryError::io(&dir, e))? {
            let entry = entry.map_err(|e| LibraryError::io(&dir, e))?;
            let path = entry.path();
            let relative = path.strip_prefix(root).unwrap().to_path_buf();
            if relative == Path::new(TMP_DIR) {
                continue;
            }
            let meta = entry.metadata().map_err(|e| LibraryError::io(&path, e))?;
            if meta.is_dir() {
                stack.push(path);
            } else {
                out.push((relative, meta.len()));
            }
        }
    }
    // `library.sqlite` and any `-wal` / `-shm` sibling at the root sort after everything else.
    let is_db =
        |p: &Path| p.parent() == Some(Path::new("")) && p.to_string_lossy().starts_with(DB_FILE);
    out.sort_by(|(a, _), (b, _)| is_db(a).cmp(&is_db(b)).then_with(|| a.cmp(b)));
    Ok(out)
}

fn copy_file_synced(src: &Path, dst: &Path) -> Result<(), LibraryError> {
    fs::copy(src, dst).map_err(|e| LibraryError::io(src, e))?;
    let file = fs::OpenOptions::new()
        .write(true)
        .open(dst)
        .map_err(|e| LibraryError::io(dst, e))?;
    file.sync_all().map_err(|e| LibraryError::io(dst, e))?;
    Ok(())
}

fn staging_path(to: &Path) -> PathBuf {
    let name = to
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_else(|| SUBFOLDER_NAME.to_owned());
    to.with_file_name(format!(".{name}.dc-moving"))
}

/// The target may be an empty folder the user picked; renaming onto it fails on Windows, so
/// remove it (and any OS clutter in it) first. A non-empty target is a bug in the caller.
fn remove_if_empty(path: &Path) -> Result<(), LibraryError> {
    match classify_dir(path)? {
        DirKind::Missing => Ok(()),
        DirKind::Empty => fs::remove_dir_all(path).map_err(|e| LibraryError::io(path, e)),
        _ => Err(LibraryError::TargetNotEmpty(path.to_owned())),
    }
}

fn same_path(a: &Path, b: &Path) -> bool {
    match (a.canonicalize(), b.canonicalize()) {
        (Ok(a), Ok(b)) => a == b,
        _ => a == b,
    }
}

fn is_inside(child: &Path, parent: &Path) -> bool {
    let parent = parent.canonicalize().unwrap_or_else(|_| parent.to_owned());
    let mut probe = child.to_path_buf();
    loop {
        if let Ok(resolved) = probe.canonicalize() {
            let rest = child.strip_prefix(&probe).unwrap_or(Path::new(""));
            return resolved.join(rest).starts_with(&parent);
        }
        if !probe.pop() {
            return child.starts_with(&parent);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::super::folder::Library;
    use super::*;

    fn write_file(path: &Path, bytes: &[u8]) {
        fs::write(path, bytes).unwrap();
    }

    fn library_with_clip(root: &Path) -> String {
        let lib = Library::create(root).unwrap();
        let name = "ABCDEFGHIJKL.m4a";
        write_file(&root.join(name), b"fake audio");
        write_file(&root.join("images").join("portrait.png"), b"png");
        lib.conn()
            .execute_batch(&format!(
                "INSERT INTO characters (name, category, source, portrait_file, created_at, updated_at)
                     VALUES ('a', 'tv', 'b', 'portrait.png', 0, 0);
                 INSERT INTO lines (character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
                     VALUES (1, 'x', '{name}', 10, 1, 0, 0);"
            ))
            .unwrap();
        lib.close().unwrap();
        name.to_owned()
    }

    /// Every row's audio resolves under the root — "every clip stays playable".
    fn assert_clips_resolve(root: &Path) {
        let lib = Library::open(root).unwrap();
        let mut stmt = lib
            .conn()
            .prepare("SELECT audio_filename FROM lines")
            .unwrap();
        let names: Vec<String> = stmt
            .query_map([], |r| r.get(0))
            .unwrap()
            .map(Result::unwrap)
            .collect();
        assert!(!names.is_empty());
        for name in names {
            assert!(root.join(&name).is_file(), "{name} missing after move");
        }
        assert!(root.join("images/portrait.png").is_file());
    }

    #[test]
    fn empty_target_with_a_current_library_plans_a_move() {
        let dir = tempfile::tempdir().unwrap();
        let current = dir.path().join("old");
        library_with_clip(&current);
        let target = dir.path().join("new");
        fs::create_dir(&target).unwrap();
        assert_eq!(
            plan(&target, Some(&current)).unwrap(),
            Plan::Move {
                from: current,
                target
            }
        );
    }

    #[test]
    fn existing_library_target_plans_a_switch() {
        let dir = tempfile::tempdir().unwrap();
        let current = dir.path().join("a");
        let other = dir.path().join("b");
        library_with_clip(&current);
        library_with_clip(&other);
        assert_eq!(
            plan(&other, Some(&current)).unwrap(),
            Plan::OpenExisting { target: other }
        );
    }

    #[test]
    fn non_empty_folder_gets_a_subfolder() {
        let dir = tempfile::tempdir().unwrap();
        write_file(&dir.path().join("report.docx"), b"x");
        assert_eq!(
            plan(dir.path(), None).unwrap(),
            Plan::Create {
                target: dir.path().join(SUBFOLDER_NAME)
            }
        );
    }

    #[test]
    fn choosing_the_current_library_is_a_no_op_and_nesting_is_refused() {
        let dir = tempfile::tempdir().unwrap();
        let current = dir.path().join("lib");
        library_with_clip(&current);
        assert_eq!(plan(&current, Some(&current)).unwrap(), Plan::Unchanged);
        let inner = current.join("images");
        assert!(matches!(
            plan(&inner, Some(&current)),
            Err(LibraryError::TargetInsideLibrary(_)) | Err(LibraryError::TargetNotEmpty(_))
        ));
    }

    #[test]
    fn same_volume_move_keeps_every_clip_playable() {
        let dir = tempfile::tempdir().unwrap();
        let from = dir.path().join("old");
        library_with_clip(&from);
        let to = dir.path().join("somewhere/new");
        move_library(&from, &to, |_, _| {}).unwrap();
        assert!(!from.exists());
        assert_clips_resolve(&to);
    }

    #[test]
    fn copy_move_verifies_reports_progress_and_puts_the_database_last() {
        let dir = tempfile::tempdir().unwrap();
        let from = dir.path().join("old");
        library_with_clip(&from);
        write_file(&from.join(TMP_DIR).join("junk.tmp"), b"residue");
        let to = dir.path().join("new");

        let mut seen = Vec::new();
        copy_then_swap(&from, &to, &mut |done, total| seen.push((done, total))).unwrap();
        let (last_done, total) = *seen.last().unwrap();
        assert_eq!(last_done, total);
        assert!(total > 0);
        assert!(!to.join(TMP_DIR).join("junk.tmp").exists());
        assert!(!staging_path(&to).exists());
        assert_clips_resolve(&to);

        let order = collect_files(&from).unwrap();
        assert!(order
            .last()
            .unwrap()
            .0
            .to_string_lossy()
            .starts_with(DB_FILE));
    }

    #[test]
    fn empty_target_folder_is_replaced_by_the_move() {
        let dir = tempfile::tempdir().unwrap();
        let from = dir.path().join("old");
        library_with_clip(&from);
        let to = dir.path().join("picked");
        fs::create_dir(&to).unwrap();
        write_file(&to.join(".DS_Store"), b"x");
        move_library(&from, &to, |_, _| {}).unwrap();
        assert_clips_resolve(&to);
    }
}

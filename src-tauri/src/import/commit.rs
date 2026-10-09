//! `commit_cue`: the only place the clip write order exists.
//!
//!   staged clip at `<library>/.tmp/<name>.tmp`
//!     → fsync the file
//!     → rename to `<library>/<name>.<m4a|mp3|ogg>`
//!     → fsync the library folder
//!     → insert the row → commit            (on the single writer)
//!
//! A crash at any point leaves at worst a `.m4a` with no row — an orphan that 驗證收藏庫
//! reports — and never a row pointing at a missing file. A `.tmp` never has a row, so the sweep
//! on library open may delete every one of them.

use std::fs::{self, File};
use std::path::{Path, PathBuf};
use std::sync::Arc;

use crate::media::new_clip_filename_with;
use crate::store::writer::Writer;
use crate::store::{self, StoreError};

use super::ImportError;

/// The row a committed cue becomes.
#[derive(Debug, Clone)]
pub struct NewLine {
    pub character_id: i64,
    pub text: String,
    pub translation: Option<String>,
    pub duration_ms: i64,
    /// The clip's extension, one of `media::CLIP_EXTENSIONS`: `m4a` when ffmpeg encoded it,
    /// the source's own when 直接匯入 copied an audio file as it was.
    pub extension: &'static str,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CommittedCue {
    pub line_id: i64,
    pub audio_filename: String,
    pub audio_bytes: u64,
}

/// Points between the steps where tests inject a crash.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Step {
    /// The `.tmp` is durable but still has its temporary name.
    FileSynced,
    /// The clip has its final name; no row yet.
    Renamed,
    /// The row is inserted but its transaction is not committed.
    Inserted,
}

pub type Probe = Arc<dyn Fn(Step) + Send + Sync>;

/// Name attempts before giving up; 36^12 names make a second attempt already unlikely.
const NAME_ATTEMPTS: usize = 8;

/// Moves an encoded clip into the library and records its row, in the write order above.
pub fn commit_cue(
    library: &Path,
    writer: &Writer,
    staged: &Path,
    line: NewLine,
) -> Result<CommittedCue, ImportError> {
    commit_cue_with(library, writer, staged, line, Arc::new(|_| {}))
}

pub(crate) fn commit_cue_with(
    library: &Path,
    writer: &Writer,
    staged: &Path,
    line: NewLine,
    probe: Probe,
) -> Result<CommittedCue, ImportError> {
    // Opened for writing: Windows' FlushFileBuffers needs write access (a read-only handle is
    // "Access is denied"); Unix fsyncs either way.
    let audio_bytes = fs::OpenOptions::new()
        .write(true)
        .open(staged)
        .and_then(|f| {
            f.sync_all()?;
            Ok(f.metadata()?.len())
        })
        .map_err(|e| ImportError::io(staged, e))?;
    probe(Step::FileSynced);

    let (audio_filename, target) = rename_into(library, staged, line.extension)?;
    sync_dir(library).map_err(|e| ImportError::io(library, e))?;
    probe(Step::Renamed);

    let name = audio_filename.clone();
    let inserted = writer.write(move |conn| {
        let now = store::now_ms();
        let tx = conn.transaction()?;
        tx.execute(
            "INSERT INTO lines (character_id, text, translation, audio_filename, audio_bytes,
                                duration_ms, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)",
            (
                line.character_id,
                &line.text,
                &line.translation,
                &name,
                audio_bytes as i64,
                line.duration_ms,
                now,
            ),
        )?;
        let id = tx.last_insert_rowid();
        probe(Step::Inserted);
        tx.commit()?;
        Ok::<_, StoreError>(id)
    });

    match inserted {
        Ok(line_id) => Ok(CommittedCue {
            line_id,
            audio_filename,
            audio_bytes,
        }),
        Err(e) => {
            // A refused row (constraint, closed writer) is not a crash: take the file back out
            // rather than leave an orphan. If that fails too, 驗證收藏庫 still finds it.
            if let Err(rm) = fs::remove_file(&target) {
                log::warn!(
                    "could not remove {} after a failed insert: {rm}",
                    target.display()
                );
            }
            Err(e.into())
        }
    }
}

/// Renames `staged` to a fresh `<name>.<extension>` in `library`, never replacing an existing
/// file.
fn rename_into(
    library: &Path,
    staged: &Path,
    extension: &str,
) -> Result<(String, PathBuf), ImportError> {
    for _ in 0..NAME_ATTEMPTS {
        let name = new_clip_filename_with(extension);
        let target = library.join(&name);
        if target.exists() {
            continue;
        }
        fs::rename(staged, &target).map_err(|e| ImportError::io(&target, e))?;
        return Ok((name, target));
    }
    Err(ImportError::io(
        library,
        std::io::Error::new(std::io::ErrorKind::AlreadyExists, "no free clip name"),
    ))
}

/// Makes the rename itself durable. Windows cannot open a directory as a file; NTFS journals
/// the rename's metadata, so there is nothing further to flush there.
fn sync_dir(dir: &Path) -> std::io::Result<()> {
    #[cfg(unix)]
    {
        File::open(dir)?.sync_all()
    }
    #[cfg(not(unix))]
    {
        let _ = dir;
        Ok(())
    }
}

#[cfg(test)]
mod tests;

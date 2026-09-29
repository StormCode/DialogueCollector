//! `import_runs` / `import_failures` records (R5, D11, ENG4). A run keeps its source PATHS —
//! never contents — so 部分完成 survives closing the window and can be retried from source.

use std::path::{Path, PathBuf};

use rusqlite::{params, OptionalExtension};
use serde::Serialize;

use crate::store::writer::Writer;
use crate::store::{self, StoreError};

/// Why a cue did not become a line. Stable codes: the renderer localizes them.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum Reason {
    /// 片段長度為 0（開始與結束時間相同）
    ZeroLength,
    /// 字幕時間超出影片長度
    OutOfRange,
    /// 音軌解碼失敗
    DecodeFailed,
    /// 寫入音檔失敗：磁碟空間不足
    DiskFull,
    /// Writing the clip or its row failed for another reason.
    WriteFailed,
    /// The bundled ffmpeg could not run.
    SidecarUnusable,
    /// ffmpeg was killed by something other than our cancel.
    Killed,
    Other,
    /// 直接匯入: the file has no audio stream.
    NoAudio,
    /// The user cancelled with this cue in flight or queued (ENG6); shown apart from failures.
    Cancelled,
}

impl Reason {
    pub fn code(self) -> &'static str {
        match self {
            Self::ZeroLength => "zeroLength",
            Self::OutOfRange => "outOfRange",
            Self::DecodeFailed => "decodeFailed",
            Self::DiskFull => "diskFull",
            Self::WriteFailed => "writeFailed",
            Self::SidecarUnusable => "sidecarUnusable",
            Self::Killed => "killed",
            Self::Other => "other",
            Self::NoAudio => "noAudio",
            Self::Cancelled => "cancelled",
        }
    }
}

/// A cue that did not become a line, as 部分完成 lists it.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Failure {
    pub cue_index: u32,
    pub text: String,
    pub start_ms: u64,
    pub end_ms: u64,
    pub character_id: i64,
    pub reason: Reason,
    /// Developer detail, e.g. the end of ffmpeg's stderr.
    pub detail: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum RunStatus {
    Running,
    Complete,
    Partial,
    Failed,
    Cancelled,
}

impl RunStatus {
    fn code(self) -> &'static str {
        match self {
            Self::Running => "running",
            Self::Complete => "complete",
            Self::Partial => "partial",
            Self::Failed => "failed",
            Self::Cancelled => "cancelled",
        }
    }
}

/// A source file as the run saw it; retry compares size and mtime only to warn (ENG4).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SourceStamp {
    pub path: PathBuf,
    pub bytes: Option<i64>,
    pub mtime: Option<i64>,
}

impl SourceStamp {
    pub fn of(path: &Path) -> Self {
        let meta = std::fs::metadata(path).ok();
        Self {
            path: path.to_owned(),
            bytes: meta.as_ref().map(|m| m.len() as i64),
            mtime: meta
                .and_then(|m| m.modified().ok())
                .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                .map(|d| d.as_millis() as i64),
        }
    }
}

pub fn start_subtitle_run(
    writer: &Writer,
    subtitle: &SourceStamp,
    video: &SourceStamp,
) -> Result<i64, StoreError> {
    let (subtitle, video) = (subtitle.clone(), video.clone());
    writer.write(move |conn| {
        conn.execute(
            "INSERT INTO import_runs (kind, subtitle_path, video_path, subtitle_bytes, subtitle_mtime,
                                      video_bytes, video_mtime, status, started_at)
             VALUES ('subtitle', ?1, ?2, ?3, ?4, ?5, ?6, 'running', ?7)",
            params![
                subtitle.path.to_string_lossy(),
                video.path.to_string_lossy(),
                subtitle.bytes,
                subtitle.mtime,
                video.bytes,
                video.mtime,
                store::now_ms()
            ],
        )?;
        Ok(conn.last_insert_rowid())
    })
}

/// Records a finished (or cancelled) pass: its failures, the imported count added to the run's
/// total, and the run's status — in one transaction.
pub fn finish_run(
    writer: &Writer,
    run_id: i64,
    status: RunStatus,
    imported: usize,
    failures: Vec<Failure>,
) -> Result<(), StoreError> {
    writer.write(move |conn| {
        let tx = conn.transaction()?;
        let now = store::now_ms();
        for f in &failures {
            let status = if f.reason == Reason::Cancelled {
                "cancelled"
            } else {
                "failed"
            };
            tx.execute(
                "INSERT INTO import_failures (run_id, cue_index, cue_text, start_ms, end_ms, character_id,
                                              status, reason_code, reason_detail, created_at)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
                params![
                    run_id,
                    f.cue_index,
                    f.text,
                    f.start_ms as i64,
                    f.end_ms as i64,
                    f.character_id,
                    status,
                    f.reason.code(),
                    f.detail.as_deref().map(|d| d.chars().take(2000).collect::<String>()),
                    now
                ],
            )?;
        }
        tx.execute(
            "UPDATE import_runs SET status = ?2, imported_count = imported_count + ?3, finished_at = ?4
             WHERE id = ?1",
            params![run_id, status.code(), imported as i64, now],
        )?;
        tx.commit()?;
        Ok(())
    })
}

/// A recorded failure, as retry reads it back.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StoredFailure {
    pub id: i64,
    pub cue_index: u32,
    pub cue_text: String,
    pub start_ms: u64,
    pub end_ms: u64,
    pub character_id: i64,
}

/// The run's sources and its retryable (failed or cancelled) cues.
pub fn load_for_retry(
    writer: &Writer,
    run_id: i64,
) -> Result<Option<(SourceStamp, SourceStamp, Vec<StoredFailure>)>, StoreError> {
    writer.write(move |conn| {
        let run = conn
            .query_row(
                "SELECT subtitle_path, subtitle_bytes, subtitle_mtime, video_path, video_bytes, video_mtime
                 FROM import_runs WHERE id = ?1 AND kind = 'subtitle'",
                [run_id],
                |r| {
                    Ok((
                        SourceStamp {
                            path: PathBuf::from(r.get::<_, String>(0)?),
                            bytes: r.get(1)?,
                            mtime: r.get(2)?,
                        },
                        SourceStamp {
                            path: PathBuf::from(r.get::<_, String>(3)?),
                            bytes: r.get(4)?,
                            mtime: r.get(5)?,
                        },
                    ))
                },
            )
            .optional()?;
        let Some((subtitle, video)) = run else {
            return Ok(None);
        };
        let mut stmt = conn.prepare(
            "SELECT id, cue_index, cue_text, start_ms, end_ms, character_id FROM import_failures
             WHERE run_id = ?1 AND status IN ('failed', 'cancelled') ORDER BY cue_index",
        )?;
        let failures = stmt
            .query_map([run_id], |r| {
                Ok(StoredFailure {
                    id: r.get(0)?,
                    cue_index: r.get(1)?,
                    cue_text: r.get(2)?,
                    start_ms: r.get::<_, i64>(3)? as u64,
                    end_ms: r.get::<_, i64>(4)? as u64,
                    character_id: r.get(5)?,
                })
            })?
            .collect::<Result<_, _>>()?;
        Ok(Some((subtitle, video, failures)))
    })
}

/// Before a retry pass: the retried failures leave the list (they are re-recorded if they fail
/// again) and the ones whose text is gone from the subtitle file become `lost` (ENG4).
pub fn begin_retry(
    writer: &Writer,
    run_id: i64,
    retried: Vec<i64>,
    lost: Vec<i64>,
) -> Result<(), StoreError> {
    writer.write(move |conn| {
        let tx = conn.transaction()?;
        for id in &retried {
            tx.execute("DELETE FROM import_failures WHERE id = ?1", [id])?;
        }
        for id in &lost {
            tx.execute(
                "UPDATE import_failures SET status = 'lost', reason_code = 'lost' WHERE id = ?1",
                [id],
            )?;
        }
        tx.execute(
            "UPDATE import_runs SET status = 'running', finished_at = NULL WHERE id = ?1",
            [run_id],
        )?;
        tx.commit()?;
        Ok(())
    })
}

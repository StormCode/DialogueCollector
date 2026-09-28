//! The single writer (FC8, T5): during an import every database write goes through one thread
//! that owns its own connection. Cues are encoded up to four at a time, but their rows queue
//! here instead of racing for SQLite's single write lock, so `SQLITE_BUSY` never surfaces.
//!
//! The API is blocking on purpose: its callers (`import::commit_cue`) already run on worker
//! threads because they fsync and rename files.

use std::path::Path;
use std::sync::mpsc;
use std::thread::JoinHandle;

use rusqlite::Connection;

use super::StoreError;

type Job = Box<dyn FnOnce(&mut Connection) + Send>;

pub struct Writer {
    jobs: Option<mpsc::Sender<Job>>,
    thread: Option<JoinHandle<()>>,
}

impl Writer {
    /// Opens a dedicated connection to `db` (same pragmas and migrations as `store::open`).
    pub fn open(db: &Path) -> Result<Self, StoreError> {
        let mut conn = super::open(db)?;
        let (jobs, queue) = mpsc::channel::<Job>();
        let thread = std::thread::Builder::new()
            .name("store-writer".into())
            .spawn(move || {
                for job in queue {
                    job(&mut conn);
                }
            })
            .map_err(StoreError::WriterSpawn)?;
        Ok(Self {
            jobs: Some(jobs),
            thread: Some(thread),
        })
    }

    /// Runs `f` on the writer thread and waits for its result. Jobs run one at a time, in
    /// the order they were submitted.
    pub fn write<T, F>(&self, f: F) -> Result<T, StoreError>
    where
        T: Send + 'static,
        F: FnOnce(&mut Connection) -> Result<T, StoreError> + Send + 'static,
    {
        let (reply, result) = mpsc::sync_channel(1);
        self.jobs
            .as_ref()
            .ok_or(StoreError::WriterClosed)?
            .send(Box::new(move |conn| {
                let _ = reply.send(f(conn));
            }))
            .map_err(|_| StoreError::WriterClosed)?;
        // A job that panicked dropped `reply` without sending, and took the thread with it.
        result.recv().map_err(|_| StoreError::WriterClosed)?
    }
}

impl Drop for Writer {
    fn drop(&mut self) {
        // Closing the queue ends the thread after it finishes the jobs already submitted.
        drop(self.jobs.take());
        if let Some(thread) = self.thread.take() {
            let _ = thread.join();
        }
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use super::*;

    fn setup(dir: &Path) -> Writer {
        let db = dir.join("w.sqlite");
        let conn = super::super::open(&db).unwrap();
        conn.execute(
            "INSERT INTO characters (id, name, category, source, created_at, updated_at)
             VALUES (1, 'a', 'anime', 's', 0, 0)",
            [],
        )
        .unwrap();
        Writer::open(&db).unwrap()
    }

    #[test]
    fn concurrent_writers_are_serialised_without_busy_errors() {
        let dir = tempfile::tempdir().unwrap();
        let writer = Arc::new(setup(dir.path()));
        let threads: Vec<_> = (0..8)
            .map(|t| {
                let writer = Arc::clone(&writer);
                std::thread::spawn(move || {
                    for i in 0..50 {
                        let name = format!("{:0>12}.m4a", t * 100 + i);
                        writer
                            .write(move |conn| {
                                let tx = conn.transaction()?;
                                tx.execute(
                                    "INSERT INTO lines (character_id, text, audio_filename, audio_bytes, duration_ms, created_at, updated_at)
                                     VALUES (1, 'x', ?1, 1, 1, 0, 0)",
                                    [&name],
                                )?;
                                tx.commit()?;
                                Ok(())
                            })
                            .unwrap();
                    }
                })
            })
            .collect();
        for t in threads {
            t.join().unwrap();
        }
        let count: i64 = writer
            .write(|conn| Ok(conn.query_row("SELECT COUNT(*) FROM lines", [], |r| r.get(0))?))
            .unwrap();
        assert_eq!(count, 400);
    }

    #[test]
    fn a_panicking_job_closes_the_writer_instead_of_hanging() {
        let dir = tempfile::tempdir().unwrap();
        let writer = setup(dir.path());
        let err = writer.write::<(), _>(|_| panic!("boom")).unwrap_err();
        assert!(matches!(err, StoreError::WriterClosed));
        assert!(matches!(
            writer.write(|_| Ok(())).unwrap_err(),
            StoreError::WriterClosed
        ));
    }
}

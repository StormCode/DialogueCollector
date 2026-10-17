//! Running the ffmpeg/ffprobe sidecars as plain child processes, so an import can kill them the
//! moment the user cancels and a killed child is reported as `MediaError::Killed`.
//!
//! Tauri places `bundle.externalBin` binaries next to the app executable (and `tauri dev`
//! copies them next to the dev build), which is also where tauri-plugin-shell looks.

use std::io::{BufRead, BufReader, Read};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use super::MediaError;

/// How often a running child is checked for exit and for cancellation.
const POLL: Duration = Duration::from_millis(10);

/// How long a child may run without a `-progress` heartbeat before it is killed as hung.
/// ffmpeg writes one line every ~0.5 s (wall clock) regardless of encode speed, so a minute
/// of silence means a hard stall, while still tolerating a brief I/O pause.
pub const HUNG_TIMEOUT: Duration = Duration::from_secs(60);

/// Bytes of stderr kept for error reports and logs (the last line is what gets shown).
pub const STDERR_TAIL: usize = 600;

/// The bundled sidecar `name` (`ffmpeg`, `ffprobe`) beside the running executable.
pub fn sidecar(name: &str) -> Result<PathBuf, MediaError> {
    let exe = std::env::current_exe().map_err(|e| MediaError::SidecarUnusable(e.to_string()))?;
    let path = exe
        .parent()
        .ok_or_else(|| MediaError::SidecarUnusable("executable has no parent".into()))?
        .join(format!("{name}{}", std::env::consts::EXE_SUFFIX));
    if !path.is_file() {
        return Err(MediaError::SidecarUnusable(format!(
            "{} is missing",
            path.display()
        )));
    }
    Ok(path)
}

pub fn command(program: &Path, args: &[String]) -> Command {
    let mut cmd = Command::new(program);
    cmd.args(args)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x0800_0000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }
    cmd
}

/// A finished child's output.
#[derive(Debug)]
pub struct Output {
    pub stdout: Vec<u8>,
    pub elapsed: Duration,
}

/// Runs `cmd` to completion. Setting `cancel` kills it and returns `MediaError::Killed`, as
/// does a child killed from outside by a signal. With `expect_progress` the child is also
/// killed as `MediaError::Hung` once it stops sending its `-progress` heartbeat.
pub fn run(cmd: Command, cancel: &AtomicBool, expect_progress: bool) -> Result<Output, MediaError> {
    run_with_timeout(cmd, cancel, expect_progress, HUNG_TIMEOUT)
}

/// `run` with a custom heartbeat timeout, so a stall can be tested without waiting a minute.
pub(crate) fn run_with_timeout(
    mut cmd: Command,
    cancel: &AtomicBool,
    expect_progress: bool,
    hung_timeout: Duration,
) -> Result<Output, MediaError> {
    let started = Instant::now();
    let mut child = cmd
        .spawn()
        .map_err(|e| MediaError::SidecarUnusable(e.to_string()))?;

    // The stdout drain bumps this on each `progress=` line, so the poll loop can tell a stall
    // from a healthy (but slow) encode. Only armed when `-progress pipe:1` was requested.
    let heartbeat: Option<Arc<Mutex<Instant>>> =
        expect_progress.then(|| Arc::new(Mutex::new(Instant::now())));

    // Drain both pipes on their own threads so a chatty child never blocks on a full pipe.
    let stdout = drain(child.stdout.take(), heartbeat.clone());
    let stderr = drain(child.stderr.take(), None);

    let status = loop {
        if cancel.load(Ordering::Acquire) {
            let _ = child.kill();
            let _ = child.wait();
            return Err(MediaError::Killed);
        }
        if let Some(hb) = &heartbeat {
            if Instant::now().duration_since(*hb.lock().unwrap()) > hung_timeout {
                let _ = child.kill();
                let _ = child.wait();
                return Err(MediaError::Hung);
            }
        }
        match child.try_wait() {
            Ok(Some(status)) => break status,
            Ok(None) => std::thread::sleep(POLL),
            Err(e) => return Err(MediaError::SidecarUnusable(e.to_string())),
        }
    };
    let stdout = stdout.join().unwrap_or_default();
    let stderr = stderr.join().unwrap_or_default();

    if status.success() {
        return Ok(Output {
            stdout,
            elapsed: started.elapsed(),
        });
    }
    if status.code().is_none() {
        // No exit code: terminated by a signal (Unix).
        return Err(MediaError::Killed);
    }
    Err(MediaError::Exit {
        code: status.code(),
        stderr_tail: stderr_tail(&String::from_utf8_lossy(&stderr)),
    })
}

fn drain<R: Read + Send + 'static>(
    pipe: Option<R>,
    heartbeat: Option<Arc<Mutex<Instant>>>,
) -> std::thread::JoinHandle<Vec<u8>> {
    std::thread::spawn(move || {
        let Some(mut pipe) = pipe else {
            return Vec::new();
        };
        // Without a heartbeat the bytes are the payload (ffprobe's JSON), read verbatim.
        let Some(hb) = heartbeat else {
            let mut buf = Vec::new();
            let _ = pipe.read_to_end(&mut buf);
            return buf;
        };
        // With a heartbeat the stdout is only the `-progress` stream, whose bytes are not
        // used; read it line by line and note each report for the stall watchdog.
        let mut line = String::new();
        let mut reader = BufReader::new(pipe);
        loop {
            line.clear();
            match reader.read_line(&mut line) {
                Ok(0) | Err(_) => break,
                Ok(_) => {
                    if line.starts_with("progress=") {
                        *hb.lock().unwrap() = Instant::now();
                    }
                }
            }
        }
        Vec::new()
    })
}

pub fn stderr_tail(stderr: &str) -> String {
    let trimmed = stderr.trim_end();
    let start = trimmed
        .char_indices()
        .rev()
        .nth(STDERR_TAIL)
        .map_or(0, |(i, _)| i);
    trimmed[start..].to_owned()
}

#[cfg(all(test, unix))]
mod tests {
    use super::*;

    fn sh(script: &str) -> Command {
        command(Path::new("/bin/sh"), &["-c".into(), script.into()])
    }

    #[test]
    fn success_returns_stdout() {
        let out = run(sh("printf hello"), &AtomicBool::new(false), false).unwrap();
        assert_eq!(out.stdout, b"hello");
    }

    #[test]
    fn a_failure_reports_its_code_and_the_end_of_stderr() {
        let err = run(
            sh("echo first >&2; echo 'last line' >&2; exit 3"),
            &AtomicBool::new(false),
            false,
        )
        .unwrap_err();
        match err {
            MediaError::Exit { code, stderr_tail } => {
                assert_eq!(code, Some(3));
                assert!(stderr_tail.ends_with("last line"));
            }
            other => panic!("{other:?}"),
        }
    }

    /// A sidecar SIGKILLed from outside still surfaces as `MediaError::Killed`.
    #[test]
    fn a_child_killed_by_sigkill_is_reported_as_killed() {
        let err = run(sh("kill -9 $$"), &AtomicBool::new(false), false).unwrap_err();
        assert!(matches!(err, MediaError::Killed), "{err:?}");
    }

    #[test]
    fn cancelling_kills_a_running_child_promptly() {
        let cancel = std::sync::Arc::new(AtomicBool::new(false));
        let flag = std::sync::Arc::clone(&cancel);
        std::thread::spawn(move || {
            std::thread::sleep(Duration::from_millis(100));
            flag.store(true, Ordering::Release);
        });
        let started = Instant::now();
        let err = run(sh("sleep 30"), &cancel, false).unwrap_err();
        assert!(matches!(err, MediaError::Killed));
        assert!(started.elapsed() < Duration::from_secs(5));
    }

    #[test]
    fn a_child_without_a_heartbeat_is_killed_as_hung() {
        let err = run_with_timeout(
            sh("sleep 30"),
            &AtomicBool::new(false),
            true,
            Duration::from_millis(200),
        )
        .unwrap_err();
        assert!(matches!(err, MediaError::Hung), "{err:?}");
    }

    #[test]
    fn a_child_that_reports_progress_is_not_hung() {
        // A progress line every 0.1 s holds the watchdog off well past its 2 s timeout, so this
        // asserts the heartbeat (not just a quick exit) is what keeps the child from being hung.
        let out = run_with_timeout(
            sh("i=0; while [ $i -lt 5 ]; do echo progress=continue; i=$((i+1)); sleep 0.1; done"),
            &AtomicBool::new(false),
            true,
            Duration::from_secs(2),
        )
        .unwrap();
        assert!(out.stdout.is_empty());
    }

    #[test]
    fn no_heartbeat_watch_when_progress_is_not_expected() {
        // `expect_progress=false` must never trip the watchdog, however short the timeout.
        let out = run_with_timeout(
            sh("sleep 1"),
            &AtomicBool::new(false),
            false,
            Duration::from_millis(50),
        )
        .unwrap();
        assert!(out.stdout.is_empty());
    }

    #[test]
    fn stderr_tail_keeps_the_end() {
        let long = "x".repeat(2000) + "last line";
        let tail = stderr_tail(&long);
        assert!(tail.ends_with("last line"));
        assert!(tail.chars().count() <= STDERR_TAIL + 1);
    }
}

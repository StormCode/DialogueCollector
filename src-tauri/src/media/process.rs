//! Running the ffmpeg/ffprobe sidecars as plain child processes, so an import can kill them the
//! moment the user cancels and a killed child is reported as `MediaError::Killed`.
//!
//! Tauri places `bundle.externalBin` binaries next to the app executable (and `tauri dev`
//! copies them next to the dev build), which is also where tauri-plugin-shell looks.

use std::io::Read;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{Duration, Instant};

use super::MediaError;

/// How often a running child is checked for exit and for cancellation.
const POLL: Duration = Duration::from_millis(10);

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
/// does a child killed from outside by a signal.
pub fn run(mut cmd: Command, cancel: &AtomicBool) -> Result<Output, MediaError> {
    let started = Instant::now();
    let mut child = cmd
        .spawn()
        .map_err(|e| MediaError::SidecarUnusable(e.to_string()))?;

    // Drain both pipes on their own threads so a chatty child never blocks on a full pipe.
    let stdout = drain(child.stdout.take());
    let stderr = drain(child.stderr.take());

    let status = loop {
        if cancel.load(Ordering::Acquire) {
            let _ = child.kill();
            let _ = child.wait();
            return Err(MediaError::Killed);
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

fn drain<R: Read + Send + 'static>(pipe: Option<R>) -> std::thread::JoinHandle<Vec<u8>> {
    std::thread::spawn(move || {
        let mut buf = Vec::new();
        if let Some(mut pipe) = pipe {
            let _ = pipe.read_to_end(&mut buf);
        }
        buf
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
        let out = run(sh("printf hello"), &AtomicBool::new(false)).unwrap();
        assert_eq!(out.stdout, b"hello");
    }

    #[test]
    fn a_failure_reports_its_code_and_the_end_of_stderr() {
        let err = run(
            sh("echo first >&2; echo 'last line' >&2; exit 3"),
            &AtomicBool::new(false),
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
        let err = run(sh("kill -9 $$"), &AtomicBool::new(false)).unwrap_err();
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
        let err = run(sh("sleep 30"), &cancel).unwrap_err();
        assert!(matches!(err, MediaError::Killed));
        assert!(started.elapsed() < Duration::from_secs(5));
    }

    #[test]
    fn stderr_tail_keeps_the_end() {
        let long = "x".repeat(2000) + "last line";
        let tail = stderr_tail(&long);
        assert!(tail.ends_with("last line"));
        assert!(tail.chars().count() <= STDERR_TAIL + 1);
    }
}

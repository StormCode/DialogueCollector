//! Where a library folder physically lives (ENG5 → A).
//!
//! WAL needs a shared-memory `-shm` file and does not work on network filesystems, and a
//! sync client moving a live SQLite file corrupts it in any journal mode. So a library on a
//! network volume or inside a known cloud-sync root is refused before the database is opened.

use std::path::{Path, PathBuf};

use serde::Serialize;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum VolumeKind {
    Local,
    /// Network filesystem (SMB, AFP, NFS, WebDAV, a mapped drive, a UNC path).
    Network {
        detail: String,
    },
    /// Inside a folder a sync client owns (iCloud Drive, Dropbox, OneDrive, Google Drive, …).
    CloudSync {
        provider: String,
    },
}

impl VolumeKind {
    pub fn is_supported(&self) -> bool {
        matches!(self, Self::Local)
    }
}

/// Classify `path`. It need not exist: the nearest existing ancestor is examined.
pub fn classify(path: &Path) -> VolumeKind {
    let existing = nearest_existing(path);
    let resolved = existing.canonicalize().unwrap_or(existing);

    if let Some(provider) = cloud_provider(&resolved, &cloud_roots()) {
        return VolumeKind::CloudSync { provider };
    }
    match network_detail(&resolved) {
        Some(detail) => VolumeKind::Network { detail },
        None => VolumeKind::Local,
    }
}

fn nearest_existing(path: &Path) -> PathBuf {
    let mut current = path;
    loop {
        if current.exists() {
            return current.to_path_buf();
        }
        match current.parent() {
            Some(parent) => current = parent,
            None => return path.to_path_buf(),
        }
    }
}

/// Known sync roots on this machine, as (root, provider name).
fn cloud_roots() -> Vec<(PathBuf, String)> {
    let mut roots = Vec::new();
    let Some(home) = dirs::home_dir() else {
        return roots;
    };

    #[cfg(target_os = "macos")]
    {
        roots.push((
            home.join("Library/Mobile Documents"),
            "iCloud Drive".to_owned(),
        ));
        // Dropbox, OneDrive, Google Drive and Box all mount under CloudStorage on current
        // macOS; the provider is the first path segment (e.g. "Dropbox", "OneDrive-Personal").
        if let Ok(entries) = std::fs::read_dir(home.join("Library/CloudStorage")) {
            for entry in entries.flatten() {
                let name = entry.file_name().to_string_lossy().into_owned();
                roots.push((entry.path(), name));
            }
        }
    }

    #[cfg(windows)]
    {
        for var in ["OneDrive", "OneDriveConsumer", "OneDriveCommercial"] {
            if let Some(root) = std::env::var_os(var) {
                roots.push((PathBuf::from(root), "OneDrive".to_owned()));
            }
        }
        roots.push((home.join("iCloudDrive"), "iCloud Drive".to_owned()));
    }

    roots.push((home.join("Dropbox"), "Dropbox".to_owned()));
    roots.push((home.join("Google Drive"), "Google Drive".to_owned()));
    roots
        .into_iter()
        .map(|(root, name)| (root.canonicalize().unwrap_or(root), name))
        .collect()
}

pub(crate) fn cloud_provider(path: &Path, roots: &[(PathBuf, String)]) -> Option<String> {
    roots
        .iter()
        .find(|(root, _)| path.starts_with(root))
        .map(|(_, name)| name.clone())
}

#[cfg(target_os = "macos")]
fn network_detail(path: &Path) -> Option<String> {
    use std::ffi::{CStr, CString};
    use std::os::unix::ffi::OsStrExt;

    let c_path = CString::new(path.as_os_str().as_bytes()).ok()?;
    let mut stat: libc::statfs = unsafe { std::mem::zeroed() };
    // SAFETY: c_path is a valid NUL-terminated string and stat is a writable statfs.
    if unsafe { libc::statfs(c_path.as_ptr(), &mut stat) } != 0 {
        return None;
    }
    // SAFETY: f_fstypename is a NUL-terminated array filled in by statfs.
    let fs_type = unsafe { CStr::from_ptr(stat.f_fstypename.as_ptr()) }
        .to_string_lossy()
        .into_owned();
    let is_local = stat.f_flags & libc::MNT_LOCAL as u32 != 0;
    const NETWORK_FS: &[&str] = &["smbfs", "afpfs", "nfs", "webdav", "ftp", "cifs"];
    (!is_local || NETWORK_FS.contains(&fs_type.as_str())).then_some(fs_type)
}

#[cfg(windows)]
fn network_detail(path: &Path) -> Option<String> {
    use std::os::windows::ffi::OsStrExt;
    use std::path::{Component, Prefix};
    use windows_sys::Win32::Storage::FileSystem::GetDriveTypeW;
    use windows_sys::Win32::System::WindowsProgramming::DRIVE_REMOTE;

    let prefix = match path.components().next() {
        Some(Component::Prefix(p)) => p.kind(),
        _ => return None,
    };
    let root = match prefix {
        Prefix::UNC(..) | Prefix::VerbatimUNC(..) => return Some("UNC path".to_owned()),
        Prefix::Disk(letter) | Prefix::VerbatimDisk(letter) => format!("{}:\\", letter as char),
        _ => return None,
    };
    let wide: Vec<u16> = std::ffi::OsStr::new(&root)
        .encode_wide()
        .chain(std::iter::once(0))
        .collect();
    // SAFETY: wide is a NUL-terminated UTF-16 root path.
    let drive_type = unsafe { GetDriveTypeW(wide.as_ptr()) };
    (drive_type == DRIVE_REMOTE).then(|| format!("network drive {root}"))
}

#[cfg(not(any(target_os = "macos", windows)))]
fn network_detail(_path: &Path) -> Option<String> {
    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn path_inside_a_sync_root_names_the_provider() {
        let roots = vec![
            (
                PathBuf::from("/Users/a/Library/CloudStorage/Dropbox"),
                "Dropbox".to_owned(),
            ),
            (
                PathBuf::from("/Users/a/Library/Mobile Documents"),
                "iCloud Drive".to_owned(),
            ),
        ];
        assert_eq!(
            cloud_provider(
                Path::new("/Users/a/Library/CloudStorage/Dropbox/lib"),
                &roots
            ),
            Some("Dropbox".to_owned())
        );
        assert_eq!(
            cloud_provider(
                Path::new("/Users/a/Library/Mobile Documents/com~apple~CloudDocs/lib"),
                &roots
            ),
            Some("iCloud Drive".to_owned())
        );
    }

    #[test]
    fn prefix_match_is_by_path_component_not_string() {
        let roots = vec![(PathBuf::from("/Users/a/Dropbox"), "Dropbox".to_owned())];
        assert_eq!(
            cloud_provider(Path::new("/Users/a/Dropbox Old/lib"), &roots),
            None
        );
    }

    /// Needs a real network mount, so it only runs when one is named:
    /// `DC_NETWORK_PATH=/Volumes/Share cargo test -- --ignored network`
    /// Read-only: nothing is created or written on the share.
    #[test]
    #[ignore]
    fn network_mount_is_refused_before_anything_is_written() {
        let share = PathBuf::from(
            std::env::var_os("DC_NETWORK_PATH").expect("set DC_NETWORK_PATH to a network mount"),
        );
        let kind = classify(&share.join("DialogueCollector"));
        assert!(matches!(kind, VolumeKind::Network { .. }), "{kind:?}");

        let target = share.join("DialogueCollector-never-created");
        let err = super::super::relocate::plan(&target, None).unwrap_err();
        assert!(matches!(
            err,
            super::super::LibraryError::UnsupportedVolume { .. }
        ));
        let err = super::super::folder::Library::open(&target).err().unwrap();
        assert!(matches!(
            err,
            super::super::LibraryError::UnsupportedVolume { .. }
        ));
        assert!(!target.exists(), "the refusal must not touch the share");
    }

    #[test]
    fn a_local_temp_dir_is_supported_even_before_it_exists() {
        let dir = tempfile::tempdir().unwrap();
        let kind = classify(&dir.path().join("not/yet/created"));
        assert_eq!(kind, VolumeKind::Local);
        assert!(kind.is_supported());
    }
}

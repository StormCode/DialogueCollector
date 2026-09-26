#!/usr/bin/env bash
# Build an LGPL ffmpeg + ffprobe for Windows x64 from the pinned source tarball and install them
# as Tauri sidecars: src-tauri/binaries/{ffmpeg,ffprobe}-x86_64-pc-windows-msvc.exe.
#
# Run inside an MSYS2 UCRT64 shell (CI: msys2/setup-msys2 with path-type inherit, so `node` from
# the Windows PATH is available) with these packages:
#   mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-nasm mingw-w64-ucrt-x86_64-pkgconf
#   mingw-w64-ucrt-x86_64-zlib mingw-w64-ucrt-x86_64-bzip2 make diffutils tar xz curl
#
# Same LGPL posture as build-macos.sh: no --enable-gpl / --enable-nonfree, no external codec
# libraries. Linked fully static so the executables need only DLLs that ship with Windows.
# The Tauri target triple says msvc; the sidecar is a standalone process, so the toolchain
# that built it does not matter.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CACHE="${DC_CACHE_DIR:-$HOME/.cache/dialogue-collector}"
TRIPLE="x86_64-pc-windows-msvc"

# node is the Windows build, so hand it a Windows path rather than an MSYS one.
PINS="$(cygpath -m "$ROOT/scripts/ffmpeg/pins.json" 2>/dev/null || echo "$ROOT/scripts/ffmpeg/pins.json")"
pin() { node -p "require('$PINS').$1"; }
VERSION="$(pin version)"
URL="$(pin source.url)"
SHA="$(pin source.sha256)"

mkdir -p "$CACHE"
TARBALL="$CACHE/ffmpeg-$VERSION.tar.xz"
[ -f "$TARBALL" ] || curl -sSfL -o "$TARBALL" "$URL"
echo "$SHA  $TARBALL" | sha256sum -c - >/dev/null || {
  echo "SHA256 mismatch for $TARBALL (expected $SHA)" >&2; exit 1; }

WORK="$CACHE/build-$VERSION-$TRIPLE"
rm -rf "$WORK" && mkdir -p "$WORK"
tar -xJf "$TARBALL" -C "$WORK" --strip-components=1
cd "$WORK"

# configure and make write to log files to keep CI output readable; show their tails on failure.
dump_logs() {
  for log in configure.log ffbuild/config.log make.log; do
    [ -f "$log" ] && { echo "::group::tail $log" >&2; tail -n 60 "$log" >&2; echo "::endgroup::" >&2; }
  done
}
trap 'status=$?; [ $status -ne 0 ] && dump_logs; exit $status' EXIT

./configure \
  --arch=x86_64 --target-os=mingw32 \
  --pkg-config-flags=--static \
  --extra-ldflags=-static \
  --disable-autodetect --enable-zlib --enable-bzlib --enable-w32threads \
  --disable-network --disable-doc --disable-debug --disable-ffplay \
  --enable-static --disable-shared \
  >configure.log

if grep -qE '^CONFIG_(GPL|NONFREE)=yes' ffbuild/config.mak; then
  echo "error: configuration enables GPL or nonfree code, expected LGPL" >&2; exit 1
fi

# On Windows the Makefile targets carry the executable suffix.
make -j"$(nproc)" ffmpeg.exe ffprobe.exe >make.log 2>&1

# Nothing from the MinGW runtime may be left as a DLL dependency.
for bin in ffmpeg ffprobe; do
  deps="$(objdump -p "$bin.exe" | sed -n 's/.*DLL Name: //p' | tr 'A-Z' 'a-z')"
  echo "$bin.exe imports: $(echo $deps)"
  if echo "$deps" | grep -qE 'libwinpthread|libgcc|libstdc|zlib1|libbz2'; then
    echo "error: $bin.exe depends on a MinGW DLL" >&2; exit 1
  fi
done

OUT="$ROOT/src-tauri/binaries"
mkdir -p "$OUT"
for bin in ffmpeg ffprobe; do
  install -m 755 "$bin.exe" "$OUT/$bin-$TRIPLE.exe"
  strip "$OUT/$bin-$TRIPLE.exe"
done
ls -l "$OUT"/*-"$TRIPLE".exe
echo "built ffmpeg $VERSION (LGPL) for $TRIPLE → $OUT"

#!/usr/bin/env bash
# Build an LGPL ffmpeg + ffprobe for macOS from the pinned source tarball and install them as
# Tauri sidecars: src-tauri/binaries/{ffmpeg,ffprobe}-<target-triple>.
#
#   scripts/ffmpeg/build-macos.sh [aarch64|x86_64]   (default: host arch)
#
# LGPL-clean: no --enable-gpl / --enable-nonfree and no external libraries, only ffmpeg's own
# decoders/demuxers plus macOS system frameworks. `ffmpeg -L` of the result says LGPL.
# x86_64 needs `nasm` (brew install nasm); without it the build falls back to --disable-x86asm.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PINS="$ROOT/scripts/ffmpeg/pins.json"
CACHE="${DC_CACHE_DIR:-$HOME/.cache/dialogue-collector}"
MIN_MACOS="11.0"

ARCH="${1:-$(uname -m)}"
case "$ARCH" in
  arm64|aarch64) ARCH=aarch64; CLANG_ARCH=arm64 ;;
  x86_64) CLANG_ARCH=x86_64 ;;
  *) echo "unsupported arch: $ARCH" >&2; exit 2 ;;
esac
TRIPLE="$ARCH-apple-darwin"

pin() { python3 -c "import json,sys; d=json.load(open('$PINS')); print(eval(sys.argv[1]))" "$1"; }
VERSION="$(pin "d['version']")"
URL="$(pin "d['source']['url']")"
SHA="$(pin "d['source']['sha256']")"

mkdir -p "$CACHE"
TARBALL="$CACHE/ffmpeg-$VERSION.tar.xz"
[ -f "$TARBALL" ] || curl -sSfL -o "$TARBALL" "$URL"
echo "$SHA  $TARBALL" | shasum -a 256 -c - >/dev/null || {
  echo "SHA256 mismatch for $TARBALL (expected $SHA)" >&2; exit 1; }

WORK="$CACHE/build-$VERSION-$TRIPLE"
rm -rf "$WORK" && mkdir -p "$WORK"
tar -xJf "$TARBALL" -C "$WORK" --strip-components=1
cd "$WORK"

ASM_FLAGS=()
if [ "$ARCH" = x86_64 ] && ! command -v nasm >/dev/null; then
  echo "warning: nasm not found, building x86_64 without assembly optimizations" >&2
  ASM_FLAGS=(--disable-x86asm)
fi

CROSS_FLAGS=()
if [ "$CLANG_ARCH" != "$(uname -m)" ]; then
  CROSS_FLAGS=(--enable-cross-compile --arch="$ARCH" --target-os=darwin)
fi

./configure \
  --cc="clang -arch $CLANG_ARCH" \
  --extra-cflags="-mmacosx-version-min=$MIN_MACOS" \
  --extra-ldflags="-mmacosx-version-min=$MIN_MACOS" \
  ${CROSS_FLAGS[@]+"${CROSS_FLAGS[@]}"} ${ASM_FLAGS[@]+"${ASM_FLAGS[@]}"} \
  --disable-autodetect --enable-zlib --enable-bzlib --enable-audiotoolbox \
  --disable-network --disable-doc --disable-debug --disable-ffplay \
  --enable-static --disable-shared \
  >configure.log

# Read the licence from the build configuration, not by running the binary: a cross-built
# x86_64 binary cannot run on an arm64 host without Rosetta.
if grep -qE '^CONFIG_(GPL|NONFREE)=yes' ffbuild/config.mak; then
  echo "error: configuration enables GPL or nonfree code, expected LGPL" >&2; exit 1
fi
grep -q '^CONFIG_GPL=yes' ffbuild/config.mak || grep -q '^!CONFIG_GPL=yes' ffbuild/config.mak || {
  echo "error: cannot determine the licence from ffbuild/config.mak" >&2; exit 1; }

make -j"$(sysctl -n hw.ncpu)" ffmpeg ffprobe >make.log 2>&1

OUT="$ROOT/src-tauri/binaries"
mkdir -p "$OUT"
for bin in ffmpeg ffprobe; do
  install -m 755 "$bin" "$OUT/$bin-$TRIPLE"
  strip "$OUT/$bin-$TRIPLE"
  # Apple Silicon refuses to run an unsigned executable; an ad-hoc signature is the minimum (FC2).
  codesign --force --sign - "$OUT/$bin-$TRIPLE"
done

echo "built ffmpeg $VERSION (LGPL) for $TRIPLE → $OUT"

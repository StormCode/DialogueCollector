// Walking-skeleton check, renderer half: ask Rust to cut the hardcoded cue, then prove the
// clip is reachable through the asset protocol by loading its metadata in an <audio> element.

import { convertFileSrc } from "@tauri-apps/api/core";

import { ipc } from "./ipc";
import type { SmokeReport } from "./types";

const EXPECTED_SECONDS = 2;
const TOLERANCE_SECONDS = 0.25;
const LOAD_TIMEOUT_MS = 15_000;

export interface SmokeResult {
  report: SmokeReport;
  clipUrl: string;
  durationSeconds: number;
}

export function loadDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const timer = window.setTimeout(() => reject(new Error("timed out loading clip")), LOAD_TIMEOUT_MS);
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      window.clearTimeout(timer);
      resolve(audio.duration);
    };
    audio.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error(`audio element error ${audio.error?.code ?? "?"}`));
    };
    audio.src = url;
    audio.load();
  });
}

export async function runSmoke(): Promise<SmokeResult> {
  const report = await ipc.runSmoke();
  const clipUrl = convertFileSrc(report.clipPath);
  const durationSeconds = await loadDuration(clipUrl);
  if (Math.abs(durationSeconds - EXPECTED_SECONDS) > TOLERANCE_SECONDS) {
    throw new Error(`clip is ${durationSeconds.toFixed(3)} s, expected ~${EXPECTED_SECONDS} s`);
  }
  return { report, clipUrl, durationSeconds };
}

/** In `--smoke` mode: run the check once and report the outcome so the process can exit. */
export async function runHeadlessSmokeIfRequested(): Promise<void> {
  if (!(await ipc.smokeMode())) return;
  try {
    const { report, durationSeconds } = await runSmoke();
    await ipc.smokeFinish(
      true,
      `row=${report.rowId} bytes=${report.clipBytes} cut=${report.cutMs}ms duration=${durationSeconds.toFixed(3)}s`,
    );
  } catch (e) {
    const detail = typeof e === "object" && e && "kind" in e ? JSON.stringify(e) : String(e);
    await ipc.smokeFinish(false, detail);
  }
}

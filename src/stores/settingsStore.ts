import { create } from "zustand";

import { inTauri, ipc } from "../lib/ipc";
import { DEFAULT_SETTINGS, type Settings } from "../lib/types";

interface SettingsState {
  settings: Settings;
  loaded: boolean;
  load: () => Promise<void>;
  update: (patch: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,

  load: async () => {
    const settings = inTauri() ? await ipc.getSettings() : DEFAULT_SETTINGS;
    set({ settings, loaded: true });
  },

  update: async (patch) => {
    const next = { ...get().settings, ...patch };
    const saved = inTauri() ? await ipc.saveSettings(next) : next;
    set({ settings: saved });
  },
}));

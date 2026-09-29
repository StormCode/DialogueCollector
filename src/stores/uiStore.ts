import { create } from "zustand";

/** A toast raised by one page that must outlive it (e.g. before navigating away). */
export interface Notice {
  tone: "negative" | "positive" | "informative" | "warning";
  text: string;
  /** Sized to its text, at least this wide (see Toast). */
  minWidth?: number;
}

interface UiState {
  navExpanded: boolean;
  toggleNav: () => void;
  notice: Notice | null;
  showNotice: (notice: Notice) => void;
  dismissNotice: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  navExpanded: true,
  toggleNav: () => set((s) => ({ navExpanded: !s.navExpanded })),
  notice: null,
  showNotice: (notice) => set({ notice }),
  dismissNotice: () => set({ notice: null }),
}));

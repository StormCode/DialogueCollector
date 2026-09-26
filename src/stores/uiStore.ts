import { create } from "zustand";

interface UiState {
  navExpanded: boolean;
  toggleNav: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  navExpanded: true,
  toggleNav: () => set((s) => ({ navExpanded: !s.navExpanded })),
}));

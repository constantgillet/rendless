import { create } from "zustand";

interface KeepRatioState {
  keepRatio: boolean;
  setKeepRatio: (newKeepRatio: boolean) => void;
}

export const useKeepRatioStore = create<KeepRatioState>((set) => ({
  keepRatio: false,
  setKeepRatio: (newKeepRatio) => set({ keepRatio: newKeepRatio }),
}));

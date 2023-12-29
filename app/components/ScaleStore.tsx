import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ScaleState {
  scale: number;
  setScale: (newScale: number) => void;
  increase: (by: number) => void;
  decrease: (by: number) => void;
}

const minScale = 0.13;

export const useScaleStore = create<ScaleState>()(
  devtools((set) => ({
    scale: 1,
    setScale: (newScale) => set({ scale: newScale }),
    increase: (by) => set((state) => ({ scale: state.scale + by })),
    decrease: (by) =>
      set((state) => {
        const newScale = state.scale - by;
        return {
          scale: newScale < minScale ? minScale : newScale,
        };
      }),
  }))
);

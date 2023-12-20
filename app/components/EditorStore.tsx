import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface EditorState {
  bears: number;
  selected: string[];
  increase: (by: number) => void;
  setSelected: (selected: string[]) => void;
}

export const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        selected: [],
        increase: (by) => set((state) => ({ bears: state.bears + by })),
        setSelected: (selected) => set({ selected }),
      }),
      {
        name: "editor-storage",
      }
    )
  )
);

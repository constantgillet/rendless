import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

interface EditorState {
  bears: number;
  selected: string[];
  tree: Tree;
  increase: (by: number) => void;
  setSelected: (selected: string[]) => void;
}

type Tree = {
  id: string;
  type: string;
  chilren?: Tree[];
  x: number;
  y: number;
  width: number;
  height: number;
};

export const useEditorStore = create<EditorState>()(
  devtools((set) => ({
    bears: 0,
    tree: {
      id: "1",
      type: "page",
      width: 1200,
      height: 630,
      x: 0,
      y: 0,
      chilren: [
        {
          id: "2",
          type: "div",
          x: 0,
          y: 0,
          width: 74,
          height: 74,
        },
        {
          id: "4",
          type: "shape",
          x: 200,
          y: 200,
          width: 74,
          height: 74,
        },
      ],
    },
    selected: [],
    increase: (by) => set((state) => ({ bears: state.bears + by })),
    setSelected: (selected) => set({ selected }),
  }))
);

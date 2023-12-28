import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

export type Tool = "select" | "text" | "rect";

export type ObjectType = "page" | "rect" | "text";

export type Tree = {
  id: string;
  type: ObjectType;
  chilren?: Tree[];
  x: number;
  y: number;
  width: number;
  height: number;
};

interface EditorState {
  bears: number;
  selected: string[];
  tree: Tree;
  selectedTool: Tool;
  increase: (by: number) => void;
  setSelected: (selected: string[]) => void;
  addElement: (element: Tree) => void;
  deleteElements: (elemenentIds: string[]) => void;
  setSelectedTool: (tool: Tool) => void;
  updateElement: (element: Tree) => void;
}

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
          type: "rect",
          x: 0,
          y: 0,
          width: 74,
          height: 74,
        },
        {
          id: "4",
          type: "rect",
          x: 200,
          y: 200,
          width: 74,
          height: 74,
        },
      ],
    },
    selected: [],
    selectedTool: "select",
    increase: (by) => set((state) => ({ bears: state.bears + by })),
    setSelected: (selected) => set({ selected }),
    addElement: (element: Tree) =>
      set((state) => ({
        tree: { ...state.tree, chilren: [...state.tree.chilren, element] },
      })),
    deleteElements: (elementIds) => {
      set((state) => ({
        tree: {
          ...state.tree,
          chilren: state.tree.chilren?.filter(
            (child) => !elementIds.includes(child.id)
          ),
        },
      }));
    },
    setSelectedTool: (selectedTool) => set({ selectedTool }),
    updateElement: (element) => {
      set((state) => ({
        tree: {
          ...state.tree,
          chilren: state.tree.chilren?.map((child) =>
            child.id === element.id ? element : child
          ),
        },
      }));
    },
  }))
);

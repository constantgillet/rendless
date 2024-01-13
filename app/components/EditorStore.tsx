import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing

export type Tool = "select" | "text" | "rect";

export type ObjectType = "page" | "rect" | "text";

export type Tree = {
  id: string;
  type: ObjectType;
  children: ElementType[];
  x: number;
  y: number;
  width: number;
  height: number;
} & ElementPage;

interface Element<T extends ObjectType> {
  id: string;
  type: T;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ElementRect = Element<"rect"> & {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  borderStyle: string;
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomLeftRadius: number;
  borderBottomRightRadius: number;
};

export type ElementText = Element<"text"> & {
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
  textAlign: "left" | "center" | "right";
  lineHeight: number;
};

export type ElementPage = Element<"page"> & {
  backgroundColor: string;
};

export type ElementType = ElementText | ElementRect;

//Update element param is the same as the element type but with optional properties, only the id is required
export type UpdateElementParam = Partial<ElementType> & { id: string };

interface EditorState {
  bears: number;
  selected: string[];
  tree: Tree;
  selectedTool: Tool;
  increase: (by: number) => void;
  setSelected: (selected: string[]) => void;
  addElement: (element: ElementType) => void;
  deleteElements: (elemenentIds: string[]) => void;
  setSelectedTool: (tool: Tool) => void;
  increaseX: (elementIds: string[], by: number) => void;
  decreaseX: (elementIds: string[], by: number) => void;
  increateY: (elementIds: string[], by: number) => void;
  decreaseY: (elementIds: string[], by: number) => void;
  updateElement: (element: UpdateElementParam) => void;
}

export const useEditorStore = create<EditorState>()(
  devtools((set) => ({
    bears: 0,
    tree: {
      id: "1",
      type: "page",
      width: 1200,
      height: 630,
      backgroundColor: "#d1d5db",
      x: 0,
      y: 0,
      children: [
        {
          id: "qzdqzdqzd",
          type: "rect",
          x: 100,
          y: 100,
          width: 74,
          height: 74,
          backgroundColor: "#1bc529",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderWidth: 0,
          borderColor: "red",
          borderStyle: "solid",
        },
        {
          id: "2vvvvv",
          type: "rect",
          x: 300,
          y: 100,
          width: 120,
          height: 60,
          backgroundColor: "#d42f2f",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderWidth: 0,
          borderColor: "red",
          borderStyle: "solid",
        },
      ],
    },
    selected: [],
    selectedTool: "select",
    increase: (by) => set((state) => ({ bears: state.bears + by })),
    setSelected: (selected) => set({ selected }),
    addElement: (element: ElementType) =>
      set((state) => ({
        tree: { ...state.tree, children: [...state.tree.children, element] },
      })),
    deleteElements: (elementIds) => {
      set((state) => ({
        tree: {
          ...state.tree,
          children: state.tree.children?.filter(
            (child) => !elementIds.includes(child.id)
          ),
        },
      }));
    },
    updateElement: (element) => {
      //Todo in the future make a recursive function to update the element and its children

      set((state) => {
        if (state.tree.id === element.id) {
          return {
            tree: {
              ...state.tree,
              ...element,
            },
          };
        }

        return {
          tree: {
            ...state.tree,
            children: state.tree.children?.map((child) =>
              child.id === element.id ? { ...child, ...element } : child
            ),
          },
        };
      });
    },
    // updateElement: (element) => {
    //   set((state) => ({
    //     tree: {
    //       ...state.tree,
    //       children: state.tree.children?.map((child) =>
    //         child.id === element.id ? { ...child, ...element } : child
    //       ),
    //     },
    //   }));
    // },
    setSelectedTool: (selectedTool) => set({ selectedTool }),
    increaseX: (elementIds, by) => {
      set((state) => ({
        tree: {
          ...state.tree,
          children: state.tree.children?.map((child) =>
            elementIds.includes(child.id)
              ? { ...child, x: child.x + by }
              : child
          ),
        },
      }));
    },
    decreaseX: (elementIds, by) => {
      set((state) => ({
        tree: {
          ...state.tree,
          children: state.tree.children?.map((child) =>
            elementIds.includes(child.id)
              ? { ...child, x: child.x - by }
              : child
          ),
        },
      }));
    },
    increateY: (elementIds, by) => {
      set((state) => ({
        tree: {
          ...state.tree,
          children: state.tree.children?.map((child) =>
            elementIds.includes(child.id)
              ? { ...child, y: child.y + by }
              : child
          ),
        },
      }));
    },
    decreaseY: (elementIds, by) => {
      set((state) => ({
        tree: {
          ...state.tree,
          children: state.tree.children?.map((child) =>
            elementIds.includes(child.id)
              ? { ...child, y: child.y - by }
              : child
          ),
        },
      }));
    },
  }))
);

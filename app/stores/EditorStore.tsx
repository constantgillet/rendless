import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { v4 as uuidv4 } from "uuid";

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
  fontWeight: number;
  fontStyle: "normal" | "italic";
  textAlign: "left" | "center" | "right";
  lineHeight: number;
};

export type ElementPage = Element<"page"> & {
  backgroundColor: string;
};

export type ElementType = ElementText | ElementRect;

//Update element param is the same as the element type but with optional properties, only the id is required
export type UpdateElementParam = Partial<ElementType> & { id: string };

type HistoryState = {
  id: string;
  value: Tree;
  createdAt: string;
};

interface EditorState {
  selected: string[];
  tree: Tree;
  selectedTool: Tool;
  setSelected: (selected: string[]) => void;
  addElement: (element: ElementType) => void;
  deleteElements: (elemenentIds: string[]) => void;
  setSelectedTool: (tool: Tool) => void;
  updateElement: (element: UpdateElementParam) => void;
  updateElements: (
    elements: UpdateElementParam[],
    saveToHistory?: boolean
  ) => void;
  history: HistoryState[];
  currentHistoryId: string | null;
  undo: () => void;
  redo: () => void;
  moveElements: (
    elementIds: string[],
    orientation: "top" | "right" | "bottom" | "left",
    value: number
  ) => void;
}

const defaultTree: Tree = {
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
};

export const useEditorStore = create<EditorState>()(
  // @ts-ignore
  devtools((set) => ({
    tree: defaultTree,
    selected: [],
    selectedTool: "select",
    setSelected: (selected) => set({ selected }),
    addElement: (element: ElementType) =>
      set((state) => {
        const newTree = {
          ...state.tree,
          children: [...state.tree.children, element],
        };

        const history = [...state.history];

        //If we are not at the last history, we remove all the history after the current one
        if (state.currentHistoryId !== null) {
          const currentHistoryIndex = history.findIndex(
            (history) => history.id === state.currentHistoryId
          );

          history.splice(currentHistoryIndex + 1);
        }

        //We add the new history item
        history.push({
          id: uuidv4(),
          value: newTree,
          createdAt: new Date().toISOString(),
        });

        return {
          currentHistoryId: null,
          tree: newTree,
          history: history,
        };
      }),
    deleteElements: (elementIds) => {
      set((state) => {
        const history = [...state.history];

        //If we are not at the last history, we remove all the history after the current one
        if (state.currentHistoryId !== null) {
          const currentHistoryIndex = history.findIndex(
            (history) => history.id === state.currentHistoryId
          );

          history.splice(currentHistoryIndex + 1);
        }

        const newTree = {
          ...state.tree,
          children: state.tree.children?.filter(
            (child) => !elementIds.includes(child.id)
          ),
        };

        //We add the new history item
        history.push({
          id: uuidv4(),
          value: newTree,
          createdAt: new Date().toISOString(),
        });

        return {
          tree: newTree,
          history: history,
          currentHistoryId: null,
          selected: [],
        };
      });
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
    updateElements: (elements, saveToHistory = false) => {
      set((state) => {
        const newTree: Tree = {
          ...state.tree,
          children: state.tree.children?.map((child) => {
            const element = elements.find((element) => element.id === child.id);

            if (element) {
              return {
                ...child,
                ...element,
              };
            }

            return child;
          }),
        };

        if (!saveToHistory) {
          return {
            tree: newTree,
          };
        }

        const history = [...state.history];

        //If we are not at the last history, we remove all the history after the current one
        if (state.currentHistoryId !== null) {
          const currentHistoryIndex = history.findIndex(
            (history) => history.id === state.currentHistoryId
          );

          history.splice(currentHistoryIndex + 1);
        }

        //We add the new history item
        history.push({
          id: uuidv4(),
          value: newTree,
          createdAt: new Date().toISOString(),
        });

        return {
          tree: newTree,
          history: history,
          currentHistoryId: null,
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
    history: [
      {
        id: uuidv4(),
        value: defaultTree,
        createdAt: new Date().toISOString(),
      },
    ],
    currentHistoryId: null,
    undo: () => {
      set((state) => {
        const history = [...state.history];

        const currentHistoryIndex = history.findIndex(
          (history) => history.id === state.currentHistoryId
        );

        //If we are at the last history, we undo to the last one (the one before the last one)
        if (currentHistoryIndex === -1) {
          return {
            currentHistoryId: history[history.length - 2].id,
            tree: history[history.length - 2].value,
          };
        }

        return {
          currentHistoryId: history[currentHistoryIndex - 1].id,
          tree: history[currentHistoryIndex - 1].value,
        };
      });
    },
    redo: () => {
      set((state) => {
        const history = [...state.history];

        //If we are at the last history
        if (
          state.currentHistoryId === history[history.length - 1].id ||
          state.currentHistoryId === null
        ) {
          return {};
        }

        const currentHistoryIndex = history.findIndex(
          (history) => history.id === state.currentHistoryId
        );

        return {
          currentHistoryId: history[currentHistoryIndex + 1].id,
          tree: history[currentHistoryIndex + 1].value,
        };
      });
    },
    moveElements: (elementIds, orientation, value) => {
      set((state) => {
        const newTree: Tree = {
          ...state.tree,
          children: state.tree.children?.map((child) => {
            if (elementIds.includes(child.id)) {
              switch (orientation) {
                case "top":
                  return {
                    ...child,
                    y: child.y - value,
                  };
                case "right":
                  return {
                    ...child,
                    x: child.x + value,
                  };
                case "bottom":
                  return {
                    ...child,
                    y: child.y + value,
                  };
                case "left":
                  return {
                    ...child,
                    x: child.x - value,
                  };
              }
            }

            return child;
          }),
        };

        const history = [...state.history];

        //If we are not at the last history, we remove all the history after the current one
        if (state.currentHistoryId !== null) {
          const currentHistoryIndex = history.findIndex(
            (history) => history.id === state.currentHistoryId
          );

          history.splice(currentHistoryIndex + 1);
        }

        //We add the new history item
        history.push({
          id: uuidv4(),
          value: newTree,
          createdAt: new Date().toISOString(),
        });

        return {
          tree: newTree,
          history: history,
        };
      });
    },
  }))
);

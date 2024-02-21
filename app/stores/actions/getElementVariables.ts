import { useEditorStore } from "../EditorStore";

export const getElementVariables = (elementId: string) => {
  const tree = useEditorStore.getState().tree;

  const element = tree.children.find((child) => child.id === elementId);

  if (!element) {
    return [];
  }

  return element.variables || [];
};

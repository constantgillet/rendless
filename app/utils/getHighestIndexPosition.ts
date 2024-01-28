import { useEditorStore } from "~/stores/EditorStore";

/**
 * This function returns the highest index position of the tree's children.
 * @returns The highest index position of the tree's children.
 */
export const getHighestIndexPosition = () => {
  const tree = useEditorStore.getState().tree;
  return tree.children.length - 1;
};

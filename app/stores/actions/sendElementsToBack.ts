import { useEditorStore } from "../EditorStore";

/**
 * This function sends the selected elements to the back of the tree.
 * @returns void (no return)
 * @example
 * sendElementsToBack();
 * // The selected elements are sent to the back of the tree.
 **/
export const sendElementsToBack = () => {
  const moveIndexPosition = useEditorStore.getState().moveIndexPosition;
  const selectedItems = useEditorStore.getState().selected;
  const newPosition = 0;
  moveIndexPosition(selectedItems, newPosition);
};

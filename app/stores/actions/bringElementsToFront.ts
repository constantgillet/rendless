import { getHighestIndexPosition } from "~/utils/getHighestIndexPosition";
import { useEditorStore } from "../EditorStore";

export const bringElementsToFront = () => {
  const moveIndexPosition = useEditorStore.getState().moveIndexPosition;
  const selectedItems = useEditorStore.getState().selected;

  const highestIndexPosition = getHighestIndexPosition();
  const newPosition = highestIndexPosition + 1;
  moveIndexPosition(selectedItems, newPosition);
};

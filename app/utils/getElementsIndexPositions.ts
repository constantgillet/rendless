import { useEditorStore } from "~/stores/EditorStore";

export const getElementsIndexPositions = (elementIds: string[]) => {
  const tree = useEditorStore.getState().tree;

  const indexPositions: Array<{ id: string; position: number }> = [];

  tree.children.forEach((child, index) => {
    if (elementIds.includes(child.id)) {
      indexPositions.push({ id: child.id, position: index });
    }
  });

  return indexPositions;
};

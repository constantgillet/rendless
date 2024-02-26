import { Tree, useEditorStore } from "../EditorStore";

const duplicateElements = () => {
  const selectedItems = useEditorStore.getState().selected;
  const setTree = useEditorStore.getState().setTree;
  const tree = useEditorStore.getState().tree;

  const getElementsFromTree = (tree, ids) => {
    const elements: Array<Tree> = [];
    const findElements = (node) => {
      if (ids.includes(node.id)) {
        elements.push(node);
      }
      if (node.children) {
        node.children.forEach((child) => {
          findElements(child);
        });
      }
    };
    findElements(tree);
    return elements;
  };

  const newElements = getElementsFromTree(tree, selectedItems);
};

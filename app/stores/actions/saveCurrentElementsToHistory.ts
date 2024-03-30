import { useEditorStore } from "../EditorStore";
import { v4 as uuidv4 } from "uuid";

export const saveCurrentElementsToHistory = async () => {
  const tree = useEditorStore.getState().tree;
  const history = useEditorStore.getState().history;
  const currentHistoryId = useEditorStore.getState().currentHistoryId;

  const newHistory = [...history];

  //If we are not at the last history, we remove all the history after the current one
  if (currentHistoryId !== null) {
    const currentHistoryIndex = newHistory.findIndex(
      (history) => history.id === currentHistoryId
    );

    newHistory.splice(currentHistoryIndex + 1);
  }

  //We add the new history item
  newHistory.push({
    id: uuidv4(),
    value: tree,
    createdAt: new Date().toISOString(),
  });

  useEditorStore.setState({
    history: newHistory,
    currentHistoryId: null,
  });
};

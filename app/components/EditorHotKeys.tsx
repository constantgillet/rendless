import { useHotkeys } from "react-hotkeys-hook";
import { useEditorStore } from "./EditorStore";

export const EditorHotKeys = () => {
  const selectedTargets = useEditorStore((state) => state.selected);
  const deleteElements = useEditorStore((state) => state.deleteElements);
  const setSelectedTarget = useEditorStore((state) => state.setSelected);

  //Delete
  useHotkeys(
    ["delete", "backspace"],
    () => {
      deleteElements(selectedTargets);
      setSelectedTarget([]);
    },
    {
      enabled: selectedTargets.length > 0,
    }
  );

  return <></>;
};

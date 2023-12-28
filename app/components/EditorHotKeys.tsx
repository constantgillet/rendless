import { useHotkeys } from "react-hotkeys-hook";
import { useEditorStore } from "./EditorStore";
import { useEffect } from "react";
import { useScaleStore } from "./ScaleStore";

export const EditorHotKeys = () => {
  const selectedTargets = useEditorStore((state) => state.selected);
  const deleteElements = useEditorStore((state) => state.deleteElements);
  const setSelectedTarget = useEditorStore((state) => state.setSelected);
  const scale = useScaleStore((state) => state.scale);
  const increaseScale = useScaleStore((state) => state.increase);
  const decreaseScale = useScaleStore((state) => state.decrease);
  console.log(scale);

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

  //Zoom
  useEffect(() => {
    window.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }

        //Zoom in
        if (e.ctrlKey && e.deltaY < 0) {
          increaseScale(0.02);
        }

        //Zoom out
        if (e.ctrlKey && e.deltaY > 0) {
          decreaseScale(0.02);
        }
      },
      {
        passive: false,
      }
    );

    return () => {
      window.removeEventListener("wheel", () => {});
    };
  }, []);

  return <></>;
};

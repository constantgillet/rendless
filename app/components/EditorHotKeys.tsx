import { useHotkeys } from "react-hotkeys-hook";
import { useEditorStore } from "./EditorStore";
import { useEffect, useState } from "react";

export const EditorHotKeys = () => {
  const selectedTargets = useEditorStore((state) => state.selected);
  const deleteElements = useEditorStore((state) => state.deleteElements);
  const setSelectedTarget = useEditorStore((state) => state.setSelected);
  const setSelectedTool = useEditorStore((state) => state.setSelectedTool);
  const increaseX = useEditorStore((state) => state.increaseX);
  const decreaseX = useEditorStore((state) => state.decreaseX);
  const increaseY = useEditorStore((state) => state.increateY);
  const decreaseY = useEditorStore((state) => state.decreaseY);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);

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
    const onWeel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", onWeel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", onWeel);
    };
  }, []);

  //Select text tool
  useHotkeys("t", () => {
    setSelectedTool("text");
  });

  //Select select tool
  useHotkeys("v", () => {
    setSelectedTool("select");
  });

  //Select rectangle tool
  useHotkeys("r", () => {
    setSelectedTool("rect");
  });

  //Up
  useHotkeys(
    ["up", "Shift+up"],
    (e) => {
      e.preventDefault();

      if (e.shiftKey) {
        decreaseY(selectedTargets, 10);
      } else {
        decreaseY(selectedTargets, 1);
      }
    },
    {
      enabled: selectedTargets.length > 0,
    }
  );

  //Down
  useHotkeys(
    ["down", "Shift+down"],
    (e) => {
      e.preventDefault();

      if (e.shiftKey) {
        increaseY(selectedTargets, 10);
      } else {
        increaseY(selectedTargets, 1);
      }
    },
    {
      enabled: selectedTargets.length > 0,
    }
  );

  //Left
  useHotkeys(
    ["left", "Shift+left"],
    (e) => {
      e.preventDefault();

      if (e.shiftKey) {
        decreaseX(selectedTargets, 10);
      } else {
        decreaseX(selectedTargets, 1);
      }
    },
    {
      enabled: selectedTargets.length > 0,
    }
  );

  //Right
  useHotkeys(
    ["right", "Shift+right"],
    (e) => {
      e.preventDefault();

      if (e.shiftKey) {
        increaseX(selectedTargets, 10);
      } else {
        increaseX(selectedTargets, 1);
      }
    },
    {
      enabled: selectedTargets.length > 0,
    }
  );

  //Undo
  useHotkeys("mod+z", (e) => {
    e.preventDefault();

    undo();
  });

  //Redo
  useHotkeys("mod+shift+z", (e) => {
    e.preventDefault();

    redo();
  });

  return <></>;
};

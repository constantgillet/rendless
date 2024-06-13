import { useHotkeys } from "react-hotkeys-hook";
import { useEditorStore } from "../stores/EditorStore";
import { useEffect, useState } from "react";
import { useKeepRatioStore } from "~/stores/KeepRatioStore";
import { bringElementsToFront } from "~/stores/actions/bringElementsToFront";
import { sendElementsToBack } from "~/stores/actions/sendElementsToBack";
import toast from "react-hot-toast";

export const EditorHotKeys = () => {
  const selectedTargets = useEditorStore((state) => state.selected);
  const deleteElements = useEditorStore((state) => state.deleteElements);
  const setSelectedTarget = useEditorStore((state) => state.setSelected);
  const setSelectedTool = useEditorStore((state) => state.setSelectedTool);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const setKeepRatio = useKeepRatioStore((state) => state.setKeepRatio);
  const moveElements = useEditorStore((state) => state.moveElements);

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

  //Select image tool
  useHotkeys("i", () => {
    setSelectedTool("image");
  });

  //Up
  useHotkeys(
    ["up", "Shift+up"],
    (e) => {
      e.preventDefault();

      if (e.shiftKey) {
        moveElements(selectedTargets, "top", 10);
      } else {
        moveElements(selectedTargets, "top", 1);
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
        moveElements(selectedTargets, "bottom", 10);
      } else {
        moveElements(selectedTargets, "bottom", 1);
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
        moveElements(selectedTargets, "left", 10);
      } else {
        moveElements(selectedTargets, "left", 1);
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
        moveElements(selectedTargets, "right", 10);
      } else {
        moveElements(selectedTargets, "right", 1);
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

  //Keep ratio
  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      //If pressed shift
      if (e.shiftKey) {
        setKeepRatio(true);
      }
    };

    const onKeyup = (e: KeyboardEvent) => {
      //If released shift
      if (!e.shiftKey) {
        setKeepRatio(false);
      }
    };

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);

    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
    };
  }, []);

  //[ Bring to front
  useHotkeys(
    "]",
    (e) => {
      e.preventDefault();

      bringElementsToFront();
    },
    {
      enabled: selectedTargets.length > 0,
    }
  );

  //] Send to back
  useHotkeys(
    "[",
    (e) => {
      e.preventDefault();

      sendElementsToBack();
    },
    {
      enabled: selectedTargets.length > 0,
    }
  );

  //Save
  useHotkeys("mod+s", (e) => {
    e.preventDefault();

    toast.success("Rendless auto saves your design");
  });

  return <></>;
};

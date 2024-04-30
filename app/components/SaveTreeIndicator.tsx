import { css } from "styled-system/css";
import { Spinner } from "./Spinner";
import { useEditorStore } from "~/stores/EditorStore";
import { useDebounceValue } from "usehooks-ts";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { defaultTree } from "~/constants/defaultTree";

type SaveTreeIndicatorProps = {
  templateId: string;
  onSave?: () => void;
};

export const SaveTreeIndicator = (props: SaveTreeIndicatorProps) => {
  const { templateId, onSave } = props;

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  const tree = useEditorStore((state) => state.tree);

  const [debouncedTree, setValue] = useDebounceValue(tree, 1500);

  const saveTree = () => {
    //Prevent save of the initial default tree
    if (tree === defaultTree) return;

    setIsSaving(true);
    const formData = new FormData();

    formData.append("templateId", templateId);
    formData.append("tree", JSON.stringify(tree));

    fetch("/api/update-template", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setIsSaved(true);

        if (data.changed) {
          onSave?.();
        }

        setIsSaving(false);
      })
      .catch((error) => {
        console.error("Error saving tree", error);
        setIsSaved(false);
        setIsSaving(false);
      });
  };

  useEffect(() => {
    setIsSaved(false);
    setValue(tree);
  }, [tree]);

  useEffect(() => {
    if (debouncedTree) {
      saveTree();
    }
  }, [debouncedTree]);

  return (
    <div
      className={css({
        display: "flex",
        color: "var(--gray-a11)",
        alignItems: "center",
        gap: "1",
        fontSize: "sm",
      })}
    >
      {isSaved ? (
        <>
          <Icon name="checkmark-circle" fill="var(--green-10)" /> Saved
        </>
      ) : (
        <>
          {isSaving ? <Spinner size={12} /> : <Icon name="info" />} Changes
          unsaved
        </>
      )}
    </div>
  );
};

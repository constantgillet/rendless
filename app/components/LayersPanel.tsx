import { css } from "styled-system/css";
import { useEditorStore } from "../stores/EditorStore";
import { Button } from "@radix-ui/themes";
import { Icon } from "./Icon";
import { useState } from "react";

export const LayersPanel = () => {
  const tree = useEditorStore((state) => state.tree);
  const selectedItems = useEditorStore((state) => state.selected);
  const setSelected = useEditorStore((state) => state.setSelected);

  const [dropzoneHovered, setDropzoneHovered] = useState(false);

  //Reverse tree so that the first item is the topmost layer
  const reversedTree = [...tree.children].reverse();

  return (
    <aside
      className={css({
        w: 244,
        backgroundColor: "var(--color-panel)",
        padding: "var(--space-2)",
        borderRight: "1px solid var(--gray-a5)",
        bottom: 0,
        left: 0,
        height: "calc(100vh - 58px)",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-1)",
        })}
      >
        <Dropzone indexPosition={reversedTree.length} />
        {reversedTree?.map((child, index) => {
          const id = child.id;
          const isSelected = selectedItems.includes(id);

          return (
            <>
              <button
                key={id}
                className={css({
                  fontSize: "var(--font-size-3)",
                  lineHeight: "var(--line-height-3)",
                  letterSpacing: "var(--letter-spacing-3)",
                  padding: "6px 12px",
                  color: "var(--gray-a11)",
                  borderRadius: "var(--radius-3)",
                  gap: "var(--space-2)",
                  display: "flex",
                  _hover: {
                    backgroundColor: "var(--gray-a3)",
                    cursor: "pointer",
                  },
                  alignItems: "center",
                  _focusVisible: {
                    outline: "none",
                  },
                })}
                style={{
                  border: isSelected
                    ? "1px dashed var(--gray-8)"
                    : "1px dashed transparent",
                }}
                onClick={(e) => {
                  if (e.shiftKey) {
                    if (isSelected) {
                      setSelected(selectedItems.filter((item) => item !== id));
                    } else {
                      setSelected([...selectedItems, id]);
                    }
                  } else {
                    setSelected([id]);
                  }
                }}
              >
                <Icon name={child.type === "rect" ? "shape" : "text"} />
                Layer {child.type}
              </button>
              <Dropzone
                indexPosition={index === 0 ? 0 : reversedTree.length - index}
              />
            </>
          );
        })}
      </div>
    </aside>
  );
};

type DropzoneProps = {
  indexPosition: number;
  onMouseEnter?: (e: React.MouseEventHandler<HTMLDivElement>) => void;
  onMouseLeave?: () => void;
};

const Dropzone = (props: DropzoneProps) => {
  return (
    <div
      className={css({
        h: "32px",
        w: "full",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bg: "red",
        my: "-24px",
        position: "relative",
      })}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <div
        className={css({
          borderTop: "2px solid var(--accent-9)",
          w: "full",
        })}
      ></div>
    </div>
  );
};

import { css, cx } from "styled-system/css";
import { useEditorStore } from "../stores/EditorStore";
import { Icon, type IconName } from "./Icon";
import { useEffect, useState } from "react";

const elementTypeIconMap = {
  rect: "shape",
  text: "text",
  image: "image",
} as { [key: string]: IconName };

export const LayersPanel = () => {
  const tree = useEditorStore((state) => state.tree);
  const selectedItems = useEditorStore((state) => state.selected);
  const setSelected = useEditorStore((state) => state.setSelected);
  const moveIndexPosition = useEditorStore((state) => state.moveIndexPosition);

  const [dropzoneHovered, setDropzoneHovered] = useState<null | number>();

  //Reverse tree so that the first item is the topmost layer
  const reversedTree = [...tree.children].reverse();

  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false);
      setDropzoneHovered(null);

      if (dropzoneHovered !== null && dropzoneHovered !== undefined) {
        console.log("handleMouseUp", selectedItems, dropzoneHovered);

        moveIndexPosition(selectedItems, dropzoneHovered);
      }
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dropzoneHovered, selectedItems, moveIndexPosition]);

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
          paddingY: "var(--space-1)",
        })}
      >
        {/* <Dropzone
          indexPosition={reversedTree.length}
          hidden={!isMouseDown}
          onMouseEnter={() => {
            setDropzoneHovered(reversedTree.length);
          }}
          onMouseLeave={() => {
            setDropzoneHovered(null);
          }}
        /> */}
        {reversedTree?.map((child, index) => {
          const id = child.id;
          const isSelected = selectedItems.includes(id);

          return (
            <div
              key={id}
              className={css({
                position: "relative",
              })}
            >
              <button
                className={css({
                  fontSize: "var(--font-size-3)",
                  lineHeight: "var(--line-height-3)",
                  letterSpacing: "var(--letter-spacing-3)",
                  padding: "6px 12px",
                  color: "var(--gray-a11)",
                  borderRadius: "var(--radius-2)",
                  gap: "var(--space-2)",
                  display: "flex",
                  width: "100%",
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
                onMouseDown={(e) => {
                  setIsMouseDown(true);
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
                onMouseUp={() => {
                  setIsMouseDown(false);
                  setDropzoneHovered(null);
                }}
              >
                <Icon name={elementTypeIconMap[child.type]} />
                Layer {child.type}
              </button>
              <Dropzone
                hidden={!isMouseDown}
                indexPosition={index === 0 ? 0 : reversedTree.length - index}
                onMouseEnter={() => {
                  setDropzoneHovered(reversedTree.length - index - 1);
                }}
                onMouseLeave={() => {
                  setDropzoneHovered(null);
                }}
              />
            </div>
          );
        })}
        <div
          className={css({
            position: "relative",
            height: "18px",
          })}
        >
          <Dropzone
            hidden={!isMouseDown}
            indexPosition={0}
            onMouseEnter={() => {
              setDropzoneHovered(0);
            }}
            onMouseLeave={() => {
              setDropzoneHovered(null);
            }}
          />
        </div>
      </div>
    </aside>
  );
};

type DropzoneProps = {
  indexPosition: number;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  hidden?: boolean;
};

const Dropzone = (props: DropzoneProps) => {
  if (props.hidden) {
    return null;
  }

  return (
    <div
      className={cx(
        "group",
        css({
          position: "absolute",
          h: "calc(100%)",
          w: "full",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // bg: "red",
          opacity: 0.6,
          top: "0px",
        })
      )}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <div
        className={css({
          height: "4px",
          w: "full",
          top: "-4px",
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <div
          className={css({
            h: "2px",
            w: "full",
            _groupHover: {
              backgroundColor: "var(--accent-10)",
            },
          })}
        ></div>
      </div>
    </div>
  );
};

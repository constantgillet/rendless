import React, { HTMLProps, forwardRef } from "react";
import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { useEditorStore } from "./EditorStore";
import { useScaleStore } from "./ScaleStore";
import { TextElement } from "./TextElement";

type Props = HTMLProps<HTMLDivElement>;

export const FramePage = forwardRef<HTMLButtonElement, Props>(
  function FramePage(props, ref) {
    const tree = useEditorStore((state) => state.tree);
    const scale = useScaleStore((state) => state.scale);
    const selectedTool = useEditorStore((state) => state.selectedTool);

    const setSelectedTarget = useEditorStore((state) => state.setSelected);

    const increaseScale = useScaleStore((state) => state.increase);
    const decreaseScale = useScaleStore((state) => state.decrease);

    const onWheel = (e: WheelEvent) => {
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

      setSelectedTarget([]);
    };

    return (
      <div
        onWheel={onWheel}
        className={cx(
          css({
            flex: 1,
            padding: "42px",
            overflow: "scroll",
            maxH: "calc(100vh - 59px)",
          })
        )}
      >
        <div
          style={{
            minWidth: "100%",
            minHeight: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "fit-content",
          }}
        >
          <div
            className={cx(
              "scena-viewer",
              css({
                // aspectRatio: "1.91/1",
                backgroundColor: "gray.300",
                position: "relative",
                marginX: "auto",
              })
            )}
            style={{
              width: 1200 * scale,
              height: 630 * scale,
              cursor: selectedTool === "select" ? "auto" : "crosshair",
            }}
            ref={ref}
          >
            {tree?.chilren?.map((child) => {
              const id = child.id;

              return child.type === "text" ? (
                <TextElement key={id} {...child} />
              ) : (
                <div
                  key={id}
                  className={cx(
                    "target",
                    css({
                      position: "absolute",
                      _hover: {
                        outline: "1px solid #4af",
                        outlineOffset: "-1px",
                      },
                    })
                  )}
                  {...{
                    [DATA_SCENA_ELEMENT_ID]: id,
                  }}
                  style={{
                    transform: `translate(${child.x * scale}px, ${
                      child.y * scale
                    }px)`,
                    width: child.width * scale,
                    height: child.height * scale,
                    backgroundColor: child.backgroundColor,
                    borderTopLeftRadius: child.borderTopLeftRadius * scale,
                    borderTopRightRadius: child.borderTopRightRadius * scale,
                    borderBottomLeftRadius:
                      child.borderBottomLeftRadius * scale,
                    borderBottomRightRadius:
                      child.borderBottomRightRadius * scale,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

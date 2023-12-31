import React, { HTMLProps, forwardRef } from "react";
import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { useEditorStore } from "./EditorStore";
import { useScaleStore } from "./ScaleStore";

type Props = HTMLProps<HTMLDivElement>;

export const FramePage = forwardRef<HTMLButtonElement, Props>(
  function FramePage(props, ref) {
    const tree = useEditorStore((state) => state.tree);
    const scale = useScaleStore((state) => state.scale);
    const selectedTool = useEditorStore((state) => state.selectedTool);

    const handleClick = (event: React.MouseEventHandler<HTMLDivElement>) => {
      if (event.detail === 2) {
        console.log("double click");
      }
    };
    return (
      <div
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
                <textarea
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
                    fontSize: 18 * scale,
                    background: "transparent",
                    color: "black",
                  }}
                  onClick={handleClick}
                ></textarea>
              ) : (
                <div
                  key={id}
                  className={cx(
                    "target",
                    css({
                      backgroundColor: "red.300",
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

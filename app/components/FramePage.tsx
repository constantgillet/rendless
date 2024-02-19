import React, { HTMLProps, forwardRef, useEffect } from "react";
import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { useEditorStore } from "../stores/EditorStore";
import { useScaleStore } from "../stores/ScaleStore";
import { TextElement } from "./TextElement";
import { CanvasContextMenu } from "./CanvasContextMenu";
import InfiniteViewer from "react-infinite-viewer";

type Props = HTMLProps<HTMLDivElement> & {
  infiniteViewer: React.RefObject<InfiniteViewer>;
};

export const FramePage = forwardRef<HTMLButtonElement, Props>(
  function FramePage(props, ref) {
    const tree = useEditorStore((state) => state.tree);
    const scale = useScaleStore((state) => state.scale);
    const selectedTool = useEditorStore((state) => state.selectedTool);
    const setSelected = useEditorStore((state) => state.setSelected);

    const increaseScale = useScaleStore((state) => state.increase);
    const decreaseScale = useScaleStore((state) => state.decrease);

    const infiniteViewer = props.infiniteViewer;

    const onWheel = (e: WheelEvent) => {
      //Zoom in
      if (e.ctrlKey && e.deltaY < 0) {
        increaseScale(0.02);
      }

      //Zoom out
      if (e.ctrlKey && e.deltaY > 0) {
        decreaseScale(0.02);
      }
    };

    return (
      <div
        onWheel={onWheel}
        className={css({
          flex: 1,
        })}
      >
        <InfiniteViewer
          ref={infiniteViewer}
          // useMouseDrag={true}
          zoom={scale}
          className={cx(
            "scena-viewer",
            css({
              width: "100%",
              height: "100%",
            })
          )}
        >
          <div
            className={cx(
              "scena-viewport",
              css({
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              })
            )}
          >
            {/* <p style={{ fontSize: "100px", color: "#000" }}>text</p>
            <button>
              <p style={{ fontSize: "100px", color: "#000" }}>버튼</p>
            </button> */}
            <div
              className={cx(
                css({
                  // aspectRatio: "1.91/1",
                  backgroundColor: "gray.300",
                  position: "relative",
                  flexShrink: 0,
                  // marginX: "auto",w²
                })
              )}
              style={{
                width: 1200,
                height: 630,
                cursor: selectedTool === "select" ? "auto" : "crosshair",
                backgroundColor: tree.backgroundColor,
              }}
              ref={ref}
            >
              {tree?.children?.map((child) => {
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
                      transform: `translate(${child.x}px, ${child.y}px)`,
                      width: child.width,
                      height: child.height,
                      backgroundColor: child.backgroundColor,
                      borderTopLeftRadius: child.borderTopLeftRadius,
                      borderTopRightRadius: child.borderTopRightRadius,
                      borderBottomLeftRadius: child.borderBottomLeftRadius,
                      borderBottomRightRadius: child.borderBottomRightRadius,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </InfiniteViewer>
      </div>
    );

    return (
      <CanvasContextMenu>
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
            role="presentation"
            style={{
              minWidth: "100%",
              minHeight: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "fit-content",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelected([]);
              }
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
                backgroundColor: tree.backgroundColor,
              }}
              ref={ref}
            >
              {tree?.children?.map((child) => {
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
      </CanvasContextMenu>
    );
  }
);

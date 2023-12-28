import React, { HTMLProps, forwardRef } from "react";
import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { useEditorStore } from "./EditorStore";

type Props = HTMLProps<HTMLDivElement>;

export const FramePage = forwardRef<HTMLButtonElement, Props>(
  function FramePage(props, ref) {
    const tree = useEditorStore((state) => state.tree);

    return (
      <div
        className={cx(
          css({
            flex: 1,
            padding: "var(--space-8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })
        )}
      >
        <div
          className={cx(
            "scena-viewer",
            css({
              aspectRatio: "1.91/1",
              backgroundColor: "gray.300",
              position: "relative",
              maxWidth: "1200px",
              width: "100%",
              marginX: "auto",
            })
          )}
          ref={ref}
        >
          {tree?.chilren?.map((child) => {
            const id = child.id;
            return (
              <div
                key={id}
                contentEditable={child.type === "text"}
                className={cx(
                  "target",
                  css({
                    w: 70,
                    h: 70,
                    backgroundColor: "red.300",
                    position: "absolute",
                  })
                )}
                {...{
                  [DATA_SCENA_ELEMENT_ID]: id,
                }}
                style={{
                  left: child.x,
                  top: child.y,
                  width: child.width,
                  height: child.height,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

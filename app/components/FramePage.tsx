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
          "scena-viewer",
          css({
            w: 1200,
            h: 630,
            backgroundColor: "gray.300",
            position: "relative",
          })
        )}
        ref={ref}
      >
        {tree?.chilren?.map((child) => {
          const id = child.id;
          return (
            <div
              key={id}
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
    );
  }
);

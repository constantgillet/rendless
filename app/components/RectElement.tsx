import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { addAlphaToHex } from "~/utils/addAlphaToHex";
import type { RectElement as RectElementType } from "~/stores/elementTypes";

type ReactElementProps = RectElementType;

export const RectElement = (props: ReactElementProps) => {
  return (
    <div
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
        [DATA_SCENA_ELEMENT_ID]: props.id,
      }}
      style={{
        transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
        width: props.width,
        height: props.height,
        backgroundColor: addAlphaToHex(
          props.backgroundColor,
          props.backgroundOpacity
        ),
        borderTopLeftRadius: props.borderTopLeftRadius,
        borderTopRightRadius: props.borderTopRightRadius,
        borderBottomLeftRadius: props.borderBottomLeftRadius,
        borderBottomRightRadius: props.borderBottomRightRadius,
        outlineStyle: props.borderStyle,
        outlineWidth: props.borderWidth,
        outlineColor: props.borderColor,
        outlineOffset: props.borderOffset,
      }}
    />
  );
};

import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { ElementRect } from "../stores/EditorStore";

type ReactElementProps = ElementRect;

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
        backgroundColor: props.backgroundColor,
        borderTopLeftRadius: props.borderTopLeftRadius,
        borderTopRightRadius: props.borderTopRightRadius,
        borderBottomLeftRadius: props.borderBottomLeftRadius,
        borderBottomRightRadius: props.borderBottomRightRadius,
      }}
    />
  );
};

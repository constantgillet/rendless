import type { RectElement } from "~/stores/elementTypes";
import { addAlphaToHex } from "~/utils/addAlphaToHex";

type RectElementProps = RectElement;

export const RectElementRendered = (props: RectElementProps) => {
  return (
    <div
      style={{
        position: "absolute",
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
        boxShadow:
          props.borderColor && props.borderType && props.borderWidth
            ? `${props.borderColor} 0px 0px 0px ${props.borderWidth}px ${
                props.borderType === "inside" ? "inset" : ""
              }`
            : "none",
      }}
    />
  );
};

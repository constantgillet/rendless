import type { RectElement } from "~/stores/elementTypes";
import { addAlphaToHex } from "~/utils/addAlphaToHex";

type RectElementProps = RectElement;

export const RectElementRendered = (props: RectElementProps) => {
  //Create boxShadow string with border and shadow properties
  const shadowValue =
    props.shadowXOffset &&
    props.shadowYOffset &&
    props.shadowBlur &&
    props.shadowSpread &&
    props.shadowColor &&
    props.shadowOpacity
      ? `${props.shadowXOffset}px ${props.shadowYOffset}px ${
          props.shadowBlur
        }px ${props.shadowSpread}px ${addAlphaToHex(
          props.shadowColor,
          props.shadowOpacity || 1
        )}`
      : undefined;
  const borderValue =
    props.borderColor &&
    props.borderType &&
    props.borderWidth &&
    props.borderOpacity
      ? `0px 0px 0px ${props.borderWidth}px ${
          props.borderType === "inside" ? "inset" : ""
        } ${addAlphaToHex(props.borderColor, props.borderOpacity || 1)}`
      : undefined;

  const shadowList = [shadowValue, borderValue].filter(Boolean).join(", ");

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
        width: `${props.width}px`,
        height: `${props.height}px`,
        backgroundColor: addAlphaToHex(
          props.backgroundColor,
          props.backgroundOpacity
        ),
        borderTopLeftRadius: `${props.borderTopLeftRadius}px`,
        borderTopRightRadius: `${props.borderTopRightRadius}px`,
        borderBottomLeftRadius: `${props.borderBottomLeftRadius}px`,
        borderBottomRightRadius: `${props.borderBottomRightRadius}px`,
        boxShadow: shadowList !== "" ? shadowList : "unset",
        filter: props.blur ? `blur(${props.blur}px)` : "none",
      }}
    />
  );
};

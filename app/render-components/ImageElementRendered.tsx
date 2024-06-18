import type { ImageElement } from "~/stores/elementTypes";
import { addAlphaToHex } from "~/utils/addAlphaToHex";

type ImageElementProps = ImageElement;

export const ImageElementRendered = (props: ImageElementProps) => {
  //Create boxShadow string with border and shadow properties
  const shadowValue =
    props.shadowXOffset &&
    props.shadowYOffset &&
    props.shadowBlur &&
    props.shadowSpread &&
    props.shadowColor
      ? `${props.shadowXOffset}px ${props.shadowYOffset}px ${
          props.shadowBlur
        }px ${props.shadowSpread}px ${addAlphaToHex(
          props.shadowColor,
          props.shadowOpacity || 1
        )}`
      : undefined;
  const borderValue =
    props.borderColor && props.borderType && props.borderWidth
      ? `0px 0px 0px ${props.borderWidth}px ${
          props.borderType === "inside" ? "inset" : ""
        } ${addAlphaToHex(props.borderColor, props.borderOpacity || 1)}`
      : undefined;

  const shadowList = [shadowValue, borderValue].filter(Boolean).join(", ");

  if (!props.src) {
    // if (true) {
    return (
      <div
        style={{
          display: "flex",
          position: "absolute",
          transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
          width: `${props.width}px`,
          height: `${props.height}px`,
          borderTopLeftRadius: props.borderTopLeftRadius,
          borderTopRightRadius: props.borderTopRightRadius,
          borderBottomLeftRadius: props.borderBottomLeftRadius,
          borderBottomRightRadius: props.borderBottomRightRadius,
          boxShadow: shadowList !== "" ? shadowList : "unset",
          overflow: "hidden",
        }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="square-empty"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect fill="#c5c2c2be" x="0" y="0" width="50" height="50"></rect>
              <rect
                fill="#c5c2c2be"
                x="50"
                y="50"
                width="50"
                height="50"
              ></rect>
            </pattern>
          </defs>

          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#square-empty)"
          ></rect>
        </svg>
      </div>
    );
  }

  return (
    <img
      width={props.width}
      height={props.height}
      src={props.src}
      alt={""}
      style={{
        transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
        borderTopLeftRadius: `${props.borderTopLeftRadius}px`,
        borderTopRightRadius: `${props.borderTopRightRadius}px`,
        borderBottomLeftRadius: `${props.borderBottomLeftRadius}px`,
        borderBottomRightRadius: `${props.borderBottomRightRadius}px`,
        objectFit: props.objectFit,
        boxShadow: shadowList !== "" ? shadowList : "unset",
        filter: props.blur ? `blur(${props.blur}px)` : "none",
      }}
    />
  );
};

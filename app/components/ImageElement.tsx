import { css, cx } from "styled-system/css";
import type { ImageElement as ImageElementType } from "~/stores/elementTypes";
import { addAlphaToHex } from "~/utils/addAlphaToHex";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";

type ImageElementProps = ImageElementType;

export const ImageElement = (props: ImageElementProps) => {
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
          borderTopLeftRadius: props.borderTopLeftRadius,
          borderTopRightRadius: props.borderTopRightRadius,
          borderBottomLeftRadius: props.borderBottomLeftRadius,
          borderBottomRightRadius: props.borderBottomRightRadius,
          overflow: "hidden",
          boxShadow: shadowList !== "" ? shadowList : "unset",
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
      src={props.src}
      alt={""}
      {...{
        [DATA_SCENA_ELEMENT_ID]: props.id,
      }}
      className={css({
        position: "absolute",
        _hover: {
          outline: "1px solid #4af",
          outlineOffset: "-1px",
        },
      })}
      style={{
        transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
        width: props.width,
        height: props.height,
        borderTopLeftRadius: props.borderTopLeftRadius,
        borderTopRightRadius: props.borderTopRightRadius,
        borderBottomLeftRadius: props.borderBottomLeftRadius,
        borderBottomRightRadius: props.borderBottomRightRadius,
        objectFit: props.objectFit,
        boxShadow: shadowList !== "" ? shadowList : "unset",
        filter: props.blur ? `blur(${props.blur}px)` : "none",
      }}
    />
  );
};

import { css, cx } from "styled-system/css";
import { ElementImage } from "~/stores/EditorStore";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";

type ImageElementProps = ElementImage;

export const ImageElement = (props: ImageElementProps) => {
  if (!props.src) {
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

  return null;
};

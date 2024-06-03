import type { ElementImage } from "~/stores/EditorStore";

type ImageElementProps = ElementImage;

export const ImageElementRendered = (props: ImageElementProps) => {
  if (!props.src) {
    // if (true) {
    return (
      <div
        style={{
          position: "absolute",
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

  return (
    <img
      src={props.src}
      alt={""}
      style={{
        transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
        width: props.width,
        height: props.height,
        borderTopLeftRadius: props.borderTopLeftRadius,
        borderTopRightRadius: props.borderTopRightRadius,
        borderBottomLeftRadius: props.borderBottomLeftRadius,
        borderBottomRightRadius: props.borderBottomRightRadius,
        objectFit: props.objectFit,
      }}
    />
  );
};

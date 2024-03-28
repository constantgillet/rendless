import { ElementText } from "../stores/EditorStore";
import { addAlphaToHex } from "~/utils/addAlphaToHex";

type TextElementProps = ElementText;

export const TextElementRendered = (props: TextElementProps) => {
  return (
    <p
      style={{
        display: "flex",
        position: "absolute",
        transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
        fontFamily: props.fontFamily,
        fontWeight: props.fontWeight,
        fontSize: `${props.fontSize}px`,
        justifyContent:
          props.textAlign === "center"
            ? "center"
            : props.textAlign === "left"
            ? "flex-start"
            : "flex-end",
        width: `${props.width}px`,
        height: `${props.height}px`,
        textWrap: "wrap",
        whiteSpace: "pre-wrap",
        color: addAlphaToHex(props.color, props.textColorOpacity),
      }}
    >
      {props.content}
    </p>
  );
};

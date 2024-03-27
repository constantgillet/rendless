import { ElementText } from "../stores/EditorStore";
import { addAlphaToHex } from "~/utils/addAlphaToHex";

type TextElementProps = ElementText;

export const TextElementRendered = (props: TextElementProps) => {
  console.log("TextElementRendered", props);

  return (
    <p
      style={{
        position: "absolute",
        transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
        // fontFamily: props.fontFamily,
        // fontWeight: props.fontWeight,
        fontFamily: "Roboto",
        fontWeight: 400,
        fontSize: `${props.fontSize}px`,
        width: `${props.width}px`,
        height: `${props.height}px`,
        color: addAlphaToHex(props.color, props.textColorOpacity),
      }}
    >
      {props.content}
    </p>
  );
};

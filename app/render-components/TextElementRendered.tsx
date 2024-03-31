import { VariablesValues } from "~/utils/svgGenerate";
import { ElementText } from "../stores/EditorStore";
import { addAlphaToHex } from "~/utils/addAlphaToHex";

type TextElementProps = ElementText & {
  variablesValues: VariablesValues;
};

export const TextElementRendered = (props: TextElementProps) => {
  const contentWithVariables = props.content.replace(
    /{{(.*?)}}/g,
    (_, match) => {
      const variable = props.variablesValues.find(
        (variable) => variable.name === match
      );

      return variable ? variable.value : `{{${match}}}`;
    }
  );

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
      {contentWithVariables}
    </p>
  );
};

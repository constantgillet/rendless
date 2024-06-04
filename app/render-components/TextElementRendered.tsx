import type { VariablesValues } from "~/utils/svgGenerate";
import type { ElementText } from "../stores/EditorStore";
import { addAlphaToHex } from "~/utils/addAlphaToHex";

type TextElementProps = ElementText & {
	variablesValues: VariablesValues;
};

const setValueFromVariable = (
	value: string,
	variablesValues: VariablesValues,
) => {
	const variable = variablesValues.find((variable) => variable.name === value);

	return variable ? variable.value : value;
};

export const TextElementRendered = (props: TextElementProps) => {
	const contentWithVariables = props.content.replace(
		/{{(.*?)}}/g,
		(_, match) => {
			const variable = props.variablesValues.find(
				(variable) => variable.name === match,
			);

			return variable ? variable.value : `{{${match}}}`;
		},
	);

	console.log(props);

	return (
		<p
			style={{
				display: "flex",
				position: "absolute",
				transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
				fontFamily: props.fontFamily,
				fontWeight: props.fontWeight,
				fontSize: `${props.fontSize}px`,
				textTransform: props.textTransform,
				textAlign: props.textAlign,
				width: `${props.width}px`,
				height: `${props.height}px`,
				color: addAlphaToHex(props.color, props.textColorOpacity),
				overflowWrap: "break-word",
				whiteSpace: "pre-wrap",
				backgroundColor: "rgba(255, 255, 255, 0.4)",
				wordBreak: "break-word",
			}}
		>
			{contentWithVariables}
		</p>
	);
};

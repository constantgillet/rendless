import type { ElementWithVariables } from "~/stores/elementTypes";
import type { VariablesValues } from "./svgGenerate";

//**
// Add variables values to element properties
// @param elementProperties - element properties
// @param variablesValues - variables values
// @returns element properties with variables values
//**
export const addVariablesValuesToElementProperties = (
	elementProperties: ElementWithVariables,
	variablesValues: VariablesValues,
) => {
	const properties = { ...elementProperties };

	//add variables of content
	if (elementProperties.type === "text" && properties?.content) {
		properties.content = properties.content.replace(
			/{{(.*?)}}/g,
			(_, match) => {
				const variable = variablesValues.find(
					(variable) => variable.name === match,
				);

				return variable ? variable.value : `{{${match}}}`;
			},
		);
	}

	for (const variable of properties.variables) {
		const variableValue = variablesValues.find(
			(variableValue) => variableValue.name === variable.name,
		);

		if (variableValue) {
			properties[variable.property] = variableValue.value;
		}
	}

	return properties;
};

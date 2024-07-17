import { Box, Grid } from "@radix-ui/themes";
import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { Icon } from "./Icon";
import { type ChangeEvent, useEffect, useState } from "react";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEditorStore } from "../stores/EditorStore";
import { getVarFromString } from "~/utils/getVarFromString";
import { getElementVariables } from "~/stores/actions/getElementVariables";
import { PropertyTextField } from "./PropertyTextField";
import { getVariablesWithoutProperty } from "~/utils/getVariablesWithoutProperty";
import { propertiesHaveValues } from "~/utils/propertiesHaveValues";

type BlurPropertiesProps = {
	properties: {
		blur: ValueType[];
	};
};

export const BlurProperties = (props: BlurPropertiesProps) => {
	const updateElements = useEditorStore((state) => state.updateElements);
	const hasValues = propertiesHaveValues(props.properties.blur);

	const setDefaultValueFromProps = (
		property: keyof BlurPropertiesProps["properties"],
	) => {
		return arePropertiesTheSame(props.properties[property]) &&
			!props.properties[property][0].variable
			? props.properties[property][0].value
			: arePropertiesTheSame(props.properties[property])
				? `{{${props.properties[property][0].variableName}}}`
				: "Mixed";
	};

	const [blurValue, setBlurValue] = useState(setDefaultValueFromProps("blur"));

	useEffect(() => {
		setBlurValue(setDefaultValueFromProps("blur"));
	}, [props.properties.blur]);

	const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			applyPropertyBlur(e as unknown as ChangeEvent<HTMLInputElement>);
		}
	};

	const applyPropertyBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;

		const variableName = getVarFromString(newValue);

		if (variableName && variableName.length > 0) {
			updateElements(
				props.properties.blur.map((property) => {
					const currentVariables = getElementVariables(property.nodeId);

					//Create new vaiables with the new variable if it doesn't exist
					const newVariablesWithoutProperty = currentVariables.filter(
						(variable) => variable.property !== property.propertyName,
					);

					const newVariables = [
						...newVariablesWithoutProperty,
						{
							property: property.propertyName,
							name: variableName,
						},
					];

					return {
						id: property.nodeId,
						variables: newVariables,
					};
				}),
				true,
			);

			return;
		}

		if (Number.isNaN(Number(newValue))) {
			return;
		}

		const value = Number(newValue);

		updateElements(
			props.properties.blur.map((property) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					property.propertyName,
					property.nodeId,
				);

				return {
					id: property.nodeId,
					blur: value,
					variables: newVariablesWithoutProperty,
				};
			}),
			true,
		);

		event.target.blur();
	};

	const addDefault = () => {
		updateElements(
			props.properties.blur.map((property) => {
				return {
					id: property.nodeId,
					blur: 8,
				};
			}),
			true,
		);
	};

	const removeDefault = () => {
		updateElements(
			props.properties.blur.map((property) => {
				return {
					id: property.nodeId,
					blur: null,
				};
			}),
			true,
		);
	};

	return (
		<PanelGroup
			title="Blur"
			isOptional
			handleClickAdd={addDefault}
			handleClickRemove={removeDefault}
			hasValues={hasValues}
		>
			{hasValues ? (
				<>
					<Grid columns="2" gap="2" width="auto">
						<Box>
							<PropertyTextField
								icon={<Icon name="blur" />}
								placeholder="Blur"
								hasVariable={props.properties.blur[0].variable || false}
								value={blurValue}
								onChange={(e) => setBlurValue(e.target.value)}
								onBlur={applyPropertyBlur}
								onKeyUp={onKeyUp}
							/>
						</Box>
					</Grid>
				</>
			) : null}
		</PanelGroup>
	);
};

import { Box, Flex, Grid, Popover, TextField } from "@radix-ui/themes";
import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { Icon } from "./Icon";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEditorStore } from "../stores/EditorStore";
import { getVarFromString } from "~/utils/getVarFromString";
import { getElementVariables } from "~/stores/actions/getElementVariables";
import { PropertyTextField } from "./PropertyTextField";
import { groupBySameColor } from "~/utils/groupBySameColor";
import { css } from "styled-system/css";
import * as PopoverRadix from "@radix-ui/react-popover";
import { updateElementsVariables } from "~/stores/actions/updateElementsVariables";
import { getVariablesWithoutProperty } from "~/utils/getVariablesWithoutProperty";
import * as SelectPicker from "react-color";
import { grid, gridItem } from "styled-system/patterns";

type TextShadowPropertiesProps = {
	properties: {
		textShadowColor: ValueType[];
		textShadowXOffset: ValueType[];
		textShadowYOffset: ValueType[];
		textShadowBlur: ValueType[];
		textShadowOpacity: ValueType[];
	};
};

//Check if properties values are different from null
const propertiesHaveValues = (properties: ValueType[]) => {
	return properties.some((property) => property.value !== null);
};
export const TextShadowProperties = (props: TextShadowPropertiesProps) => {
	const updateElements = useEditorStore((state) => state.updateElements);
	const hasValues =
		propertiesHaveValues(props.properties.textShadowXOffset) &&
		propertiesHaveValues(props.properties.textShadowYOffset) &&
		propertiesHaveValues(props.properties.textShadowColor) &&
		propertiesHaveValues(props.properties.textShadowBlur) &&
		propertiesHaveValues(props.properties.textShadowOpacity);

	const [colorValues, setColorValues] = useState(
		groupBySameColor(
			props.properties.textShadowColor,
			props.properties.textShadowOpacity,
		),
	);

	useEffect(() => {
		setColorValues(
			groupBySameColor(
				props.properties.textShadowColor,
				props.properties.textShadowOpacity,
			),
		);
	}, [props.properties.textShadowColor, props.properties.textShadowOpacity]);

	const setDefaultValueFromProps = (
		property: keyof TextShadowPropertiesProps["properties"],
	) => {
		return arePropertiesTheSame(props.properties[property]) &&
			!props.properties[property][0].variable
			? props.properties[property][0].value
			: arePropertiesTheSame(props.properties[property])
				? `{{${props.properties[property][0].variableName}}}`
				: "Mixed";
	};

	const [textShadowXOffsetValue, setTextShadowXOffset] = useState(
		setDefaultValueFromProps("textShadowXOffset"),
	);

	const [textShadowYOffsetValue, setTextShadowYOffset] = useState(
		setDefaultValueFromProps("textShadowYOffset"),
	);

	const [textShadowBlurValue, setTextShadowBlur] = useState(
		setDefaultValueFromProps("textShadowBlur"),
	);

	useEffect(() => {
		setTextShadowXOffset(setDefaultValueFromProps("textShadowXOffset"));
	}, [props.properties.textShadowXOffset]);

	useEffect(() => {
		setTextShadowYOffset(setDefaultValueFromProps("textShadowYOffset"));
	}, [props.properties.textShadowYOffset]);

	useEffect(() => {
		setTextShadowBlur(setDefaultValueFromProps("textShadowBlur"));
	}, [props.properties.textShadowBlur]);

	const applyProperty = (
		event: React.ChangeEvent<HTMLInputElement>,
		property: keyof TextShadowPropertiesProps["properties"],
	) => {
		const newValue = event.target.value;

		const variableName = getVarFromString(newValue);

		if (variableName && variableName.length > 0) {
			updateElements(
				props.properties[property].map((property) => {
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

		if (isNaN(Number(newValue))) {
			return;
		}

		const value = Number(newValue);

		updateElements(
			props.properties[property].map((property) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					property.propertyName,
					property.nodeId,
				);

				return {
					id: property.nodeId,
					[property.propertyName]: value,
					variables: newVariablesWithoutProperty,
				};
			}),
			true,
		);

		event.target.blur();
	};

	const onKeyUp = (
		e: React.KeyboardEvent<HTMLInputElement>,
		property: keyof TextShadowPropertiesProps["properties"],
	) => {
		if (e.key === "Enter") {
			applyProperty(e, property);
		}
	};

	const addDefault = () => {
		updateElements(
			props.properties.textShadowXOffset.map((property) => {
				return {
					id: property.nodeId,
					textShadowXOffset: 1,
					textShadowYOffset: 1,
					textShadowColor: "#000000",
					textShadowBlur: 1,
				};
			}),
			true,
		);
	};

	const removeDefault = () => {
		updateElements(
			props.properties.textShadowXOffset.map((property) => {
				return {
					id: property.nodeId,
					textShadowXOffset: null,
					borderType: null,
					textShadowColor: null,
				};
			}),
			true,
		);
	};

	return (
		<PanelGroup
			title="Text Shadow"
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
								icon={"x"}
								placeholder="X offset"
								hasVariable={
									props.properties.textShadowXOffset[0].variable || false
								}
								value={textShadowXOffsetValue}
								onChange={(e) => setTextShadowXOffset(e.target.value)}
								onBlur={(e) => applyProperty(e, "textShadowXOffset")}
								onKeyUp={(e) => onKeyUp(e, "textShadowXOffset")}
							/>
						</Box>
						<Box>
							<PropertyTextField
								icon={"y"}
								placeholder="Y offset"
								hasVariable={
									props.properties.textShadowXOffset[0].variable || false
								}
								value={textShadowYOffsetValue}
								onChange={(e) => setTextShadowYOffset(e.target.value)}
								onBlur={(e) => applyProperty(e, "textShadowYOffset")}
								onKeyUp={(e) => onKeyUp(e, "textShadowYOffset")}
							/>
						</Box>
					</Grid>
					<Grid columns="2" gap="2" width="auto">
						<Box>
							<PropertyTextField
								icon={<Icon name="blur" />}
								placeholder="Blur width"
								hasVariable={
									props.properties.textShadowXOffset[0].variable || false
								}
								value={textShadowBlurValue}
								onChange={(e) => setTextShadowBlur(e.target.value)}
								onBlur={(e) => applyProperty(e, "textShadowBlur")}
								onKeyUp={(e) => onKeyUp(e, "textShadowBlur")}
							/>
						</Box>
					</Grid>
					{colorValues.map((color) => (
						<ColorLine
							key={color.elementIds[0]}
							color={{
								elementIds: color.elementIds,
								value: color.value,
								colorVariable: color.colorVariable,
								opacity: color.opacity,
								opacityVariable: color.opacityVariable,
							}}
						/>
					))}
				</>
			) : null}
		</PanelGroup>
	);
};

type ColorLineProps = {
	color: {
		elementIds: string[];
		value: string;
		opacity: number;
		colorVariable?: string | undefined;
		opacityVariable?: string | undefined;
	};
};

const ColorLine = ({ color }: ColorLineProps) => {
	const updateElements = useEditorStore((state) => state.updateElements);

	const [opacity, setOpacity] = useState(
		color.opacityVariable
			? `{{${color.opacityVariable}}}`
			: `${color.opacity * 100}%`,
	);

	const [colorValue, setColorValue] = useState(
		color?.colorVariable ? `{{${color.colorVariable}}}` : color.value,
	);

	useEffect(() => {
		setColorValue(
			color?.colorVariable ? `{{${color.colorVariable}}}` : color.value,
		);
	}, [color.value, color.colorVariable]);

	const applyColor = (newColor: string, saveToHistory = false) => {
		const elementIds = color.elementIds;

		updateElements(
			elementIds.map((elementId) => ({
				id: elementId,
				textShadowColor: newColor,
			})),
			saveToHistory,
		);
	};

	const applyColorInput = (newColorValue: string) => {
		const elementIds = color.elementIds;

		const variableName = getVarFromString(newColorValue);

		if (variableName && variableName.length > 0) {
			updateElementsVariables(elementIds, "textShadowColor", variableName);
			return;
		}

		//Check if the color is hex color and valid
		if (!/^#[0-9A-F]{6}$/i.test(newColorValue)) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					"textShadowColor",
					elementId,
				);

				return {
					id: elementId,
					textShadowColor: newColorValue,
					variables: newVariablesWithoutProperty,
				};
			}),
			true,
		);
	};

	const applyOpacity = (opacity: string) => {
		const elementIds = color.elementIds;

		const variableName = getVarFromString(opacity);

		if (variableName && variableName.length > 0) {
			updateElementsVariables(elementIds, "textShadowOpacity", variableName);
			return;
		}

		const opacityValue = Number(opacity.replace("%", "")) / 100;

		if (isNaN(opacityValue) || opacityValue < 0 || opacityValue > 1) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					"textShadowOpacity",
					elementId,
				);

				return {
					id: elementId,
					textShadowOpacity: opacityValue,
					variables: newVariablesWithoutProperty,
				};
			}),
			true,
		);
	};

	return (
		<Popover.Root>
			<>
				<PopoverRadix.Anchor>
					<div className={grid({ columns: 12, gap: 2 })}>
						<div className={gridItem({ colSpan: 7 })}>
							<PropertyTextField
								icon={
									<Popover.Trigger onClick={(e) => e.stopPropagation()}>
										<button
											className={css({
												width: "24px",
												height: "20px",
												flexShrink: 0,
												_hover: {
													cursor: "pointer",
												},
												borderRadius: "3px",
											})}
											style={{
												backgroundColor: color.value,
											}}
										/>
									</Popover.Trigger>
								}
								hasVariable={color.colorVariable ? true : false}
								placeholder="color hex"
								value={colorValue}
								onChange={(e) => setColorValue(e.target.value)}
								onBlur={(e) => {
									applyColorInput(e.target.value);
								}}
								onKeyUp={(e) => {
									if (e.key === "Enter") {
										applyColorInput(e.currentTarget.value);
									}
								}}
							/>
						</div>
						<div className={gridItem({ colSpan: 5 })}>
							<PropertyTextField
								hasVariable={color.opacityVariable ? true : false}
								placeholder="Opacity"
								value={opacity}
								onChange={(e) => {
									setOpacity(e.target.value);
								}}
								onBlur={(e) => {
									applyOpacity(e.target.value);
								}}
								onKeyUp={(e) => {
									if (e.key === "Enter") {
										applyOpacity(e.currentTarget.value);
									}
								}}
							/>
						</div>
					</div>
				</PopoverRadix.Anchor>
				<Popover.Content side="left">
					<SelectPicker.SketchPicker
						disableAlpha
						styles={{
							default: {
								picker: {
									boxShadow: "none",
								},
							},
						}}
						className={css({
							background: "var(--colors-background)!important",
						})}
						color={color.value}
						onChange={(newColor) => {
							applyColor(newColor.hex);
						}}
						onChangeComplete={(newColor) => {
							applyColor(newColor.hex, true);
						}}
					/>
				</Popover.Content>
			</>
		</Popover.Root>
	);
};

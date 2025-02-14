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
import { Button, Select } from "@radix-ui/themes";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as PopoverRadix from "@radix-ui/react-popover";
import { updateElementsVariables } from "~/stores/actions/updateElementsVariables";
import { getVariablesWithoutProperty } from "~/utils/getVariablesWithoutProperty";
import * as SelectPicker from "react-color";
import { grid, gridItem } from "styled-system/patterns";
import { propertiesHaveValues } from "~/utils/propertiesHaveValues";

type ShadowPropertiesProps = {
	properties: {
		shadowXOffset: ValueType[];
		shadowYOffset: ValueType[];
		shadowBlur: ValueType[];
		shadowColor: ValueType[];
		shadowOpacity: ValueType[];
		shadowSpread: ValueType[];
	};
};

export const ShadowProperties = (props: ShadowPropertiesProps) => {
	const updateElements = useEditorStore((state) => state.updateElements);
	const hasValues =
		propertiesHaveValues(props.properties.shadowXOffset) &&
		propertiesHaveValues(props.properties.shadowYOffset) &&
		propertiesHaveValues(props.properties.shadowBlur) &&
		propertiesHaveValues(props.properties.shadowColor) &&
		propertiesHaveValues(props.properties.shadowOpacity) &&
		propertiesHaveValues(props.properties.shadowSpread);

	const [colorValues, setColorValues] = useState(
		groupBySameColor(
			props.properties.shadowColor,
			props.properties.shadowOpacity,
		),
	);

	useEffect(() => {
		setColorValues(
			groupBySameColor(
				props.properties.shadowColor,
				props.properties.shadowOpacity,
			),
		);
	}, [props.properties.shadowColor, props.properties.shadowOpacity]);

	const setDefaultValueFromProps = (
		property: keyof ShadowPropertiesProps["properties"],
	) => {
		return arePropertiesTheSame(props.properties[property]) &&
			!props.properties[property][0].variable
			? props.properties[property][0].value
			: arePropertiesTheSame(props.properties[property])
				? `{{${props.properties[property][0].variableName}}}`
				: "Mixed";
	};

	const [shadowXOffsetValue, setShadowXOffset] = useState(
		setDefaultValueFromProps("shadowXOffset"),
	);

	useEffect(() => {
		setShadowXOffset(setDefaultValueFromProps("shadowXOffset"));
	}, [props.properties.shadowXOffset]);

	const [shadowYOffsetValue, setShadowYOffset] = useState(
		setDefaultValueFromProps("shadowYOffset"),
	);

	useEffect(() => {
		setShadowYOffset(setDefaultValueFromProps("shadowYOffset"));
	}, [props.properties.shadowYOffset]);

	const [shadowBlurValue, setShadowBlur] = useState(
		setDefaultValueFromProps("shadowBlur"),
	);

	useEffect(() => {
		setShadowBlur(setDefaultValueFromProps("shadowBlur"));
	}, [props.properties.shadowBlur]);

	const [shadowSpreadValue, setShadowSpread] = useState(
		setDefaultValueFromProps("shadowSpread"),
	);

	useEffect(() => {
		setShadowSpread(setDefaultValueFromProps("shadowSpread"));
	}, [props.properties.shadowSpread]);

	const applyProperty = (
		event: React.ChangeEvent<HTMLInputElement>,
		property: keyof ShadowPropertiesProps["properties"],
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
		property: keyof ShadowPropertiesProps["properties"],
	) => {
		if (e.key === "Enter") {
			applyProperty(e, property);
		}
	};

	const addDefault = () => {
		updateElements(
			props.properties.shadowXOffset.map((property) => {
				return {
					id: property.nodeId,
					shadowXOffset: 1,
					shadowYOffset: 1,
					shadowBlur: 1,
					shadowColor: "#000000",
					shadowOpacity: 1,
					shadowSpread: 1,
				};
			}),
			true,
		);
	};

	const removeDefault = () => {
		updateElements(
			props.properties.shadowXOffset.map((property) => {
				return {
					id: property.nodeId,
					shadowXOffset: null,
					shadowYOffset: null,
					shadowBlur: null,
					shadowColor: null,
					shadowOpacity: null,
					shadowSpread: null,
				};
			}),
			true,
		);
	};

	return (
		<PanelGroup
			title="Shadow"
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
								placeholder="X Offset"
								hasVariable={
									props.properties.shadowXOffset[0].variable || false
								}
								value={shadowXOffsetValue}
								onChange={(e) => setShadowXOffset(e.target.value)}
								onBlur={(e) => applyProperty(e, "shadowXOffset")}
								onKeyUp={(e) => onKeyUp(e, "shadowXOffset")}
							/>
						</Box>
						<Box>
							<PropertyTextField
								icon={"y"}
								placeholder="y Offset"
								hasVariable={
									props.properties.shadowYOffset[0].variable || false
								}
								value={shadowYOffsetValue}
								onChange={(e) => setShadowYOffset(e.target.value)}
								onBlur={(e) => applyProperty(e, "shadowYOffset")}
								onKeyUp={(e) => onKeyUp(e, "shadowYOffset")}
							/>
						</Box>
					</Grid>
					<Grid columns="2" gap="2" width="auto">
						<Box>
							<PropertyTextField
								icon={<Icon name="blur" />}
								placeholder="Blur"
								hasVariable={props.properties.shadowBlur[0].variable || false}
								value={shadowBlurValue}
								onChange={(e) => setShadowBlur(e.target.value)}
								onBlur={(e) => applyProperty(e, "shadowBlur")}
								onKeyUp={(e) => onKeyUp(e, "shadowBlur")}
							/>
						</Box>
						<Box>
							<PropertyTextField
								icon={"spread"}
								placeholder="Spread"
								hasVariable={
									props.properties.shadowXOffset[0].variable || false
								}
								value={shadowSpreadValue}
								onChange={(e) => setShadowSpread(e.target.value)}
								onBlur={(e) => applyProperty(e, "shadowSpread")}
								onKeyUp={(e) => onKeyUp(e, "shadowSpread")}
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
				shadowColor: newColor,
			})),
			saveToHistory,
		);
	};

	const applyColorInput = (newColorValue: string) => {
		const elementIds = color.elementIds;

		const variableName = getVarFromString(newColorValue);

		if (variableName && variableName.length > 0) {
			updateElementsVariables(elementIds, "shadowColor", variableName);
			return;
		}

		//Check if the color is hex color and valid
		if (!/^#[0-9A-F]{6}$/i.test(newColorValue)) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					"shadowColor",
					elementId,
				);

				return {
					id: elementId,
					shadowColor: newColorValue,
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
			updateElementsVariables(elementIds, "shadowOpacity", variableName);
			return;
		}

		const opacityValue = Number(opacity.replace("%", "")) / 100;

		if (isNaN(opacityValue) || opacityValue < 0 || opacityValue > 1) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					"shadowOpacity",
					elementId,
				);

				return {
					id: elementId,
					shadowOpacity: opacityValue,
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

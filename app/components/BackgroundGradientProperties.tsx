import { propertiesHaveValues } from "~/utils/propertiesHaveValues";
import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { useEditorStore } from "~/stores/EditorStore";
import { Box, Button, Grid, Popover, Select } from "@radix-ui/themes";
import { PropertyTextField } from "./PropertyTextField";
import { Icon } from "./Icon";
import * as SelectPrimitive from "@radix-ui/react-select";
import { PropertyLine } from "./PropertyLine";
import { css } from "styled-system/css";
import * as SelectPicker from "react-color";
import * as PopoverRadix from "@radix-ui/react-popover";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { grid, gridItem } from "styled-system/patterns";
import { useEffect, useState } from "react";
import { getVariablesWithoutProperty } from "~/utils/getVariablesWithoutProperty";
import { getVarFromString } from "~/utils/getVarFromString";
import { updateElementsVariables } from "~/stores/actions/updateElementsVariables";

type BackgroundGradientPropertiesProps = {
	properties: {
		backgroundGradientColorFrom: ValueType[];
		backgroundGradientColorFromOpacity: ValueType[];
		backgroundGradientColorTo: ValueType[];
		backgroundGradientColorToOpacity: ValueType[];
		backgroundGradientType: ValueType[];
		backgroundGradientAngle: ValueType[];
	};
};

export const BackgroundGradientProperties = (
	props: BackgroundGradientPropertiesProps,
) => {
	const updateElements = useEditorStore((state) => state.updateElements);
	const hasValues =
		propertiesHaveValues(props.properties.backgroundGradientColorFrom) &&
		propertiesHaveValues(props.properties.backgroundGradientColorTo) &&
		propertiesHaveValues(props.properties.backgroundGradientType) &&
		propertiesHaveValues(props.properties.backgroundGradientAngle);

	const setDefaultValueFromProps = (
		property: keyof BackgroundGradientPropertiesProps["properties"],
	) => {
		return arePropertiesTheSame(props.properties[property]) &&
			!props.properties[property][0].variable
			? props.properties[property][0].value
			: arePropertiesTheSame(props.properties[property])
				? `{{${props.properties[property][0].variableName}}}`
				: "Mixed";
	};

	const

	const addDefault = () => {
		updateElements(
			props.properties.backgroundGradientColorFrom.map((property) => {
				return {
					id: property.nodeId,
					backgroundGradientColorFrom: "#000000",
					backgroundGradientColorFromOpacity: 1,
					backgroundGradientColorTo: "#ffffff",
					backgroundGradientColorToOpacity: 1,
					backgroundGradientType: "radial",
					backgroundGradientAngle: 0,
				};
			}),
			true,
		);
	};

	const remove = () => {
		updateElements(
			props.properties.backgroundGradientColorFrom.map((property) => {
				return {
					id: property.nodeId,
					backgroundGradientColorFrom: null,
					backgroundGradientColorFromOpacity: null,
					backgroundGradientColorTo: null,
					backgroundGradientColorToOpacity: null,
					backgroundGradientType: null,
					backgroundGradientAngle: null,
				};
			}),
			true,
		);
	};

	return (
		<PanelGroup
			title="Background Gradient"
			isOptional
			handleClickAdd={addDefault}
			handleClickRemove={remove}
			hasValues={hasValues}
		>
			{hasValues ? (
				<>
					<PropertyLine label="From color" direction="column">
						from
					</PropertyLine>
					<PropertyLine label="To color" direction="column">
						to
					</PropertyLine>
					<Grid columns="2" gap="2" width="auto">
						<Box>
							<Select.Root
								onValueChange={(newValue) => {
									console.log(newValue);
								}}
							>
								<SelectPrimitive.Trigger
									className={css({
										width: "100%!important",
									})}
								>
									<Button
										variant="surface"
										size={"2"}
										color="gray"
										className={css({
											width: "100%!important",
										})}
									>
										linear <Icon name="chevron-down" />
									</Button>
								</SelectPrimitive.Trigger>
								<Select.Content position="popper" align="end">
									<Select.Item value={"linear"}>Linear</Select.Item>
									<Select.Item value={"radial"}>Radial</Select.Item>
								</Select.Content>
							</Select.Root>
						</Box>
						<Box>
							<PropertyTextField
								icon={<Icon name="rotate-left" />}
								placeholder="Angle"
								hasVariable={
									props.properties.backgroundGradientAngle[0].variable || false
								}
								value={"0"}
								onChange={(e) => {}}
								onBlur={(e) => {}}
								onKeyUp={(e) => {}}
							/>
						</Box>
					</Grid>
				</>
			) : null}
		</PanelGroup>
	);
};

type ColorLineProps = {
	color: {
		isMixed: boolean;
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
				backgroundColor: newColor,
			})),
			saveToHistory,
		);
	};

	const applyColorInput = (newColorValue: string) => {
		const elementIds = color.elementIds;

		const variableName = getVarFromString(newColorValue);

		if (variableName && variableName.length > 0) {
			updateElementsVariables(elementIds, "backgroundColor", variableName);
			return;
		}

		//Check if the color is hex color and valid
		if (!/^#[0-9A-F]{6}$/i.test(newColorValue)) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					"backgroundColor",
					elementId,
				);

				return {
					id: elementId,
					backgroundColor: newColorValue,
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
			updateElementsVariables(elementIds, "backgroundOpacity", variableName);
			return;
		}

		const opacityValue = Number(opacity.replace("%", "")) / 100;

		if (isNaN(opacityValue) || opacityValue < 0 || opacityValue > 1) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					"backgroundOpacity",
					elementId,
				);

				return {
					id: elementId,
					backgroundOpacity: opacityValue,
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
									// applyColorInput(e.target.value);
								}}
								onKeyUp={(e) => {
									if (e.key == "Enter") {
										// applyColorInput(e.currentTarget.value);
									}
								}}
							/>
						</div>
						<div className={gridItem({ colSpan: 5 })}>
							<PropertyTextField
								hasVariable={!!color.opacityVariable}
								placeholder="Opacity"
								value={opacity}
								onChange={(e) => {
									// setOpacity(e.target.value);
								}}
								onBlur={(e) => {
									// applyOpacity(e.target.value);
								}}
								onKeyUp={(e) => {
									if (e.key === "Enter") {
										// applyOpacity(e.currentTarget.value);
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

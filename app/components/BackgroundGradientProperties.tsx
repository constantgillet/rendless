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
import { useEffect, useMemo, useState } from "react";
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

	const [angleValue, setAngleValue] = useState(
		setDefaultValueFromProps("backgroundGradientAngle"),
	);

	useEffect(() => {
		setAngleValue(setDefaultValueFromProps("backgroundGradientAngle"));
	}, [props.properties.backgroundGradientAngle]);

	const gradientType = useMemo(
		() =>
			arePropertiesTheSame(props.properties.backgroundGradientType)
				? props.properties.backgroundGradientType[0].value
				: "Mixed",
		[props.properties.backgroundGradientType],
	);

	const applyPropertyAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
		const elementIds = props.properties.backgroundGradientAngle.map(
			(property) => property.nodeId,
		);

		const variableName = getVarFromString(event.target.value);

		if (variableName && variableName.length > 0) {
			updateElementsVariables(
				elementIds,
				"backgroundGradientAngle",
				variableName,
			);
			return;
		}

		const angleValue = Number(event.target.value);

		if (isNaN(angleValue) || angleValue < 0 || angleValue > 360) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					"backgroundGradientAngle",
					elementId,
				);

				return {
					id: elementId,
					backgroundGradientAngle: angleValue,
					variables: newVariablesWithoutProperty,
				};
			}),
			true,
		);
	};

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
						<ColorLine
							colorPropertyName="backgroundGradientColorFrom"
							opacityPropertyName="backgroundGradientColorFromOpacity"
							properties={props.properties}
						/>
					</PropertyLine>
					<PropertyLine label="To color" direction="column">
						<ColorLine
							colorPropertyName="backgroundGradientColorTo"
							opacityPropertyName="backgroundGradientColorToOpacity"
							properties={props.properties}
						/>
					</PropertyLine>
					<Grid columns="2" gap="2" width="auto">
						<Box>
							<Select.Root
								value={gradientType}
								onValueChange={(value) => {
									if (value === "Mixed") {
										return;
									}
									updateElements(
										props.properties.backgroundGradientType.map((property) => ({
											id: property.nodeId,
											backgroundGradientType: value,
										})),
										true,
									);
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
										{gradientType} <Icon name="chevron-down" />
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
								value={angleValue}
								onChange={(e) => setAngleValue(e.target.value)}
								onBlur={(e) => applyPropertyAngle(e)}
								onKeyUp={(e) => {
									if (e.key === "Enter") {
										applyPropertyAngle(e);
									}
								}}
							/>
						</Box>
					</Grid>
				</>
			) : null}
		</PanelGroup>
	);
};

type ColorLineProps = {
	colorPropertyName:
		| "backgroundGradientColorFrom"
		| "backgroundGradientColorTo";
	opacityPropertyName:
		| "backgroundGradientColorFromOpacity"
		| "backgroundGradientColorToOpacity";
	properties: {
		[key in
			| ColorLineProps["colorPropertyName"]
			| ColorLineProps["opacityPropertyName"]]: ValueType[];
	};
};

const ColorLine = (props: ColorLineProps) => {
	const updateElements = useEditorStore((state) => state.updateElements);

	const setDefaultValueFromProps = (
		property:
			| ColorLineProps["colorPropertyName"]
			| ColorLineProps["opacityPropertyName"],
		isPercentage = false,
	) => {
		return arePropertiesTheSame(props.properties[property]) &&
			!props.properties[property][0].variable
			? isPercentage
				? `${props.properties[property][0].value * 100}%`
				: props.properties[property][0].value
			: arePropertiesTheSame(props.properties[property])
				? `{{${props.properties[property][0].variableName}}}`
				: "Mixed";
	};

	const [colorValue, setColorValue] = useState(
		setDefaultValueFromProps(props.colorPropertyName),
	);
	const [opacityValue, setOpacityValue] = useState(
		setDefaultValueFromProps(props.opacityPropertyName, true),
	);

	useEffect(() => {
		setColorValue(setDefaultValueFromProps(props.colorPropertyName));
		setOpacityValue(setDefaultValueFromProps(props.opacityPropertyName, true));
	}, [
		props.properties[props.colorPropertyName],
		props.properties[props.opacityPropertyName],
	]);

	const applyColor = (newColor: string, saveToHistory = false) => {
		const elementIds = props.properties[props.colorPropertyName].map(
			(property) => property.nodeId,
		);

		updateElements(
			elementIds.map((elementId) => ({
				id: elementId,
				[props.colorPropertyName]: newColor,
			})),
			saveToHistory,
		);
	};

	const applyColorInput = (newColorValue: string) => {
		const elementIds = props.properties[props.colorPropertyName].map(
			(property) => property.nodeId,
		);

		const variableName = getVarFromString(newColorValue);

		if (variableName && variableName.length > 0) {
			updateElementsVariables(
				elementIds,
				props.colorPropertyName,
				variableName,
			);
			return;
		}

		//Check if the color is hex color and valid
		if (!/^#[0-9A-F]{6}$/i.test(newColorValue)) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					props.colorPropertyName,
					elementId,
				);

				return {
					id: elementId,
					[props.colorPropertyName]: newColorValue,
					variables: newVariablesWithoutProperty,
				};
			}),
			true,
		);
	};

	const applyOpacity = (opacity: string) => {
		const elementIds = props.properties[props.opacityPropertyName].map(
			(property) => property.nodeId,
		);

		const variableName = getVarFromString(opacity);

		if (variableName && variableName.length > 0) {
			updateElementsVariables(
				elementIds,
				props.opacityPropertyName,
				variableName,
			);
			return;
		}

		const opacityValue = Number(opacity.replace("%", "")) / 100;

		if (isNaN(opacityValue) || opacityValue < 0 || opacityValue > 1) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					props.opacityPropertyName,
					elementId,
				);

				return {
					id: elementId,
					[props.opacityPropertyName]: opacityValue,
					variables: newVariablesWithoutProperty,
				};
			}),
			true,
		);
	};

	const isMixedColor = colorValue === "Mixed";
	const isMixedOpacity = opacityValue === "Mixed";

	return (
		<div>
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
													backgroundColor: colorValue,
												}}
											/>
										</Popover.Trigger>
									}
									hasVariable={
										isMixedColor
											? false
											: props.properties[props.colorPropertyName][0].variable ||
												false
									}
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
									hasVariable={
										isMixedOpacity
											? false
											: props.properties[props.opacityPropertyName][0]
													.variable || false
									}
									placeholder="Opacity"
									value={opacityValue}
									onChange={(e) => {
										setOpacityValue(e.target.value);
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
							color={colorValue}
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
		</div>
	);
};

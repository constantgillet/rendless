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
import { defaultElements } from "~/stores/elementTypes";

type BorderPropertiesProps = {
	properties: {
		borderColor: ValueType[];
		borderWidth: ValueType[];
		borderType: ValueType[];
	};
};

//Check if properties values are different from null
const propertiesHaveValues = (properties: ValueType[]) => {
	return properties.some((property) => property.value !== null);
};
export const BorderProperties = (props: BorderPropertiesProps) => {
	const updateElements = useEditorStore((state) => state.updateElements);
	const hasValues =
		propertiesHaveValues(props.properties.borderWidth) &&
		propertiesHaveValues(props.properties.borderType) &&
		propertiesHaveValues(props.properties.borderColor);

	const [colorValues, setColorValues] = useState(
		groupBySameColor(
			props.properties.borderColor,
			props.properties.borderColor.map((property) => property.value),
		),
	);

	useEffect(() => {
		setColorValues(
			groupBySameColor(
				props.properties.borderColor,
				props.properties.borderColor.map((property) => property.value),
			),
		);
	}, [props.properties.borderColor]);

	const setDefaultValueFromProps = (
		property: keyof BorderPropertiesProps["properties"],
	) => {
		return arePropertiesTheSame(props.properties[property]) &&
			!props.properties[property][0].variable
			? props.properties[property][0].value
			: arePropertiesTheSame(props.properties[property])
				? `{{${props.properties[property][0].variableName}}}`
				: "Mixed";
	};

	const [borderWidthValue, setBorderWidth] = useState(
		setDefaultValueFromProps("borderWidth"),
	);

	useEffect(() => {
		setBorderWidth(setDefaultValueFromProps("borderWidth"));
	}, [props.properties.borderWidth]);

	const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			applyPropertyBorderWidth(e as unknown as ChangeEvent<HTMLInputElement>);
		}
	};

	const applyPropertyBorderWidth = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const newValue = event.target.value;

		const variableName = getVarFromString(newValue);

		if (variableName && variableName.length > 0) {
			updateElements(
				props.properties.borderWidth.map((property) => {
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
			props.properties.borderWidth.map((property) => {
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

	const borderType = useMemo(
		() =>
			arePropertiesTheSame(props.properties.borderType)
				? props.properties.borderType[0].value
				: "Mixed",
		[props.properties.borderType],
	);

	const addDefault = () => {
		updateElements(
			props.properties.borderWidth.map((property) => {
				return {
					id: property.nodeId,
					borderWidth: 1,
					borderType: "inside",
					borderColor: "#000000",
				};
			}),
			true,
		);
	};

	return (
		<PanelGroup
			title="Border"
			isOptional
			handleClickAdd={addDefault}
			hasValues={hasValues}
		>
			{hasValues ? (
				<>
					<Grid columns="2" gap="2" width="auto">
						<Box>
							<PropertyTextField
								icon={<Icon name="border-outside" />}
								placeholder="Border width"
								hasVariable={props.properties.borderWidth[0].variable || false}
								value={borderWidthValue}
								onChange={(e) => setBorderWidth(e.target.value)}
								onBlur={applyPropertyBorderWidth}
								onKeyUp={onKeyUp}
							/>
						</Box>
						<Box>
							<Select.Root
								value={borderType}
								onValueChange={(value) => {
									if (value === "Mixed") {
										return;
									}
									updateElements(
										props.properties.borderType.map((property) => ({
											id: property.nodeId,
											borderType: value,
										})),
										true,
									);
								}}
							>
								<SelectPrimitive.Trigger
									className={css({
										w: "full",
									})}
								>
									<Button
										variant="surface"
										size={"2"}
										color="gray"
										className={css({
											w: "!full",
										})}
									>
										{borderType}
										<Icon name="chevron-down" />
									</Button>
								</SelectPrimitive.Trigger>
								<Select.Content align="end" position="popper">
									<Select.Item value="inside">Inside</Select.Item>
									<Select.Item value="outside">Outside</Select.Item>
								</Select.Content>
							</Select.Root>
						</Box>
					</Grid>
					{colorValues.map((color) => (
						<ColorLine
							key={color.elementIds[0]}
							color={{
								elementIds: color.elementIds,
								value: color.value,
								colorVariable: color.colorVariable,
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
		colorVariable?: string | undefined;
	};
};

const ColorLine = ({ color }: ColorLineProps) => {
	const updateElements = useEditorStore((state) => state.updateElements);

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
				borderColor: newColor,
			})),
			saveToHistory,
		);
	};

	const applyColorInput = (newColorValue: string) => {
		const elementIds = color.elementIds;

		const variableName = getVarFromString(newColorValue);

		if (variableName && variableName.length > 0) {
			updateElementsVariables(elementIds, "borderColor", variableName);
			return;
		}

		//Check if the color is hex color and valid
		if (!/^#[0-9A-F]{6}$/i.test(newColorValue)) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					"borderColor",
					elementId,
				);

				return {
					id: elementId,
					borderColor: newColorValue,
					variables: newVariablesWithoutProperty,
				};
			}),
			true,
		);
	};

	return (
		<Flex
			className={css({
				alignItems: "center",
				gap: 2,
			})}
		>
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
									hasVariable={!!color.colorVariable}
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
		</Flex>
	);
};

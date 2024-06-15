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
		propertiesHaveValues(props.properties.textShadowBlur);

	const [colorValues, setColorValues] = useState(
		groupBySameColor(
			props.properties.textShadowColor,
			props.properties.textShadowColor.map((property) => property.value),
		),
	);

	useEffect(() => {
		setColorValues(
			groupBySameColor(
				props.properties.textShadowColor,
				props.properties.textShadowColor.map((property) => property.value),
			),
		);
	}, [props.properties.textShadowColor]);

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

	const [textShadowXOffsetValue, settextShadowXOffset] = useState(
		setDefaultValueFromProps("textShadowXOffset"),
	);

	useEffect(() => {
		settextShadowXOffset(setDefaultValueFromProps("textShadowXOffset"));
	}, [props.properties.textShadowXOffset]);

	const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			applyPropertytextShadowXOffset(
				e as unknown as ChangeEvent<HTMLInputElement>,
			);
		}
	};

	const applyPropertytextShadowXOffset = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const newValue = event.target.value;

		const variableName = getVarFromString(newValue);

		if (variableName && variableName.length > 0) {
			updateElements(
				props.properties.textShadowXOffset.map((property) => {
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
			props.properties.textShadowXOffset.map((property) => {
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
								placeholder="Border width"
								hasVariable={
									props.properties.textShadowXOffset[0].variable || false
								}
								value={textShadowXOffsetValue}
								onChange={(e) => settextShadowXOffset(e.target.value)}
								onBlur={applyPropertytextShadowXOffset}
								onKeyUp={onKeyUp}
							/>
						</Box>
						<Box>
							<PropertyTextField
								icon={"y"}
								placeholder="Border width"
								hasVariable={
									props.properties.textShadowXOffset[0].variable || false
								}
								value={textShadowXOffsetValue}
								onChange={(e) => settextShadowXOffset(e.target.value)}
								onBlur={applyPropertytextShadowXOffset}
								onKeyUp={onKeyUp}
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
								value={textShadowXOffsetValue}
								onChange={(e) => settextShadowXOffset(e.target.value)}
								onBlur={applyPropertytextShadowXOffset}
								onKeyUp={onKeyUp}
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

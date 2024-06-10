import { Box, Flex, Grid, Popover, TextField } from "@radix-ui/themes";
import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { Icon } from "./Icon";
import { useEffect, useMemo, useState } from "react";
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

type BorderPropertiesProps = {
	properties: {
		outlineColor: ValueType[];
		outlineWidth: ValueType[];
		outlineOffset: ValueType[];
		outlineStyle: ValueType[];
	};
};

export const BorderProperties = (props: BorderPropertiesProps) => {
	const [colorValues, setColorValues] = useState(
		groupBySameColor(
			props.properties.outlineColor,
			props.properties.outlineColor.map((property) => property.value),
		),
	);

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

	const [outlineWidthValue, setOutlineWidth] = useState(
		setDefaultValueFromProps("outlineWidth"),
	);

	useEffect(() => {
		setOutlineWidth(setDefaultValueFromProps("outlineWidth"));
	}, [props.properties.outlineWidth]);

	const outlineStyle = useMemo(
		() =>
			arePropertiesTheSame(props.properties.outlineStyle)
				? props.properties.outlineStyle[0].value.toString()
				: "Mixed",
		[props.properties.outlineStyle],
	);

	const outlineStyleDisabled = outlineStyle === "Mixed";

	return (
		<PanelGroup title="Border">
			<Grid columns="2" gap="2" width="auto">
				<Box>
					<PropertyTextField
						icon={<Icon name="border-outside" />}
						placeholder="Border width"
						hasVariable={props.properties.outlineWidth[0].variable || false}
						value={outlineWidthValue}
						// onChange={(e) => setBorderTopLeftRadius(e.target.value)}
						// onBlur={(e) => applyProperty(e, "borderTopLeftRadius")}
						// onKeyUp={(e) => onKeyUp(e, "borderTopLeftRadius")}
					/>
				</Box>
				<Box>
					<Select.Root>
						<SelectPrimitive.Trigger
							className={css({
								w: "full",
							})}
							disabled={outlineStyleDisabled}
						>
							<Button
								variant="surface"
								size={"2"}
								color="gray"
								className={css({
									w: "!full",
								})}
							>
								<Icon name="border-bottom-double" />
								{outlineStyleDisabled ? "Mixed" : outlineStyle}
								<Icon name="chevron-down" />
							</Button>
						</SelectPrimitive.Trigger>
						<Select.Content align="end" position="popper">
							<Select.Item value="solid">Solid</Select.Item>
							<Select.Item value="dashed">Dashed</Select.Item>
							<Select.Item value="dotted">Dotted</Select.Item>
							<Select.Item value="double">Double</Select.Item>
							<Select.Item value="groove">Groove</Select.Item>
							<Select.Item value="ridge">Ridge</Select.Item>
						</Select.Content>
					</Select.Root>
				</Box>
			</Grid>
			<Grid columns="2" gap="2" width="auto">
				<Box>
					<Select.Root>
						<SelectPrimitive.Trigger
							className={css({
								w: "full",
							})}
							disabled={outlineStyleDisabled}
						>
							<Button
								variant="surface"
								size={"2"}
								color="gray"
								className={css({
									w: "!full",
								})}
							>
								Inside
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
				outlineColor: newColor,
			})),
			saveToHistory,
		);
	};

	const applyColorInput = (newColorValue: string) => {
		const elementIds = color.elementIds;

		const variableName = getVarFromString(newColorValue);

		if (variableName && variableName.length > 0) {
			updateElementsVariables(elementIds, "outlineColor", variableName);
			return;
		}

		//Check if the color is hex color and valid
		if (!/^#[0-9A-F]{6}$/i.test(newColorValue)) {
			return;
		}

		updateElements(
			elementIds.map((elementId) => {
				const newVariablesWithoutProperty = getVariablesWithoutProperty(
					"outlineColor",
					elementId,
				);

				return {
					id: elementId,
					outlineColor: newColorValue,
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

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
							backgroundGradientColorFrom={
								props.properties.backgroundGradientColorFrom
							}
							backgroundGradientColorFromOpacity={
								props.properties.backgroundGradientColorFromOpacity
							}
						/>
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
	backgroundGradientColorFrom: ValueType[];
	backgroundGradientColorFromOpacity: ValueType[];
};

const ColorLine = (props: ColorLineProps) => {
	const setDefaultValueFromProps = (property: keyof ColorLineProps) => {
		return arePropertiesTheSame(props[property]) && !props[property][0].variable
			? props[property][0].value
			: arePropertiesTheSame(props[property])
				? `{{${props[property][0].variableName}}}`
				: "Mixed";
	};

	const [colorValue, setColorValue] = useState(
		setDefaultValueFromProps("backgroundGradientColorFrom"),
	);
	const [opacityValue, setOpacityValue] = useState(
		setDefaultValueFromProps("backgroundGradientColorFromOpacity"),
	);

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
									hasVariable={false}
									placeholder="color hex"
									value={colorValue}
									onChange={(e) => setColorValue(e.target.value)}
									onBlur={(e) => {}}
									onKeyUp={(e) => {
										if (e.key === "Enter") {
										}
									}}
								/>
							</div>
							<div className={gridItem({ colSpan: 5 })}>
								<PropertyTextField
									hasVariable={false}
									placeholder="Opacity"
									value={opacityValue}
									onChange={(e) => {}}
									onBlur={(e) => {}}
									onKeyUp={(e) => {
										if (e.key == "Enter") {
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
							onChange={(newColor) => {}}
							onChangeComplete={(newColor) => {}}
						/>
					</Popover.Content>
				</>
			</Popover.Root>
		</div>
	);
};

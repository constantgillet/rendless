import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { Icon } from "./Icon";
import { css } from "styled-system/css";
import { useEditorStore } from "~/stores/EditorStore";
import { useEffect, useState, type ReactNode } from "react";
import { propertiesHaveValues } from "~/utils/propertiesHaveValues";
import { Flex, Popover } from "@radix-ui/themes";
import * as SelectPicker from "react-color";
import * as PopoverRadix from "@radix-ui/react-popover";
import { groupBySameColor } from "~/utils/groupBySameColor";
import { PropertyTextField } from "./PropertyTextField";
import { grid, gridItem } from "styled-system/patterns";
import { getVarFromString } from "~/utils/getVarFromString";
import { getVariablesWithoutProperty } from "~/utils/getVariablesWithoutProperty";
import { updateElementsVariables } from "~/stores/actions/updateElementsVariables";

type BackgroundPropertiesProps = {
	properties: {
		backgroundColor: ValueType[];
		backgroundOpacity: ValueType[];
		backgroundGradientColorFrom: ValueType[];
		backgroundGradientColorFromOpacity: ValueType[];
		backgroundGradientColorTo: ValueType[];
		backgroundGradientColorToOpacity: ValueType[];
		backgroundGradientType: ValueType[];
		backgroundGradientAngle: ValueType[];
	};
};

export const BackgroundProperties = (props: BackgroundPropertiesProps) => {
	const updateElements = useEditorStore((state) => state.updateElements);

	const hasColorValues =
		propertiesHaveValues(props.properties.backgroundColor) &&
		propertiesHaveValues(props.properties.backgroundOpacity);

	const hasGradientValues =
		propertiesHaveValues(props.properties.backgroundGradientColorFrom) &&
		propertiesHaveValues(props.properties.backgroundGradientColorFromOpacity) &&
		propertiesHaveValues(props.properties.backgroundGradientColorTo) &&
		propertiesHaveValues(props.properties.backgroundGradientColorToOpacity) &&
		propertiesHaveValues(props.properties.backgroundGradientType) &&
		propertiesHaveValues(props.properties.backgroundGradientAngle);

	const addBackgroundColor = () => {
		removeGradient();
		updateElements(
			props.properties.backgroundColor.map((property) => {
				return {
					id: property.nodeId,
					backgroundColor: "#000000",
					backgroundOpacity: 1,
				};
			}),
			true,
		);
	};

	const removeBackgroundColor = () => {
		updateElements(
			props.properties.backgroundColor.map((property) => {
				return {
					id: property.nodeId,
					backgroundColor: null,
					backgroundOpacity: null,
				};
			}),
			true,
		);
	};

	const addDefaultGadient = () => {
		removeBackgroundColor();
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
					backgroundColor: null,
					backgroundOpacity: null,
				};
			}),
			true,
		);
	};

	const removeGradient = () => {
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

	const [colorValues, setColorValues] = useState(
		groupBySameColor(
			props.properties.backgroundColor,
			props.properties.backgroundOpacity,
		),
	);

	useEffect(() => {
		setColorValues(
			groupBySameColor(
				props.properties.backgroundColor,
				props.properties.backgroundOpacity,
			),
		);
	}, [props.properties.backgroundColor, props.properties.backgroundOpacity]);

	return (
		<PanelGroup title="Background">
			<PropertySection
				title="Background Color"
				handleClickAdd={addBackgroundColor}
				handleClickRemove={removeBackgroundColor}
				hasValues={hasColorValues}
			>
				<Flex direction="column" gap={"2"}>
					{colorValues.map((color) => (
						<ColorLine key={color.elementIds[0]} color={color} />
					))}
				</Flex>
			</PropertySection>
			<PropertySection
				title="Background Gradient"
				handleClickAdd={addDefaultGadient}
				handleClickRemove={removeGradient}
				hasValues={hasGradientValues}
			>
				<div>gradiant</div>
			</PropertySection>
		</PanelGroup>
	);
};

const PropertySection = (props: {
	title: string;
	children: ReactNode;
	handleClickAdd: () => void;
	handleClickRemove: () => void;
	hasValues: boolean;
}) => {
	return (
		<div>
			<div
				className={css({
					display: "flex",
					justifyContent: "space-between",
					gap: 2,
					width: "100%",
					alignItems: "center",
					color: "var(--colors-text-muted)",
					fontSize: 14,
				})}
			>
				{props.title}
				{props.hasValues ? (
					<Icon
						name="remove"
						className={css({
							cursor: "pointer",
						})}
						onClick={props.handleClickRemove}
					/>
				) : (
					<Icon
						name="add"
						className={css({
							cursor: "pointer",
						})}
						onClick={props.handleClickAdd}
					/>
				)}
			</div>
			{props.hasValues && (
				<div
					className={css({
						display: "flex",
						flexDirection: "column",
						spaceY: "2",
						mt: "2",
					})}
				>
					{props.children}
				</div>
			)}
		</div>
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
									applyColorInput(e.target.value);
								}}
								onKeyUp={(e) => {
									if (e.key == "Enter") {
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

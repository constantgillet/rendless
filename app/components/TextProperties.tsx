import { Box, Flex, Grid, IconButton, Tooltip } from "@radix-ui/themes";
import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useEditorStore } from "../stores/EditorStore";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { Icon } from "./Icon";
import { FontPicker } from "./FontPicker";
import { FontSizePicker } from "./FontSizePicker";
import { FontVariantPicker } from "./FontVariantPicker";
import fontsContent from "../contents/fontInfo.json";
import { PropertyLine } from "./PropertyLine";
import { PropertyTextField } from "./PropertyTextField";
import { css } from "styled-system/css";
import type React from "react";
import { getVarFromString } from "~/utils/getVarFromString";
import { getElementVariables } from "~/stores/actions/getElementVariables";
import { getVariablesWithoutProperty } from "~/utils/getVariablesWithoutProperty";

type TextPropertiesProps = {
	properties: {
		fontFamily: ValueType[];
		fontSize: ValueType[];
		textAlign: ValueType[];
		fontWeight: ValueType[];
		fontStyle: ValueType[];
		textTransform: ValueType[];
		lineHeight: ValueType[];
	};
};

export const TextProperties = (props: TextPropertiesProps) => {
	const updateElements = useEditorStore((state) => state.updateElements);

	const [lineHeight, setLineHeight] = useState(
		arePropertiesTheSame(props.properties.lineHeight)
			? props.properties.lineHeight[0].value.toString()
			: "Mixed",
	);

	useEffect(() => {
		setLineHeight(
			arePropertiesTheSame(props.properties.lineHeight)
				? props.properties.lineHeight[0].value.toString()
				: "Mixed",
		);
	}, [props.properties.lineHeight]);

	const fontSizePropety = useMemo(
		() =>
			arePropertiesTheSame(props.properties.fontSize)
				? props.properties.fontSize[0].value.toString()
				: "Mixed",
		[props.properties.fontSize],
	);

	const fontWeightProperty = useMemo(
		() =>
			arePropertiesTheSame(props.properties.fontWeight)
				? props.properties.fontWeight[0].value.toString()
				: "Mixed",
		[props.properties.fontWeight],
	);

	const fontStyleProperty = useMemo(
		() =>
			arePropertiesTheSame(props.properties.fontStyle)
				? props.properties.fontStyle[0].value.toString()
				: "Mixed",
		[props.properties.fontStyle],
	);

	const fontFamilyProperty = useMemo(
		() =>
			arePropertiesTheSame(props.properties.fontFamily)
				? props.properties.fontFamily[0].value.toString()
				: "Mixed",
		[props.properties.fontFamily],
	);

	const textAlignProperty = useMemo(
		() =>
			arePropertiesTheSame(props.properties.textAlign)
				? props.properties.textAlign[0].value.toString()
				: "Mixed",
		[props.properties.textAlign],
	);

	const textTransform = useMemo(
		() =>
			arePropertiesTheSame(props.properties.textTransform)
				? props.properties.textTransform[0].value.toString()
				: "Mixed",
		[props.properties.textTransform],
	);

	const onClickTextAlign = (
		textAlign: "left" | "center" | "right" | "justify",
	) => {
		updateElements(
			props.properties.textAlign.map((property) => ({
				id: property.nodeId,
				textAlign: textAlign,
			})),
			true,
		);
	};

	const onClickTextTransform = (
		textTransform: "none" | "capitalize" | "uppercase" | "lowercase",
	) => {
		updateElements(
			props.properties.textTransform.map((property) => ({
				id: property.nodeId,
				textTransform: textTransform,
			})),
			true,
		);
	};

	const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			applyPropertyLineHeight(e as unknown as ChangeEvent<HTMLInputElement>);
		}
	};

	const applyPropertyLineHeight = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const newValue = event.target.value;

		const variableName = getVarFromString(newValue);

		if (variableName && variableName.length > 0) {
			updateElements(
				props.properties.lineHeight.map((property) => {
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
			props.properties.lineHeight.map((property) => {
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

	return (
		<PanelGroup title="Text">
			<Flex direction="column" gap="2">
				<PropertyLine label="Font">
					<FontPicker
						value={fontFamilyProperty}
						onValueChange={(value) => {
							//Check if the font has the variant we want
							const fontFound = fontsContent.find(
								(font) =>
									font.name === value &&
									font.variants.includes(
										`${
											fontStyleProperty === "normal" ? 0 : 1
										},${fontWeightProperty}`,
									),
							);

							updateElements(
								props.properties.fontFamily.map((property) => ({
									id: property.nodeId,
									fontFamily: value,
									fontWeight: fontFound ? fontWeightProperty : 400,
									fontStyle: fontFound ? fontStyleProperty : "normal",
								})),
								true,
							);
						}}
					/>
				</PropertyLine>
				<PropertyLine label="Variant">
					<FontVariantPicker
						fontFamily={fontFamilyProperty}
						fontWeightValue={fontWeightProperty}
						fontStyleValue={fontStyleProperty}
						onValuesChange={({ fontStyleValue, fontWeightValue }) => {
							updateElements(
								props.properties.fontStyle.map((property) => ({
									id: property.nodeId,
									fontWeight: fontWeightValue,
									fontStyle: fontStyleValue,
								})),
								true,
							);
						}}
					/>
				</PropertyLine>
				<PropertyLine label="Font size">
					<FontSizePicker
						value={fontSizePropety}
						onValueChange={(newVal) => {
							updateElements(
								props.properties.fontSize.map((property) => ({
									id: property.nodeId,
									[property.propertyName]: newVal,
								})),
								true,
							);
						}}
					/>
				</PropertyLine>
				<PropertyLine label="Line height">
					<PropertyTextField
						icon={<Icon name="text-line-spacing" />}
						hasVariable={props.properties.lineHeight[0].variable || false}
						placeholder="Horizontal"
						className={css({
							maxW: "72px",
						})}
						value={lineHeight}
						onChange={(e) => setLineHeight(e.target.value)}
						onKeyUp={onKeyUp}
						onBlur={applyPropertyLineHeight}
					/>
				</PropertyLine>
				<PropertyLine label="Align">
					<Flex gap="1">
						<Tooltip content={"Text align left"}>
							<IconButton
								size="1"
								variant={textAlignProperty === "left" ? "solid" : "outline"}
								onClick={() => onClickTextAlign("left")}
							>
								<Icon name="text-align-left" aria-checked />
							</IconButton>
						</Tooltip>
						<Tooltip content={"Text align center"}>
							<IconButton
								size="1"
								variant={textAlignProperty === "center" ? "solid" : "outline"}
								onClick={() => onClickTextAlign("center")}
							>
								<Icon name="text-align-center" />
							</IconButton>
						</Tooltip>
						<Tooltip content={"Text align right"}>
							<IconButton
								size="1"
								variant={textAlignProperty === "right" ? "solid" : "outline"}
								onClick={() => onClickTextAlign("right")}
							>
								<Icon name="text-align-right" />
							</IconButton>
						</Tooltip>
						<Tooltip content={"Text align right"}>
							<IconButton
								size="1"
								variant={textAlignProperty === "justify" ? "solid" : "outline"}
								onClick={() => onClickTextAlign("justify")}
							>
								<Icon name="text-align-justify" />
							</IconButton>
						</Tooltip>
					</Flex>
				</PropertyLine>
				<PropertyLine label="Text Transform">
					<Flex gap="1">
						<Tooltip content={"Default"}>
							<IconButton
								size="1"
								variant={textTransform === "none" ? "solid" : "outline"}
								onClick={() => onClickTextTransform("none")}
							>
								-
							</IconButton>
						</Tooltip>
						<Tooltip content={"Text capitalize"}>
							<IconButton
								size="1"
								variant={textTransform === "capitalize" ? "solid" : "outline"}
								onClick={() => onClickTextTransform("capitalize")}
							>
								<Icon name="text-case-title" />
							</IconButton>
						</Tooltip>
						<Tooltip content={"Text lowercase"}>
							<IconButton
								size="1"
								variant={textTransform === "lowercase" ? "solid" : "outline"}
								onClick={() => onClickTextTransform("lowercase")}
							>
								<Icon name="text-case-lowercase" />
							</IconButton>
						</Tooltip>
						<Tooltip content={"Text uppercase"}>
							<IconButton
								size="1"
								variant={textTransform === "uppercase" ? "solid" : "outline"}
								onClick={() => onClickTextTransform("uppercase")}
							>
								<Icon name="text-case-uppercase" />
							</IconButton>
						</Tooltip>
					</Flex>
				</PropertyLine>
			</Flex>
		</PanelGroup>
	);
};

import { Text, Grid, Separator as RadixSeparator } from "@radix-ui/themes";
import { css, cx } from "styled-system/css";
import { useEditorStore } from "../stores/EditorStore";
import { BackgroundColorProperties } from "./BackgroundColorProperties";
import { TextColorProperties } from "./TextColorProperties";
import { TextProperties } from "./TextProperties";
import { RadiusProperties } from "./RadiusProperties";
import { PositionAndSizeProperties } from "./PositionAndSizeProperties";
import { VariablesFoundIndicator } from "./VariablesFoundIndicator";
import { ImageItemsProperties } from "./ImageItemsProperties";
import { type Element, defaultElements } from "~/stores/elementTypes";
import { BorderProperties } from "./BorderProperties";
import { Icon } from "./Icon";

const Separator = () => {
	return (
		<RadixSeparator
			className={css({ w: "auto!important", marginY: "20px", mx: "-16px" })}
		/>
	);
};

type GroupedPropertiesType = {
	[key: string]: Array<ValueType>;
};

export type ValueType = {
	nodeId: string;
	propertyName: string;
	value: any;
	variable?: boolean;
	variableName?: string;
};

const panels = {
	text: [
		"positionAndSizeProperties",
		"backgroundColorProperties",
		"textProperties",
	],
	rect: [
		"positionAndSizeProperties",
		"backgroundColorProperties",
		"borderProperties",
		"radiusProperties",
	],
	image: [
		"positionAndSizeProperties",
		"imageItemsProperties",
		"borderProperties",
		"radiusProperties",
	],
};

/**
 * Group the properties of the selected nodes by property name
 * @param nodes
 * @returns GroupedPropertiesType
 */
const GroupProperties = (nodes: Element[]) => {
	const propertieFlatList: Array<ValueType> = [];

	for (const node of nodes) {
		//Check if node has the default properties of the type
		const defaultElement = defaultElements[node.type];

		//Add the missing properties to the node
		if (defaultElement) {
			for (const [key, value] of Object.entries(defaultElement)) {
				if (node[key] === undefined) {
					node[key] = value;
				}
			}
		}

		//Use for of loop to iterate over the object
		for (const [key, value] of Object.entries(node)) {
			//ignore if value is undefined
			if (value === undefined) {
				return;
			}

			//Check if the node has a variable
			const variable = node.variables?.find(
				(variable) => variable.property === key,
			);

			propertieFlatList.push({
				nodeId: node.id,
				propertyName: key,
				value: value,
				variable: variable ? true : false,
				variableName: variable ? variable.name : undefined,
			});
		}
	}

	//group by property by name
	const groupedProperties = propertieFlatList.reduce(
		(acc: GroupedPropertiesType, property) => {
			const propertyName = property.propertyName;

			if (!acc[propertyName]) {
				acc[propertyName] = [];
			}

			acc[propertyName].push(property);

			return acc;
		},
		{},
	);

	return groupedProperties;
};

export const PropertiesPanel = () => {
	const selected = useEditorStore((state) => state.selected);
	const tree = useEditorStore((state) => state.tree);

	const selectedNodes = tree.children.filter((node) =>
		selected.includes(node.id),
	);

	//Get the properties list of the selected node
	const properties = GroupProperties(selectedNodes);

	console.log(properties);

	return (
		<aside
			className={cx(
				css({
					w: 268,
					backgroundColor: "var(--color-panel)",
					borderColor: "var(--global-color-border, currentColor)",
					padding: "var(--space-4)",
					borderLeft: "1px solid var(--gray-a5)",
					height: "calc(100vh - 58px)",
					overflowY: "auto",
				}),
				"hidde-scrollbar",
			)}
		>
			{!properties?.x === undefined &&
				properties?.y &&
				properties?.width &&
				properties?.height &&
				properties?.rotate && (
					<>
						<PositionAndSizeProperties
							properties={{
								x: properties.x,
								y: properties.y,
								width: properties.width,
								height: properties.height,
								rotate: properties.rotate,
							}}
						/>
						<Separator />
					</>
				)}
			{properties?.backgroundColor && properties?.backgroundOpacity && (
				<>
					<BackgroundColorProperties
						properties={{
							backgroundColor: properties.backgroundColor,
							backgroundOpacity: properties.backgroundOpacity,
						}}
					/>
					<Separator />
				</>
			)}
			{properties?.src && properties?.objectFit && (
				<>
					<ImageItemsProperties
						properties={{
							src: properties.src,
							objectFit: properties.objectFit,
						}}
					/>
					<Separator />
				</>
			)}
			{properties?.color && properties?.textColorOpacity && (
				<>
					<TextColorProperties
						properties={{
							color: properties.color,
							textColorOpacity: properties.textColorOpacity,
						}}
					/>
					<Separator />
				</>
			)}
			{properties?.fontSize &&
				properties?.textAlign &&
				properties?.fontWeight &&
				properties?.fontStyle &&
				properties?.textTransform &&
				properties?.lineHeight && (
					<>
						<TextProperties
							properties={{
								fontFamily: properties.fontFamily,
								fontSize: properties.fontSize,
								textAlign: properties.textAlign,
								fontWeight: properties.fontWeight,
								fontStyle: properties.fontStyle,
								textTransform: properties.textTransform,
								lineHeight: properties.lineHeight,
							}}
						/>
						<Separator />
					</>
				)}

			{properties?.borderTopLeftRadius &&
				properties?.borderTopRightRadius &&
				properties?.borderBottomLeftRadius &&
				properties?.borderBottomRightRadius && (
					<>
						<RadiusProperties
							properties={{
								borderTopLeftRadius: properties.borderTopLeftRadius,
								borderTopRightRadius: properties.borderTopRightRadius,
								borderBottomLeftRadius: properties.borderBottomLeftRadius,
								borderBottomRightRadius: properties.borderBottomRightRadius,
							}}
						/>
						<Separator />
					</>
				)}
			{properties?.borderColor !== undefined &&
				properties?.borderWidth !== undefined &&
				properties?.borderType !== undefined && (
					<>
						<BorderProperties
							properties={{
								borderColor: properties.borderColor,
								borderWidth: properties.borderWidth,
								borderType: properties.borderType,
							}}
						/>
					</>
				)}
			{
				// If empty properties
				!Object.keys(properties).length && (
					<>
						<BackgroundColorProperties
							properties={{
								backgroundColor: [
									{
										value: tree.backgroundColor,
										nodeId: "1",
										propertyName: "backgroundColor",
									},
								],
								backgroundOpacity: [
									{
										value: 1,
										nodeId: "1",
										propertyName: "backgroundOpacity",
									},
								],
							}}
						/>
						<Separator />
						<VariablesFoundIndicator />
						<Separator />
					</>
				)
			}
		</aside>
	);
};

type PanelGroupProps = {
	title: string;
	children: React.ReactNode;
	isOptional?: boolean;
	handleClickAdd?: () => void;
	handleClickRemove?: () => void;
	hasValues?: boolean;
};

export const PanelGroup = (props: PanelGroupProps) => {
	return (
		<div
			className={css({
				display: "flex",
				flexDirection: "column",
				gap: "var(--space-3)",
				fontWeight: "medium",
			})}
		>
			<div
				className={css({
					display: "flex",
					justifyContent: "space-between",
				})}
			>
				<Text
					size="2"
					className={css({
						display: "flex",
					})}
				>
					{props.title}
				</Text>
				{props.isOptional && (
					<Icon
						name="add"
						className={css({
							cursor: "pointer",
						})}
						onClick={props.handleClickAdd}
					/>
				)}
			</div>

			<Grid columns="1" gap="2" width="auto">
				{props.children}
			</Grid>
		</div>
	);
};

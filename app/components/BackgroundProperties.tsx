import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { Icon } from "./Icon";
import { css } from "styled-system/css";
import { useEditorStore } from "~/stores/EditorStore";
import type { ReactNode } from "react";
import { propertiesHaveValues } from "~/utils/propertiesHaveValues";

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

	return (
		<PanelGroup title="Background">
			<PropertySection
				title="Background Color"
				handleClickAdd={addBackgroundColor}
				handleClickRemove={removeBackgroundColor}
				hasValues={hasColorValues}
			>
				<div>color</div>
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
	);
};

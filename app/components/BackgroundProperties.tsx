import { PanelGroup, type ValueType } from "./PropertiesPanel";

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
	return <PanelGroup title="Background">BackgroundPropperties</PanelGroup>;
};

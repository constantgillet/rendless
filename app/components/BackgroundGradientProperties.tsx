import { propertiesHaveValues } from "~/utils/propertiesHaveValues";
import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { useEditorStore } from "~/stores/EditorStore";

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

	return (
		<PanelGroup
			title="Background Gradient"
			isOptional
			handleClickAdd={() => {}}
			handleClickRemove={() => {}}
			hasValues={hasValues}
		>
			{hasValues ? <>values</> : null}
		</PanelGroup>
	);
};

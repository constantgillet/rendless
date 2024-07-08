import { propertiesHaveValues } from "~/utils/propertiesHaveValues";
import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { useEditorStore } from "~/stores/EditorStore";
import { Box, Button, Grid, Select } from "@radix-ui/themes";
import { PropertyTextField } from "./PropertyTextField";
import { Icon } from "./Icon";
import * as SelectPrimitive from "@radix-ui/react-select";
import { PropertyLine } from "./PropertyLine";
import { css } from "styled-system/css";

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
						from
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

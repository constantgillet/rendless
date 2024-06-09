import { Box, Flex, Grid, TextField } from "@radix-ui/themes";
import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { Icon } from "./Icon";
import { useEffect, useState } from "react";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEditorStore } from "../stores/EditorStore";
import { getVarFromString } from "~/utils/getVarFromString";
import { getElementVariables } from "~/stores/actions/getElementVariables";
import { PropertyTextField } from "./PropertyTextField";

type BorderPropertiesProps = {
	properties: {
		outlineColor: ValueType[];
		outlineWidth: ValueType[];
		outlineOffset: ValueType[];
		outlineStyle: ValueType[];
	};
};

export const BorderProperties = (props: BorderPropertiesProps) => {
	return (
		<PanelGroup title="Borders">
			<div>borders</div>
		</PanelGroup>
	);
};

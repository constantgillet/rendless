import { Box, Flex, Grid, TextField } from "@radix-ui/themes";
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
      props.properties.outlineColor.map((property) => property.value)
    )
  );

  const setDefaultValueFromProps = (
    property: keyof BorderPropertiesProps["properties"]
  ) => {
    return arePropertiesTheSame(props.properties[property]) &&
      !props.properties[property][0].variable
      ? props.properties[property][0].value
      : arePropertiesTheSame(props.properties[property])
      ? `{{${props.properties[property][0].variableName}}}`
      : "Mixed";
  };

  const [outlineWidthValue, setOutlineWidth] = useState(
    setDefaultValueFromProps("outlineWidth")
  );

  const outlineStyle = useMemo(
    () =>
      arePropertiesTheSame(props.properties.outlineStyle)
        ? props.properties.outlineStyle[0].value.toString()
        : "Mixed",
    [props.properties.outlineStyle]
  );

  return (
    <PanelGroup title="Border">
      <div>
        <div
          className={css({
            fontSize: 14,
          })}
        >
          color
        </div>
      </div>
    </PanelGroup>
  );
};

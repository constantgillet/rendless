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
import { Button, Select } from "@radix-ui/themes";
import * as SelectPrimitive from "@radix-ui/react-select";

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

  useEffect(() => {
    setOutlineWidth(setDefaultValueFromProps("outlineWidth"));
  }, [props.properties.outlineWidth]);

  const outlineStyle = useMemo(
    () =>
      arePropertiesTheSame(props.properties.outlineStyle)
        ? props.properties.outlineStyle[0].value.toString()
        : "Mixed",
    [props.properties.outlineStyle]
  );

  const outlineStyleDisabled = outlineStyle === "Mixed";

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
      <Grid columns="2" gap="2" width="auto">
        <Box>
          <PropertyTextField
            icon={<Icon name="border-outside" />}
            placeholder="Border width"
            hasVariable={props.properties.outlineWidth[0].variable || false}
            value={outlineWidthValue}
            // onChange={(e) => setBorderTopLeftRadius(e.target.value)}
            // onBlur={(e) => applyProperty(e, "borderTopLeftRadius")}
            // onKeyUp={(e) => onKeyUp(e, "borderTopLeftRadius")}
          />
        </Box>
        <Box>
          <Select.Root>
            <SelectPrimitive.Trigger
              className={css({
                w: "full",
              })}
              disabled={outlineStyleDisabled}
            >
              <Button
                variant="surface"
                size={"2"}
                color="gray"
                className={css({
                  w: "!full",
                })}
              >
                <Icon name="border-bottom-double" />
                {outlineStyleDisabled ? "Mixed" : outlineStyle}
                <Icon name="chevron-down" />
              </Button>
            </SelectPrimitive.Trigger>
            <Select.Content align="end" position="popper">
              <Select.Item value="solid">Solid</Select.Item>
              <Select.Item value="dashed">Dashed</Select.Item>
              <Select.Item value="dotted">Dotted</Select.Item>
              <Select.Item value="double">Double</Select.Item>
              <Select.Item value="groove">Groove</Select.Item>
              <Select.Item value="ridge">Ridge</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>
      </Grid>
    </PanelGroup>
  );
};

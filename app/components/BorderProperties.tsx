import { Box, Flex, Grid, Popover, TextField } from "@radix-ui/themes";
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
import * as PopoverRadix from "@radix-ui/react-popover";
import { updateElementsVariables } from "~/stores/actions/updateElementsVariables";
import { getVariablesWithoutProperty } from "~/utils/getVariablesWithoutProperty";
import * as SelectPicker from "react-color";
import { grid, gridItem } from "styled-system/patterns";

type BorderPropertiesProps = {
  properties: {
    borderColor: ValueType[];
    borderWidth: ValueType[];
    borderOffset: ValueType[];
  };
};

export const BorderProperties = (props: BorderPropertiesProps) => {
  const updateElements = useEditorStore((state) => state.updateElements);

  const [colorValues, setColorValues] = useState(
    groupBySameColor(
      props.properties.borderColor,
      props.properties.borderColor.map((property) => property.value)
    )
  );

  useEffect(() => {
    setColorValues(
      groupBySameColor(
        props.properties.borderColor,
        props.properties.borderColor.map((property) => property.value)
      )
    );
  }, [props.properties.borderColor]);

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

  const [borderWidthValue, setborderWidth] = useState(
    setDefaultValueFromProps("borderWidth")
  );

  useEffect(() => {
    setborderWidth(setDefaultValueFromProps("borderWidth"));
  }, [props.properties.borderWidth]);

  return (
    <PanelGroup title="Border">
      <Grid columns="2" gap="2" width="auto">
        <Box>
          <PropertyTextField
            icon={<Icon name="border-outside" />}
            placeholder="Border width"
            hasVariable={props.properties.borderWidth[0].variable || false}
            value={borderWidthValue}
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
            >
              <Button
                variant="surface"
                size={"2"}
                color="gray"
                className={css({
                  w: "!full",
                })}
              >
                Inside
                <Icon name="chevron-down" />
              </Button>
            </SelectPrimitive.Trigger>
            <Select.Content align="end" position="popper">
              <Select.Item value="inside">Inside</Select.Item>
              <Select.Item value="outside">Outside</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>
      </Grid>
      {colorValues.map((color) => (
        <ColorLine
          key={color.elementIds[0]}
          color={{
            elementIds: color.elementIds,
            value: color.value,
            colorVariable: color.colorVariable,
          }}
        />
      ))}
    </PanelGroup>
  );
};

type ColorLineProps = {
  color: {
    elementIds: string[];
    value: string;
    colorVariable?: string | undefined;
  };
};

const ColorLine = ({ color }: ColorLineProps) => {
  const updateElements = useEditorStore((state) => state.updateElements);

  const [colorValue, setColorValue] = useState(
    color?.colorVariable ? `{{${color.colorVariable}}}` : color.value
  );

  useEffect(() => {
    setColorValue(
      color?.colorVariable ? `{{${color.colorVariable}}}` : color.value
    );
  }, [color.value, color.colorVariable]);

  const applyColor = (newColor: string, saveToHistory = false) => {
    const elementIds = color.elementIds;

    updateElements(
      elementIds.map((elementId) => ({
        id: elementId,
        borderColor: newColor,
      })),
      saveToHistory
    );
  };

  const applyColorInput = (newColorValue: string) => {
    const elementIds = color.elementIds;

    const variableName = getVarFromString(newColorValue);

    if (variableName && variableName.length > 0) {
      updateElementsVariables(elementIds, "borderColor", variableName);
      return;
    }

    //Check if the color is hex color and valid
    if (!/^#[0-9A-F]{6}$/i.test(newColorValue)) {
      return;
    }

    updateElements(
      elementIds.map((elementId) => {
        const newVariablesWithoutProperty = getVariablesWithoutProperty(
          "borderColor",
          elementId
        );

        return {
          id: elementId,
          borderColor: newColorValue,
          variables: newVariablesWithoutProperty,
        };
      }),
      true
    );
  };

  return (
    <Flex
      className={css({
        alignItems: "center",
        gap: 2,
      })}
    >
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
                  hasVariable={!!color.colorVariable}
                  placeholder="color hex"
                  value={colorValue}
                  onChange={(e) => setColorValue(e.target.value)}
                  onBlur={(e) => {
                    applyColorInput(e.target.value);
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      applyColorInput(e.currentTarget.value);
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
    </Flex>
  );
};

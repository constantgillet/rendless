import {
  Box,
  Button,
  Flex,
  Grid,
  Popover,
  TextField,
  TextFieldInput,
} from "@radix-ui/themes";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { useEffect, useState } from "react";
import { useEditorStore } from "../stores/EditorStore";
import { css } from "styled-system/css";
import * as SelectPicker from "react-color";
import * as PopoverRadix from "@radix-ui/react-popover";
import { groupBySameColor } from "~/utils/groupBySameColor";
import { PropertyTextField } from "./PropertyTextField";
import { grid, gridItem } from "styled-system/patterns";
import { getVarFromString } from "~/utils/getVarFromString";
import { getElementVariables } from "~/stores/actions/getElementVariables";

type BackgroundColorPropertiesProps = {
  properties: {
    backgroundColor: ValueType[];
    backgroundOpacity: ValueType[];
  };
};

export const BackgroundColorProperties = (
  props: BackgroundColorPropertiesProps
) => {
  const updateElements = useEditorStore((state) => state.updateElements);

  const [colorValues, setColorValues] = useState(
    groupBySameColor(
      props.properties.backgroundColor,
      props.properties.backgroundOpacity
    )
  );

  useEffect(() => {
    setColorValues(
      groupBySameColor(
        props.properties.backgroundColor,
        props.properties.backgroundOpacity
      )
    );
  }, [props.properties.backgroundColor, props.properties.backgroundOpacity]);

  const applyColor = (
    color: string,
    elementIds: string[],
    saveToHistory = false
  ) => {
    updateElements(
      elementIds.map((elementId) => ({
        id: elementId,
        backgroundColor: color,
      })),
      saveToHistory
    );
  };

  const applyColorInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    property: keyof BackgroundColorPropertiesProps["properties"]
  ) => {
    const newValue = event.target.value;

    const variableName = getVarFromString(newValue);

    if (variableName && variableName.length > 0) {
      updateElements(
        props.properties[property].map((property) => {
          const currentVariables = getElementVariables(property.nodeId);

          //Create new vaiables with the new variable if it doesn't exist
          const newVariablesWithoutProperty = currentVariables.filter(
            (variable) => variable.property !== property.propertyName
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
        true
      );

      return;
    }

    updateElements(
      props.properties[property].map((property) => {
        const currentVariables = getElementVariables(property.nodeId);

        const newVariablesWithoutProperty = currentVariables.filter(
          (variable) => variable.property !== property.propertyName
        );

        return {
          id: property.nodeId,
          [property.propertyName]: newValue,
          variables: newVariablesWithoutProperty,
        };
      }),
      true
    );

    event.target.blur();
  };

  return (
    <PanelGroup
      title={
        props.properties.backgroundColor[0].nodeId === "1"
          ? "Page background color"
          : "Background color"
      }
    >
      <Flex direction="column" gap={"2"}>
        {colorValues.map((color, index) => (
          <Popover.Root key={index}>
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
                      hasVariable={color.colorVariable ? true : false}
                      placeholder="color hex"
                      value={color.value}
                      onChange={(e) => {}}
                      onBlur={(e) => {}}
                    />
                  </div>
                  <div className={gridItem({ colSpan: 5 })}>
                    <PropertyTextField
                      hasVariable={false}
                      placeholder="height"
                      value={"100%"}
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
                    applyColor(newColor.hex, color.elementIds);
                  }}
                  onChangeComplete={(newColor) => {
                    applyColor(newColor.hex, color.elementIds, true);
                  }}
                />
              </Popover.Content>
            </>
          </Popover.Root>
        ))}
      </Flex>
    </PanelGroup>
  );
};

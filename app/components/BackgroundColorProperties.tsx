import { Flex, Popover } from "@radix-ui/themes";
import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { useEffect, useState } from "react";
import { useEditorStore } from "../stores/EditorStore";
import { css } from "styled-system/css";
import * as SelectPicker from "react-color";
import * as PopoverRadix from "@radix-ui/react-popover";
import { groupBySameColor } from "~/utils/groupBySameColor";
import { PropertyTextField } from "./PropertyTextField";
import { grid, gridItem } from "styled-system/patterns";
import { getVarFromString } from "~/utils/getVarFromString";
import { getVariablesWithoutProperty } from "~/utils/getVariablesWithoutProperty";
import { updateElementsVariables } from "~/stores/actions/updateElementsVariables";

type BackgroundColorPropertiesProps = {
  properties: {
    backgroundColor: ValueType[];
    backgroundOpacity: ValueType[];
  };
};

export const BackgroundColorProperties = (
  props: BackgroundColorPropertiesProps
) => {
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

  return (
    <PanelGroup
      title={
        props.properties.backgroundColor[0].nodeId === "1"
          ? "Page background color"
          : "Background color"
      }
    >
      <Flex direction="column" gap={"2"}>
        {colorValues.map((color) => (
          <ColorLine key={color.elementIds[0]} color={color} />
        ))}
      </Flex>
    </PanelGroup>
  );
};

type ColorLineProps = {
  color: {
    elementIds: string[];
    value: string;
    opacity: number;
    colorVariable?: string | undefined;
    opacityVariable?: string | undefined;
  };
};

const ColorLine = ({ color }: ColorLineProps) => {
  const updateElements = useEditorStore((state) => state.updateElements);

  const [opacity, setOpacity] = useState(
    color.opacityVariable
      ? `{{${color.opacityVariable}}}`
      : `${color.opacity * 100}%`
  );

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
        backgroundColor: newColor,
      })),
      saveToHistory
    );
  };

  const applyColorInput = (newColorValue: string) => {
    const elementIds = color.elementIds;

    const variableName = getVarFromString(newColorValue);

    if (variableName && variableName.length > 0) {
      updateElementsVariables(elementIds, "backgroundColor", variableName);
      return;
    }

    //Check if the color is hex color and valid
    if (!/^#[0-9A-F]{6}$/i.test(newColorValue)) {
      return;
    }

    updateElements(
      elementIds.map((elementId) => {
        const newVariablesWithoutProperty = getVariablesWithoutProperty(
          "backgroundColor",
          elementId
        );

        return {
          id: elementId,
          backgroundColor: newColorValue,
          variables: newVariablesWithoutProperty,
        };
      }),
      true
    );
  };

  const applyOpacity = (opacity: string) => {
    const elementIds = color.elementIds;

    const variableName = getVarFromString(opacity);

    if (variableName && variableName.length > 0) {
      updateElementsVariables(elementIds, "backgroundOpacity", variableName);
      return;
    }

    const opacityValue = Number(opacity.replace("%", "")) / 100;

    if (isNaN(opacityValue) || opacityValue < 0 || opacityValue > 1) {
      return;
    }

    updateElements(
      elementIds.map((elementId) => {
        const newVariablesWithoutProperty = getVariablesWithoutProperty(
          "backgroundOpacity",
          elementId
        );

        return {
          id: elementId,
          backgroundOpacity: opacityValue,
          variables: newVariablesWithoutProperty,
        };
      }),
      true
    );
  };

  return (
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
                hasVariable={color.colorVariable ? true : false}
                placeholder="color hex"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                onBlur={(e) => {
                  applyColorInput(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.key == "Enter") {
                    applyColorInput(e.currentTarget.value);
                  }
                }}
              />
            </div>
            <div className={gridItem({ colSpan: 5 })}>
              <PropertyTextField
                hasVariable={color.opacityVariable ? true : false}
                placeholder="Opacity"
                value={opacity}
                onChange={(e) => {
                  setOpacity(e.target.value);
                }}
                onBlur={(e) => {
                  applyOpacity(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.key == "Enter") {
                    applyOpacity(e.currentTarget.value);
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
  );
};

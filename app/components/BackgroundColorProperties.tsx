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
import { useEditorStore } from "./EditorStore";
import { css } from "styled-system/css";
import * as SelectPicker from "react-color";
import * as PopoverRadix from "@radix-ui/react-popover";
import { groupBySameValue } from "~/utils/groupBySameValue";

type BackgroundColorPropertiesProps = {
  properties: {
    backgroundColor: ValueType[];
  };
};

export const BackgroundColorProperties = (
  props: BackgroundColorPropertiesProps
) => {
  const updateElement = useEditorStore((state) => state.updateElement);

  const [colorValues, setColorValues] = useState(
    groupBySameValue(props.properties.backgroundColor)
  );

  useEffect(() => {
    setColorValues(groupBySameValue(props.properties.backgroundColor));
  }, [props.properties.backgroundColor]);

  const applyColor = (color: string, elementIds: string[]) => {
    elementIds.forEach((elementId) => {
      updateElement({
        id: elementId,
        backgroundColor: color,
      });
    });
  };

  return (
    <PanelGroup title="Background color">
      <Flex direction="column" gap={"2"}>
        {colorValues.map((color, index) => (
          <Popover.Root key={index}>
            <>
              <PopoverRadix.Anchor>
                <div
                  className={css({
                    display: "flex",
                    width: "180px",
                    gap: "8px",
                  })}
                >
                  <TextField.Root>
                    <TextField.Slot>
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
                    </TextField.Slot>
                    <TextField.Input
                      value={color.value}
                      className={css({
                        width: "68px!important",
                      })}
                    />
                  </TextField.Root>
                  <TextFieldInput
                    value={"100%"}
                    className={css({
                      width: "52px!important",
                    })}
                  />
                </div>
              </PopoverRadix.Anchor>
              <Popover.Content side="left">
                <SelectPicker.SketchPicker
                  className={css({
                    background: "var(--colors-background)!important",
                    shadow: "none!important",
                  })}
                  color={color.value}
                  onChange={(newColor) =>
                    applyColor(newColor.hex, color.elementIds)
                  }
                />
              </Popover.Content>
            </>
          </Popover.Root>
        ))}
      </Flex>
    </PanelGroup>
  );
};

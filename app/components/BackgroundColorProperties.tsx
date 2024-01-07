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
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEffect, useState } from "react";
import { useEditorStore } from "./EditorStore";
import { css } from "styled-system/css";
import * as SelectPicker from "react-color";
import * as PopoverRadix from "@radix-ui/react-popover";

type BackgroundColorPropertiesProps = {
  properties: {
    backgroundColor: ValueType[];
  };
};

export const BackgroundColorProperties = (
  props: BackgroundColorPropertiesProps
) => {
  const updateElement = useEditorStore((state) => state.updateElement);

  const [colorValue, setColorValue] = useState("");

  const applyColor = (color: string) => {
    setColorValue(color);
    props.properties.backgroundColor.forEach((element) => {
      updateElement({
        id: element.nodeId,
        backgroundColor: color,
      });
    });
  };

  return (
    <PanelGroup title="Background color">
      <Popover.Root>
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
                        backgroundColor: colorValue,
                      }}
                    />
                  </Popover.Trigger>
                </TextField.Slot>
                <TextField.Input
                  value={colorValue}
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
              color={colorValue}
              onChange={(color) => applyColor(color.hex)}
            />
          </Popover.Content>
        </>
      </Popover.Root>
    </PanelGroup>
  );
};

import {
  Box,
  Button,
  Flex,
  Grid,
  Popover,
  Select,
  TextField,
  TextFieldInput,
} from "@radix-ui/themes";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { useEffect, useState } from "react";
import { useEditorStore } from "./EditorStore";
import { css } from "styled-system/css";

type TextPropertiesProps = {
  properties: {
    fontSize: ValueType[];
  };
};

export const TextProperties = (props: TextPropertiesProps) => {
  const updateElement = useEditorStore((state) => state.updateElement);

  return (
    <PanelGroup title="Text">
      <div>
        <Select.Root>
          <TextField.Root>
            <TextFieldInput value="16" type="number" />
            <TextField.Slot></TextField.Slot>
          </TextField.Root>
          <Select.Content position="popper">
            <div
              className={css({
                maxHeight: 200,
                height: 200,
              })}
            >
              {Array.from(Array(65), (_, i) => i + 4).map((i) => (
                <Select.Item key={i} value={i.toString()}>
                  {i}px
                </Select.Item>
              ))}
            </div>
          </Select.Content>
        </Select.Root>
        <Select.Root
          defaultValue="8"
          onValueChange={(newVal) => {
            console.log(newVal);

            updateElement({
              id: props.properties.fontSize[0].nodeId,
              fontSize: parseInt(newVal),
            });
          }}
        >
          <Select.Trigger />
          <Select.Content position="popper" align="end">
            <div
              className={css({
                maxHeight: 200,
                height: 200,
              })}
            >
              {Array.from(Array(65), (_, i) => i + 4).map((i) => (
                <Select.Item key={i} value={i.toString()}>
                  {i}px
                </Select.Item>
              ))}
            </div>
          </Select.Content>
        </Select.Root>
      </div>
    </PanelGroup>
  );
};

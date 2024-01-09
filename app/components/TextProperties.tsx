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
import { useMemo } from "react";
import { useEditorStore } from "./EditorStore";
import { css } from "styled-system/css";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";

type TextPropertiesProps = {
  properties: {
    fontSize: ValueType[];
  };
};

export const TextProperties = (props: TextPropertiesProps) => {
  const updateElement = useEditorStore((state) => state.updateElement);

  const fontSizePropety = useMemo(
    () =>
      arePropertiesTheSame(props.properties.fontSize)
        ? props.properties.fontSize[0].value.toString()
        : "Mixed",
    [props.properties.fontSize]
  );

  return (
    <PanelGroup title="Text">
      <div>
        <Select.Root
          value={fontSizePropety}
          onValueChange={(newVal) => {
            props.properties.fontSize.forEach((property) => {
              updateElement({
                id: property.nodeId,
                [property.propertyName]: newVal,
              });
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
              {fontSizePropety === "Mixed" && (
                <Select.Item value={"Mixed"} disabled>
                  Mixed
                </Select.Item>
              )}
              {Array.from(Array(125), (_, i) => i + 4).map((i) => (
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

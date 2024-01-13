import {
  Box,
  Button,
  Flex,
  Grid,
  IconButton,
  Popover,
  Select,
  TextField,
  TextFieldInput,
  Tooltip,
} from "@radix-ui/themes";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { useMemo } from "react";
import { useEditorStore } from "./EditorStore";
import { css } from "styled-system/css";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { Icon } from "./Icon";
import { FontPicker } from "./FontPicker";
import { FontSizePicker } from "./FontSizePicker";

type TextPropertiesProps = {
  properties: {
    fontFamily: ValueType[];
    fontSize: ValueType[];
    textAlign: ValueType[];
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

  const fontFamilyProperty = useMemo(
    () =>
      arePropertiesTheSame(props.properties.fontFamily)
        ? props.properties.fontFamily[0].value.toString()
        : "Mixed",
    [props.properties.fontFamily]
  );

  const textAlignProperty = useMemo(
    () =>
      arePropertiesTheSame(props.properties.textAlign)
        ? props.properties.textAlign[0].value.toString()
        : "Mixed",
    [props.properties.textAlign]
  );

  const onClickTextAlign = (textAlign: "left" | "center" | "right") => {
    props.properties.textAlign.forEach((element) => {
      updateElement({
        id: element.nodeId,
        textAlign: textAlign,
      });
    });
  };

  return (
    <PanelGroup title="Text">
      <Flex direction="column" gap="1">
        <div>
          <FontPicker
            value={fontFamilyProperty}
            onValueChange={(value) => {
              props.properties.fontFamily.forEach((property) => {
                updateElement({
                  id: property.nodeId,
                  [property.propertyName]: value,
                });
              });
            }}
          />
        </div>
        <div>
          <FontSizePicker
            value={fontSizePropety}
            onValueChange={(newVal) => {
              props.properties.fontSize.forEach((property) => {
                updateElement({
                  id: property.nodeId,
                  [property.propertyName]: newVal,
                });
              });
            }}
          />
        </div>
        <Flex gap="1">
          <Tooltip content={"Text align left"}>
            <IconButton
              size="2"
              variant={textAlignProperty === "left" ? "solid" : "outline"}
              onClick={() => onClickTextAlign("left")}
            >
              <Icon name="text-align-left" aria-checked />
            </IconButton>
          </Tooltip>
          <Tooltip content={"Text align center"}>
            <IconButton
              size="2"
              variant={textAlignProperty === "center" ? "solid" : "outline"}
              onClick={() => onClickTextAlign("center")}
            >
              <Icon name="text-align-center" />
            </IconButton>
          </Tooltip>
          <Tooltip content={"Text align right"}>
            <IconButton
              size="2"
              variant={textAlignProperty === "right" ? "solid" : "outline"}
              onClick={() => onClickTextAlign("right")}
            >
              <Icon name="text-align-right" />
            </IconButton>
          </Tooltip>
        </Flex>
      </Flex>
    </PanelGroup>
  );
};

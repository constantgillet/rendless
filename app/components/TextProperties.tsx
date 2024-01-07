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

type TextPropertiesProps = {
  properties: {
    fontSize: ValueType[];
  };
};

export const TextProperties = (props: TextPropertiesProps) => {
  const updateElement = useEditorStore((state) => state.updateElement);

  return <PanelGroup title="Text"></PanelGroup>;
};

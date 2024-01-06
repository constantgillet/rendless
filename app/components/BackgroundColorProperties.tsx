import { Box, Flex, Grid, TextField } from "@radix-ui/themes";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEffect, useState } from "react";
import { useEditorStore } from "./EditorStore";
import { css } from "styled-system/css";

type BackgroundColorPropertiesProps = {
  properties: {
    backgroundColor: ValueType[];
  };
};

export const BackgroundColorProperties = (
  props: BackgroundColorPropertiesProps
) => {
  return <PanelGroup title="Background color">color</PanelGroup>;
};

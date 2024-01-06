import { Box, Button, Flex, Grid, Popover, TextField } from "@radix-ui/themes";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEffect, useState } from "react";
import { useEditorStore } from "./EditorStore";
import { css } from "styled-system/css";
import * as SelectPicker from "react-color";

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
        <Popover.Trigger>
          <Button variant="soft">Change color</Button>
        </Popover.Trigger>
        <Popover.Content>
          <SelectPicker.SketchPicker
            className={css({
              background: "var(--colors-background)!important",
            })}
            color={colorValue}
            onChange={(color) => applyColor(color.hex)}
          />
        </Popover.Content>
      </Popover.Root>
    </PanelGroup>
  );
};

import { Box, Flex, Grid, TextField } from "@radix-ui/themes";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEffect, useState } from "react";
import { useEditorStore } from "./EditorStore";
import { css } from "styled-system/css";

type BackgroundColorPropertiesProps = {
  properties: {
    x: ValueType[];
    y: ValueType[];
    width: ValueType[];
    height: ValueType[];
  };
};

export const BackgroundColorProperties = (
  props: BackgroundColorPropertiesProps
) => {
  const updateElement = useEditorStore((state) => state.updateElement);

  const [xValue, setX] = useState(
    arePropertiesTheSame(props.properties.x)
      ? props.properties.x[0].value
      : "Mixed"
  );

  const [y, setY] = useState(
    arePropertiesTheSame(props.properties.y)
      ? props.properties.y[0].value
      : "Mixed"
  );

  const [width, setWidth] = useState(
    arePropertiesTheSame(props.properties.width)
      ? props.properties.width[0].value
      : "Mixed"
  );

  const [height, setHeight] = useState(
    arePropertiesTheSame(props.properties.height)
      ? props.properties.height[0].value
      : "Mixed"
  );

  useEffect(() => {
    setX(
      arePropertiesTheSame(props.properties.x)
        ? props.properties.x[0].value
        : "Mixed"
    );
  }, [props.properties.x]);

  useEffect(() => {
    setY(
      arePropertiesTheSame(props.properties.y)
        ? props.properties.y[0].value
        : "Mixed"
    );
  }, [props.properties.y]);

  useEffect(() => {
    setWidth(
      arePropertiesTheSame(props.properties.width)
        ? props.properties.width[0].value
        : "Mixed"
    );
  }, [props.properties.width]);

  useEffect(() => {
    setHeight(
      arePropertiesTheSame(props.properties.height)
        ? props.properties.height[0].value
        : "Mixed"
    );
  }, [props.properties.height]);

  const applyProperty = (
    event: React.ChangeEvent<HTMLInputElement>,
    property: keyof BackgroundColorPropertiesProps["properties"]
  ) => {
    const newValue = event.target.value;

    if (isNaN(Number(newValue))) {
      return;
    }

    const value = Number(newValue);

    props.properties[property].forEach((property) => {
      updateElement({
        id: property.nodeId,
        [property.propertyName]: value,
      });
    });

    event.target.blur();
  };

  const onKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    property: keyof BackgroundColorPropertiesProps["properties"]
  ) => {
    if (e.key == "Enter") {
      applyProperty(e, property);
    }
  };

  return (
    <PanelGroup title="Position & size">
      <Grid columns="2" gap="4" width="auto">
        <Box>
          <TextField.Root>
            <TextField.Slot
              className={css({
                color: "var(--color-text-muted)",
                display: "flex",
                alignItems: "center",
              })}
            >
              <div>x</div>
            </TextField.Slot>
            <TextField.Input
              placeholder="Horizontal"
              value={xValue}
              onChange={(e) => setX(e.target.value)}
              onBlur={(e) => applyProperty(e, "x")}
              onKeyUp={(e) => onKeyUp(e, "x")}
            />
          </TextField.Root>
        </Box>
        <Box>
          <TextField.Root>
            <TextField.Slot>y</TextField.Slot>
            <TextField.Input
              placeholder="Vertical"
              value={y}
              onChange={(e) => setY(e.target.value)}
              onBlur={(e) => applyProperty(e, "y")}
              onKeyUp={(e) => onKeyUp(e, "y")}
            />
          </TextField.Root>
        </Box>
      </Grid>
      <Flex gap="4">
        <Grid columns="2" gap="4" width="auto">
          <Box>
            <TextField.Root>
              <TextField.Slot>w</TextField.Slot>
              <TextField.Input
                placeholder="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                onBlur={(e) => applyProperty(e, "width")}
                onKeyUp={(e) => onKeyUp(e, "width")}
              />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>h</TextField.Slot>
              <TextField.Input
                placeholder="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                onBlur={(e) => applyProperty(e, "height")}
                onKeyUp={(e) => onKeyUp(e, "height")}
              />
            </TextField.Root>
          </Box>
        </Grid>
      </Flex>
    </PanelGroup>
  );
};

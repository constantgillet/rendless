import { Badge, Box, Flex, Grid, TextField, Tooltip } from "@radix-ui/themes";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { css } from "styled-system/css";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEffect, useState } from "react";
import { useEditorStore } from "../stores/EditorStore";
import { Icon } from "./Icon";
import { getVarFromString } from "~/utils/getVarFromString";
import { getElementVariables } from "~/stores/actions/getElementVariables";

//keep only two decimals after the dot only if more than 2 decimals
const formatValue = (value: number) => {
  return value.toFixed(1).replace(/\.?0+$/, "");
};

type PositionAndSizePropertiesProps = {
  properties: {
    x: ValueType[];
    y: ValueType[];
    width: ValueType[];
    height: ValueType[];
  };
};

export const PositionAndSizeProperties = (
  props: PositionAndSizePropertiesProps
) => {
  const updateElements = useEditorStore((state) => state.updateElements);

  const [xValue, setX] = useState(
    arePropertiesTheSame(props.properties.x)
      ? formatValue(props.properties.x[0].value)
      : "Mixed"
  );

  const [y, setY] = useState(
    arePropertiesTheSame(props.properties.y)
      ? formatValue(props.properties.y[0].value)
      : "Mixed"
  );

  const [width, setWidth] = useState(
    arePropertiesTheSame(props.properties.width) &&
      !props.properties.width[0].variable
      ? formatValue(props.properties.width[0].value)
      : arePropertiesTheSame(props.properties.width)
      ? `{{${props.properties.width[0].variableName}}}`
      : "Mixed"
  );

  const [height, setHeight] = useState(
    arePropertiesTheSame(props.properties.height)
      ? formatValue(props.properties.height[0].value)
      : "Mixed"
  );

  useEffect(() => {
    setX(
      arePropertiesTheSame(props.properties.x)
        ? formatValue(props.properties.x[0].value)
        : "Mixed"
    );
  }, [props.properties.x]);

  useEffect(() => {
    setY(
      arePropertiesTheSame(props.properties.y)
        ? formatValue(props.properties.y[0].value)
        : "Mixed"
    );
  }, [props.properties.y]);

  useEffect(() => {
    setWidth(
      arePropertiesTheSame(props.properties.width) &&
        !props.properties.width[0].variable
        ? formatValue(props.properties.width[0].value)
        : arePropertiesTheSame(props.properties.width)
        ? `{{${props.properties.width[0].variableName}}}`
        : "Mixed"
    );
  }, [props.properties.width]);

  useEffect(() => {
    setHeight(
      arePropertiesTheSame(props.properties.height)
        ? formatValue(props.properties.height[0].value)
        : "Mixed"
    );
  }, [props.properties.height]);

  const applyProperty = (
    event: React.ChangeEvent<HTMLInputElement>,
    property: keyof PositionAndSizePropertiesProps["properties"]
  ) => {
    const newValue = event.target.value;

    const variableName = getVarFromString(newValue);

    if (variableName && variableName.length > 0) {
      updateElements(
        props.properties[property].map((property) => {
          const currentVariables = getElementVariables(property.nodeId);

          //Create new vaiables with the new variable if it doesn't exist
          const newVariablesWithoutProperty = currentVariables.filter(
            (variable) => variable.property !== property.propertyName
          );

          const newVariables = [
            ...newVariablesWithoutProperty,
            {
              property: property.propertyName,
              name: variableName,
            },
          ];

          return {
            id: property.nodeId,
            variables: newVariables,
          };
        }),
        true
      );

      return;
    }

    if (isNaN(Number(newValue))) {
      return;
    }

    const value = Number(newValue);

    updateElements(
      props.properties[property].map((property) => {
        const currentVariables = getElementVariables(property.nodeId);

        const newVariablesWithoutProperty = currentVariables.filter(
          (variable) => variable.property !== property.propertyName
        );

        return {
          id: property.nodeId,
          [property.propertyName]: value,
          variables: newVariablesWithoutProperty,
        };
      }),
      true
    );

    event.target.blur();
  };

  const onKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    property: keyof PositionAndSizePropertiesProps["properties"]
  ) => {
    if (e.key == "Enter") {
      applyProperty(e, property);
    }
  };

  return (
    <PanelGroup title="Position & size">
      <Grid columns="2" gap="2" width="auto">
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
            <TextField.Slot
              style={{
                paddingLeft: "2px",
              }}
            >
              <Tooltip content="You can use this variable in your template">
                <div
                  className={css({
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--accent-9)",
                    color: "var(--accent-9-contrast)",
                    rounded: "4px",
                  })}
                >
                  <Icon name="braces-variable" size="sm" />
                </div>
              </Tooltip>
            </TextField.Slot>
          </TextField.Root>
        </Box>
      </Grid>
      <Flex gap="2">
        <Grid columns="2" gap="2" width="auto">
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
              {props.properties.width[0].variable ? (
                <TextField.Slot
                  style={{
                    paddingLeft: "2px",
                  }}
                >
                  <Tooltip content="You can use this variable in your template">
                    <div
                      className={css({
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "var(--accent-9)",
                        color: "var(--accent-9-contrast)",
                        rounded: "4px",
                        _hover: { cursor: "help" },
                      })}
                    >
                      <Icon name="braces-variable" size="sm" />
                    </div>
                  </Tooltip>
                </TextField.Slot>
              ) : null}
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

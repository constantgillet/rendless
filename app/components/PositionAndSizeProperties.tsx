import { Box, Flex, Grid } from "@radix-ui/themes";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEffect, useState } from "react";
import { useEditorStore } from "../stores/EditorStore";
import { getVarFromString } from "~/utils/getVarFromString";
import { getElementVariables } from "~/stores/actions/getElementVariables";
import { PropertyTextField } from "./PropertyTextField";
import { Icon } from "./Icon";
import { getVariablesWithoutProperty } from "~/utils/getVariablesWithoutProperty";

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
    rotate: ValueType[];
  };
};

export const PositionAndSizeProperties = (
  props: PositionAndSizePropertiesProps
) => {
  const updateElements = useEditorStore((state) => state.updateElements);

  const setDefaultValueFromProps = (
    property: keyof PositionAndSizePropertiesProps["properties"]
  ) => {
    return arePropertiesTheSame(props.properties[property]) &&
      !props.properties[property][0].variable
      ? formatValue(props.properties[property][0].value)
      : arePropertiesTheSame(props.properties[property])
      ? `{{${props.properties[property][0].variableName}}}`
      : "Mixed";
  };

  const [x, setX] = useState(setDefaultValueFromProps("x"));

  const [y, setY] = useState(setDefaultValueFromProps("y"));

  const [width, setWidth] = useState(setDefaultValueFromProps("width"));

  const [height, setHeight] = useState(setDefaultValueFromProps("height"));

  const [rotate, setRotate] = useState(setDefaultValueFromProps("rotate"));

  useEffect(() => {
    setX(setDefaultValueFromProps("x"));
  }, [props.properties.x]);

  useEffect(() => {
    setY(setDefaultValueFromProps("y"));
  }, [props.properties.y]);

  useEffect(() => {
    setWidth(setDefaultValueFromProps("width"));
  }, [props.properties.width]);

  useEffect(() => {
    setHeight(setDefaultValueFromProps("height"));
  }, [props.properties.height]);

  useEffect(() => {
    setRotate(setDefaultValueFromProps("rotate"));
  }, [props.properties.rotate]);

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
        const newVariablesWithoutProperty = getVariablesWithoutProperty(
          property.propertyName,
          property.nodeId
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
          <PropertyTextField
            icon={<>x</>}
            hasVariable={props.properties.x[0].variable || false}
            placeholder="Horizontal"
            value={x}
            onChange={(e) => setX(e.target.value)}
            onBlur={(e) => applyProperty(e, "x")}
            onKeyUp={(e) => onKeyUp(e, "x")}
          />
        </Box>
        <Box>
          <PropertyTextField
            icon={<>y</>}
            hasVariable={props.properties.y[0].variable || false}
            placeholder="Vertical"
            value={y}
            onChange={(e) => setY(e.target.value)}
            onBlur={(e) => applyProperty(e, "y")}
            onKeyUp={(e) => onKeyUp(e, "y")}
          />
        </Box>
      </Grid>
      <Flex gap="2">
        <Grid columns="2" gap="2" width="auto">
          <Box>
            <PropertyTextField
              icon={<>w</>}
              hasVariable={props.properties.width[0].variable || false}
              placeholder="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              onBlur={(e) => applyProperty(e, "width")}
              onKeyUp={(e) => onKeyUp(e, "width")}
            />
          </Box>
          <Box>
            <PropertyTextField
              icon={<>h</>}
              hasVariable={props.properties.height[0].variable || false}
              placeholder="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onBlur={(e) => applyProperty(e, "height")}
              onKeyUp={(e) => onKeyUp(e, "height")}
            />
          </Box>
        </Grid>
      </Flex>
      <Flex gap="2">
        <Grid columns="2" gap="2" width="auto">
          <Box>
            <PropertyTextField
              icon={<Icon name="rotate-left" />}
              hasVariable={props.properties.rotate[0].variable || false}
              placeholder="rotate"
              value={rotate}
              onChange={(e) => setRotate(e.target.value)}
              onBlur={(e) => applyProperty(e, "rotate")}
              onKeyUp={(e) => onKeyUp(e, "rotate")}
            />
          </Box>
        </Grid>
      </Flex>
    </PanelGroup>
  );
};

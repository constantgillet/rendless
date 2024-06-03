import { Box, Flex, Grid, TextField } from "@radix-ui/themes";
import { PanelGroup, type ValueType } from "./PropertiesPanel";
import { Icon } from "./Icon";
import { useEffect, useState } from "react";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEditorStore } from "../stores/EditorStore";
import { getVarFromString } from "~/utils/getVarFromString";
import { getElementVariables } from "~/stores/actions/getElementVariables";
import { PropertyTextField } from "./PropertyTextField";

type RadiusPropertiesProps = {
  properties: {
    borderTopLeftRadius: ValueType[];
    borderTopRightRadius: ValueType[];
    borderBottomLeftRadius: ValueType[];
    borderBottomRightRadius: ValueType[];
  };
};

export const RadiusProperties = (props: RadiusPropertiesProps) => {
  const updateElements = useEditorStore((state) => state.updateElements);

  const setDefaultValueFromProps = (
    property: keyof RadiusPropertiesProps["properties"]
  ) => {
    return arePropertiesTheSame(props.properties[property]) &&
      !props.properties[property][0].variable
      ? props.properties[property][0].value
      : arePropertiesTheSame(props.properties[property])
      ? `{{${props.properties[property][0].variableName}}}`
      : "Mixed";
  };

  const [borderTopLeftRadiusValue, setBorderTopLeftRadius] = useState(
    setDefaultValueFromProps("borderTopLeftRadius")
  );

  const [borderTopRightRadiusValue, setBorderTopRightRadius] = useState(
    setDefaultValueFromProps("borderTopRightRadius")
  );

  const [borderBottomLeftRadiusValue, setBorderBottomLeftRadius] = useState(
    setDefaultValueFromProps("borderBottomLeftRadius")
  );

  const [borderBottomRightRadiusValue, setBorderBottomRightRadius] = useState(
    setDefaultValueFromProps("borderBottomRightRadius")
  );

  useEffect(() => {
    setBorderTopLeftRadius(setDefaultValueFromProps("borderTopLeftRadius"));
  }, [props.properties.borderTopLeftRadius]);

  useEffect(() => {
    setBorderTopRightRadius(setDefaultValueFromProps("borderTopRightRadius"));
  }, [props.properties.borderTopRightRadius]);

  useEffect(() => {
    setBorderBottomLeftRadius(
      setDefaultValueFromProps("borderBottomLeftRadius")
    );
  }, [props.properties.borderBottomLeftRadius]);

  useEffect(() => {
    setBorderBottomRightRadius(
      setDefaultValueFromProps("borderBottomRightRadius")
    );
  }, [props.properties.borderBottomRightRadius]);

  const applyProperty = (
    event: React.ChangeEvent<HTMLInputElement>,
    property: keyof RadiusPropertiesProps["properties"]
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
      props.properties[property].map((property) => ({
        id: property.nodeId,
        [property.propertyName]: value,
      })),
      true
    );

    event.target.blur();
  };

  const onKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    property: keyof RadiusPropertiesProps["properties"]
  ) => {
    if (e.key == "Enter") {
      applyProperty(e, property);
    }
  };

  return (
    <PanelGroup title="Radius">
      <Grid columns="2" gap="2" width="auto">
        <Box>
          <PropertyTextField
            icon={<Icon name="corner-top-left" strokeWidth={2} />}
            placeholder="Top left"
            hasVariable={
              props.properties.borderTopLeftRadius[0].variable || false
            }
            value={borderTopLeftRadiusValue}
            onChange={(e) => setBorderTopLeftRadius(e.target.value)}
            onBlur={(e) => applyProperty(e, "borderTopLeftRadius")}
            onKeyUp={(e) => onKeyUp(e, "borderTopLeftRadius")}
          />
        </Box>
        <Box>
          <PropertyTextField
            icon={<Icon name="corner-top-right" strokeWidth={2} />}
            placeholder="Top right"
            hasVariable={
              props.properties.borderTopRightRadius[0].variable || false
            }
            value={borderTopRightRadiusValue}
            onChange={(e) => setBorderTopRightRadius(e.target.value)}
            onBlur={(e) => applyProperty(e, "borderTopRightRadius")}
            onKeyUp={(e) => onKeyUp(e, "borderTopRightRadius")}
          />
        </Box>
      </Grid>
      <Flex gap="4">
        <Grid columns="2" gap="2" width="auto">
          <Box>
            <PropertyTextField
              icon={<Icon name="corner-bottom-left" strokeWidth={2} />}
              placeholder="Bottom left"
              hasVariable={
                props.properties.borderBottomLeftRadius[0].variable || false
              }
              value={borderBottomLeftRadiusValue}
              onChange={(e) => setBorderBottomLeftRadius(e.target.value)}
              onBlur={(e) => applyProperty(e, "borderBottomLeftRadius")}
              onKeyUp={(e) => onKeyUp(e, "borderBottomLeftRadius")}
            />
          </Box>
          <Box>
            <PropertyTextField
              icon={<Icon name="corner-bottom-right" strokeWidth={2} />}
              placeholder="Bottom right"
              hasVariable={
                props.properties.borderBottomRightRadius[0].variable || false
              }
              value={borderBottomRightRadiusValue}
              onChange={(e) => setBorderBottomRightRadius(e.target.value)}
              onBlur={(e) => applyProperty(e, "borderBottomRightRadius")}
              onKeyUp={(e) => onKeyUp(e, "borderBottomRightRadius")}
            />
          </Box>
        </Grid>
      </Flex>
    </PanelGroup>
  );
};

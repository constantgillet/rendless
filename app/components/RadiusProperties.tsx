import { Box, Flex, Grid, TextField } from "@radix-ui/themes";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { Icon } from "./Icon";
import { useEffect, useState } from "react";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { useEditorStore } from "./EditorStore";

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

  const [borderTopLeftRadiusValue, setBorderTopLeftRadius] = useState(
    arePropertiesTheSame(props.properties.borderTopLeftRadius)
      ? props.properties.borderTopLeftRadius[0].value
      : "Mixed"
  );

  const [borderTopRightRadiusValue, setBorderTopRightRadius] = useState(
    arePropertiesTheSame(props.properties.borderTopRightRadius)
      ? props.properties.borderTopRightRadius[0].value
      : "Mixed"
  );

  const [borderBottomLeftRadiusValue, setBorderBottomLeftRadius] = useState(
    arePropertiesTheSame(props.properties.borderBottomLeftRadius)
      ? props.properties.borderBottomLeftRadius[0].value
      : "Mixed"
  );

  const [borderBottomRightRadiusValue, setBorderBottomRightRadius] = useState(
    arePropertiesTheSame(props.properties.borderBottomRightRadius)
      ? props.properties.borderBottomRightRadius[0].value
      : "Mixed"
  );

  useEffect(() => {
    setBorderTopLeftRadius(
      arePropertiesTheSame(props.properties.borderTopLeftRadius)
        ? props.properties.borderTopLeftRadius[0].value
        : "Mixed"
    );
  }, [props.properties.borderTopLeftRadius]);

  useEffect(() => {
    setBorderTopRightRadius(
      arePropertiesTheSame(props.properties.borderTopRightRadius)
        ? props.properties.borderTopRightRadius[0].value
        : "Mixed"
    );
  }, [props.properties.borderTopRightRadius]);

  useEffect(() => {
    setBorderBottomLeftRadius(
      arePropertiesTheSame(props.properties.borderBottomLeftRadius)
        ? props.properties.borderBottomLeftRadius[0].value
        : "Mixed"
    );
  }, [props.properties.borderBottomLeftRadius]);

  useEffect(() => {
    setBorderBottomRightRadius(
      arePropertiesTheSame(props.properties.borderBottomRightRadius)
        ? props.properties.borderBottomRightRadius[0].value
        : "Mixed"
    );
  }, [props.properties.borderBottomRightRadius]);

  const applyProperty = (
    event: React.ChangeEvent<HTMLInputElement>,
    property: keyof RadiusPropertiesProps["properties"]
  ) => {
    const newValue = event.target.value;

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
      <Grid columns="2" gap="4" width="auto">
        <Box>
          <TextField.Root>
            <TextField.Slot>
              <Icon name="corner-top-left" strokeWidth={2} />
            </TextField.Slot>
            <TextField.Input
              placeholder="Top left"
              value={borderTopLeftRadiusValue}
              onChange={(e) => setBorderTopLeftRadius(e.target.value)}
              onBlur={(e) => applyProperty(e, "borderTopLeftRadius")}
              onKeyUp={(e) => onKeyUp(e, "borderTopLeftRadius")}
            />
          </TextField.Root>
        </Box>
        <Box>
          <TextField.Root>
            <TextField.Slot>
              <Icon name="corner-top-right" strokeWidth={2} />
            </TextField.Slot>
            <TextField.Input
              placeholder="Top right"
              value={borderTopRightRadiusValue}
              onChange={(e) => setBorderTopRightRadius(e.target.value)}
              onBlur={(e) => applyProperty(e, "borderTopRightRadius")}
              onKeyUp={(e) => onKeyUp(e, "borderTopRightRadius")}
            />
          </TextField.Root>
        </Box>
      </Grid>
      <Flex gap="4">
        <Grid columns="2" gap="4" width="auto">
          <Box>
            <TextField.Root>
              <TextField.Slot>
                <Icon name="corner-bottom-left" strokeWidth={2} />
              </TextField.Slot>
              <TextField.Input
                placeholder="Bottom left"
                value={borderBottomLeftRadiusValue}
                onChange={(e) => setBorderBottomLeftRadius(e.target.value)}
                onBlur={(e) => applyProperty(e, "borderBottomLeftRadius")}
                onKeyUp={(e) => onKeyUp(e, "borderBottomLeftRadius")}
              />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>
                <Icon name="corner-bottom-right" strokeWidth={2} />
              </TextField.Slot>
              <TextField.Input
                placeholder="Bottom right"
                value={borderBottomRightRadiusValue}
                onChange={(e) => setBorderBottomRightRadius(e.target.value)}
                onBlur={(e) => applyProperty(e, "borderBottomRightRadius")}
                onKeyUp={(e) => onKeyUp(e, "borderBottomRightRadius")}
              />
            </TextField.Root>
          </Box>
        </Grid>
      </Flex>
    </PanelGroup>
  );
};

import {
  Box,
  IconButton,
  TextField,
  Text,
  Grid,
  Flex,
  Separator as RadixSeparator,
} from "@radix-ui/themes";
import { css } from "styled-system/css";
import { Icon } from "./Icon";
import { ElementType, Tree, useEditorStore } from "./EditorStore";
import { useEffect, useState } from "react";
import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { BackgroundColorProperties } from "./BackgroundColorProperties";
import { TextColorProperties } from "./TextColorProperties";
import { TextProperties } from "./TextProperties";
import { RadiusProperties } from "./RadiusProperties";

const Separator = () => {
  return (
    <RadixSeparator
      className={css({ w: "auto!important", marginY: "20px", mx: "-16px" })}
    />
  );
};

type GroupedPropertiesType = {
  [key: string]: Array<ValueType>;
};

export type ValueType = {
  nodeId: string;
  propertyName: string;
  value: any;
};

type PositionAndSizePropertiesProps = {
  properties: {
    x: ValueType[];
    y: ValueType[];
    width: ValueType[];
    height: ValueType[];
  };
};

//keep only two decimals after the dot only if more than 2 decimals
const formatValue = (value: number) => {
  return value.toFixed(1).replace(/\.?0+$/, "");
};

const PositionAndSizeProperties = (props: PositionAndSizePropertiesProps) => {
  const updateElement = useEditorStore((state) => state.updateElement);

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
    arePropertiesTheSame(props.properties.width)
      ? formatValue(props.properties.width[0].value)
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
      arePropertiesTheSame(props.properties.width)
        ? formatValue(props.properties.width[0].value)
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
    property: keyof PositionAndSizePropertiesProps["properties"]
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

const GroupProperties = (nodes: ElementType[]) => {
  const propertieFlatList: Array<{
    nodeId: string;
    propertyName: string;
    value: any;
  }> = [];

  for (const node of nodes) {
    Object.entries(node).forEach(([key, value]) => {
      //ignore if value is undefined
      if (value === undefined) {
        return;
      }

      propertieFlatList.push({
        nodeId: node.id,
        propertyName: key,
        value: value,
      });
    });
  }

  //group by property by name
  const groupedProperties = propertieFlatList.reduce(
    (acc: GroupedPropertiesType, property) => {
      const propertyName = property.propertyName;

      if (!acc[propertyName]) {
        acc[propertyName] = [];
      }

      acc[propertyName].push(property);

      return acc;
    },
    {}
  );

  return groupedProperties;
};

export const PropertiesPanel = () => {
  const selected = useEditorStore((state) => state.selected);
  const tree = useEditorStore((state) => state.tree);

  const selectedNodes = tree.chilren.filter((node) =>
    selected.includes(node.id)
  );

  //Get the properties list of the selected node
  const properties = GroupProperties(selectedNodes);

  return (
    <aside
      className={css({
        w: 244,
        backgroundColor: "var(--color-panel)",
        borderColor: "var(--global-color-border, currentColor)",
        padding: "var(--space-4)",
        borderLeft: "1px solid var(--gray-a5)",
      })}
    >
      {properties["x"] &&
        properties["y"] &&
        properties["width"] &&
        properties["height"] && (
          <>
            <PositionAndSizeProperties
              properties={{
                x: properties["x"],
                y: properties["y"],
                width: properties["width"],
                height: properties["height"],
              }}
            />
            <Separator />
          </>
        )}
      {properties["backgroundColor"] && (
        <>
          <BackgroundColorProperties
            properties={{
              backgroundColor: properties["backgroundColor"],
            }}
          />
          <Separator />
        </>
      )}
      {properties["color"] && (
        <>
          <TextColorProperties
            properties={{
              color: properties["color"],
            }}
          />
          <Separator />
        </>
      )}
      {properties["fontSize"] && properties["textAlign"] && (
        <>
          <TextProperties
            properties={{
              fontSize: properties["fontSize"],
              textAlign: properties["textAlign"],
            }}
          />
          <Separator />
        </>
      )}
      {properties["borderTopLeftRadius"] &&
        properties["borderTopRightRadius"] &&
        properties["borderBottomLeftRadius"] &&
        properties["borderBottomRightRadius"] && (
          <>
            <RadiusProperties
              properties={{
                borderTopLeftRadius: properties["borderTopLeftRadius"],
                borderTopRightRadius: properties["borderTopRightRadius"],
                borderBottomLeftRadius: properties["borderBottomLeftRadius"],
                borderBottomRightRadius: properties["borderBottomRightRadius"],
              }}
            />
            <Separator />
          </>
        )}
    </aside>
  );
};

type PanelGroupProps = {
  title: string;
  children: React.ReactNode;
};

export const PanelGroup = (props: PanelGroupProps) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      })}
    >
      <Text size="2" className={css({})}>
        {props.title}
      </Text>
      <Grid columns="1" gap="4" width="auto">
        {props.children}
      </Grid>
    </div>
  );
};

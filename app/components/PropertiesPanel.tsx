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
import { Tree, useEditorStore } from "./EditorStore";

const Separator = () => {
  return (
    <RadixSeparator
      className={css({ w: "auto!important", marginY: "20px", mx: "-16px" })}
    />
  );
};

type ValuesType = {
  propertyName: string;
  values: {
    elementId: string;
    value: string;
  };
};

type PositionAndSizePropertiesProps = {
  values: ValuesType[];
};

const PositionAndSizeProperties = (props: PositionAndSizePropertiesProps) => {
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
            <TextField.Input placeholder="Horizontal" />
          </TextField.Root>
        </Box>
        <Box>
          <TextField.Root>
            <TextField.Slot>y</TextField.Slot>
            <TextField.Input placeholder="Vertical" />
          </TextField.Root>
        </Box>
      </Grid>
      <Flex gap="4">
        <Grid columns="2" gap="4" width="auto">
          <Box>
            <TextField.Root>
              <TextField.Slot>w</TextField.Slot>
              <TextField.Input placeholder="width" />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>h</TextField.Slot>
              <TextField.Input placeholder="height" />
            </TextField.Root>
          </Box>
        </Grid>
      </Flex>
    </PanelGroup>
  );
};

const RadiusProperties = () => {
  return (
    <PanelGroup title="Radius">
      <Grid columns="2" gap="4" width="auto">
        <Box>
          <TextField.Root>
            <TextField.Slot>
              <Icon name="corner-top-left" strokeWidth={2} />
            </TextField.Slot>
            <TextField.Input placeholder="Top left" />
          </TextField.Root>
        </Box>
        <Box>
          <TextField.Root>
            <TextField.Slot>
              <Icon name="corner-top-right" strokeWidth={2} />
            </TextField.Slot>
            <TextField.Input placeholder="Top right" />
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
              <TextField.Input placeholder="Bottom left" />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>
                <Icon name="corner-bottom-right" strokeWidth={2} />
              </TextField.Slot>
              <TextField.Input placeholder="Bottom right" />
            </TextField.Root>
          </Box>
        </Grid>
      </Flex>
    </PanelGroup>
  );
};

const propertiesList = {
  shape: [
    {
      key: "positionsAndSize",
      component: PositionAndSizeProperties,
    },
    {
      key: "radius",
      component: RadiusProperties,
    },
    {
      key: "background",
      component: RadiusProperties,
    },
    {
      key: "border",
      component: RadiusProperties,
    },
  ],
};

export const PropertiesPanel = () => {
  const selected = useEditorStore((state) => state.selected);
  const tree = useEditorStore((state) => state.tree);

  const selectedNodes = tree.chilren?.filter((node) => node.id === selected);

  const getProperties = (selectedNodes: Tree[]): ValuesType[] => {
    const properties = [];

    for (const node of selectedNodes) {
      const nodeProperties = node.properties;

      for (const property in nodeProperties) {
        const propertyValue = nodeProperties[property];

        properties.push({
          propertyName: property,
          values: {
            elementId: node.id,
            value: propertyValue,
          },
        });
      }
    }
  };

  //Get the properties list of the selected node
  const properties = getProperties(selectedNodes);

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
              <TextField.Input placeholder="Horizontal" />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>y</TextField.Slot>
              <TextField.Input placeholder="Vertical" />
            </TextField.Root>
          </Box>
        </Grid>
        <Flex gap="4">
          <Grid columns="2" gap="4" width="auto">
            <Box>
              <TextField.Root>
                <TextField.Slot>w</TextField.Slot>
                <TextField.Input placeholder="width" />
              </TextField.Root>
            </Box>
            <Box>
              <TextField.Root>
                <TextField.Slot>h</TextField.Slot>
                <TextField.Input placeholder="height" />
              </TextField.Root>
            </Box>
          </Grid>
        </Flex>
      </PanelGroup>
      <Separator />
      <PanelGroup title="Radius">
        <Grid columns="2" gap="4" width="auto">
          <Box>
            <TextField.Root>
              <TextField.Slot>
                <Icon name="corner-top-left" strokeWidth={2} />
              </TextField.Slot>
              <TextField.Input placeholder="Top left" />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>
                <Icon name="corner-top-right" strokeWidth={2} />
              </TextField.Slot>
              <TextField.Input placeholder="Top right" />
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
                <TextField.Input placeholder="Bottom left" />
              </TextField.Root>
            </Box>
            <Box>
              <TextField.Root>
                <TextField.Slot>
                  <Icon name="corner-bottom-right" strokeWidth={2} />
                </TextField.Slot>
                <TextField.Input placeholder="Bottom right" />
              </TextField.Root>
            </Box>
          </Grid>
        </Flex>
      </PanelGroup>
      <Separator />
      <PanelGroup title="Background">
        <Grid columns="2" gap="4" width="auto">
          <Box>
            <TextField.Root>
              <TextField.Slot>x</TextField.Slot>
              <TextField.Input placeholder="Horizontal" />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>y</TextField.Slot>
              <TextField.Input placeholder="Vertical" />
            </TextField.Root>
          </Box>
        </Grid>
      </PanelGroup>
      <Separator />
      <PanelGroup title="Borders">
        <Grid columns="2" gap="4" width="auto">
          <Box>
            <TextField.Root>
              <TextField.Slot>x</TextField.Slot>
              <TextField.Input placeholder="Horizontal" />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>y</TextField.Slot>
              <TextField.Input placeholder="Vertical" />
            </TextField.Root>
          </Box>
        </Grid>
      </PanelGroup>
      <Separator />
    </aside>
  );
};

type PanelGroupProps = {
  title: string;
  children: React.ReactNode;
};

const PanelGroup = (props: PanelGroupProps) => {
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

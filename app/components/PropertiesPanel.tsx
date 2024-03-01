import { Text, Grid, Separator as RadixSeparator } from "@radix-ui/themes";
import { css } from "styled-system/css";
import { ElementType, useEditorStore } from "../stores/EditorStore";
import { BackgroundColorProperties } from "./BackgroundColorProperties";
import { TextColorProperties } from "./TextColorProperties";
import { TextProperties } from "./TextProperties";
import { RadiusProperties } from "./RadiusProperties";
import { PositionAndSizeProperties } from "./PositionAndSizeProperties";
import { VariablesFoundIndicator } from "./VariablesFoundIndicator";

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
  variable?: boolean;
  variableName?: string;
};

const GroupProperties = (nodes: ElementType[]) => {
  const propertieFlatList: Array<ValueType> = [];

  for (const node of nodes) {
    Object.entries(node).forEach(([key, value]) => {
      //ignore if value is undefined
      if (value === undefined) {
        return;
      }

      //Check if the node has a variable
      const variable = node.variables?.find(
        (variable) => variable.property === key
      );

      propertieFlatList.push({
        nodeId: node.id,
        propertyName: key,
        value: value,
        variable: variable ? true : false,
        variableName: variable ? variable.name : undefined,
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

  const selectedNodes = tree.children.filter((node) =>
    selected.includes(node.id)
  );

  //Get the properties list of the selected node
  const properties = GroupProperties(selectedNodes);

  return (
    <aside
      className={css({
        w: 268,
        backgroundColor: "var(--color-panel)",
        borderColor: "var(--global-color-border, currentColor)",
        padding: "var(--space-4)",
        borderLeft: "1px solid var(--gray-a5)",
      })}
    >
      {properties["x"] &&
        properties["y"] &&
        properties["width"] &&
        properties["height"] &&
        properties["rotate"] && (
          <>
            <PositionAndSizeProperties
              properties={{
                x: properties["x"],
                y: properties["y"],
                width: properties["width"],
                height: properties["height"],
                rotate: properties["rotate"],
              }}
            />
            <Separator />
          </>
        )}
      {properties["backgroundColor"] && properties["backgroundOpacity"] && (
        <>
          <BackgroundColorProperties
            properties={{
              backgroundColor: properties["backgroundColor"],
              backgroundOpacity: properties["backgroundOpacity"],
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
      {properties["fontSize"] &&
        properties["textAlign"] &&
        properties["fontWeight"] &&
        properties["fontStyle"] && (
          <>
            <TextProperties
              properties={{
                fontFamily: properties["fontFamily"],
                fontSize: properties["fontSize"],
                textAlign: properties["textAlign"],
                fontWeight: properties["fontWeight"],
                fontStyle: properties["fontStyle"],
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
      {
        // If empty properties
        !Object.keys(properties).length && (
          <>
            <BackgroundColorProperties
              properties={{
                backgroundColor: [
                  {
                    value: tree.backgroundColor,
                    nodeId: "1",
                    propertyName: "backgroundColor",
                  },
                ],
              }}
            />
            <Separator />
            <VariablesFoundIndicator />
            <Separator />
          </>
        )
      }
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
      <Grid columns="1" gap="2" width="auto">
        {props.children}
      </Grid>
    </div>
  );
};

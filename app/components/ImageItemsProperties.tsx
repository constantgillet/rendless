import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { useMemo } from "react";
import { PropertyLine } from "./PropertyLine";
import { Button, IconButton, Select, TextField } from "@radix-ui/themes";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Icon } from "./Icon";
import { useEditorStore } from "~/stores/EditorStore";
import { css } from "styled-system/css";

type ImagePropertiesProps = {
  properties: {
    src: ValueType[];
    objectFit: ValueType[];
  };
};

const objectFitOptions = ["fill", "contain", "cover", "none", "scale-down"];

export const ImageItemsProperties = (props: ImagePropertiesProps) => {
  const updateElements = useEditorStore((state) => state.updateElements);

  const objectFitPropety = useMemo(
    () =>
      arePropertiesTheSame(props.properties.objectFit)
        ? props.properties.objectFit[0].value.toString()
        : "Mixed",
    [props.properties.objectFit]
  );

  return (
    <PanelGroup title="Image settings">
      <PropertyLine label="Image fit">
        <Select.Root
          onValueChange={(newValue) => {
            updateElements(
              props.properties.objectFit.map((property) => ({
                id: property.nodeId,
                objectFit: newValue,
              })),
              true
            );
          }}
        >
          <SelectPrimitive.Trigger disabled={objectFitPropety === "Mixed"}>
            <Button
              variant="surface"
              size={"2"}
              color="gray"
              disabled={objectFitPropety === "Mixed"}
            >
              {objectFitPropety}
              <Icon name="chevron-down" />
            </Button>
          </SelectPrimitive.Trigger>
          <Select.Content position="popper" align="end">
            {objectFitOptions.map((option) => (
              <Select.Item key={option} value={option}>
                {option}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </PropertyLine>
      <PropertyLine label="Image source" direction="column">
        <div
          className={css({
            display: "flex",
            gap: "1",
            justifyContent: "space-between",
          })}
        >
          <TextField.Root>
            <TextField.Input placeholder="Image url or upload" />{" "}
          </TextField.Root>
          <Button variant="outline">
            <Icon name="arrow-upload" />
            Upload
          </Button>
        </div>
      </PropertyLine>
    </PanelGroup>
  );
};

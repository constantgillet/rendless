import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { useMemo } from "react";
import { PropertyLine } from "./PropertyLine";
import { Button, Select } from "@radix-ui/themes";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Icon } from "./Icon";
import { useEditorStore } from "~/stores/EditorStore";

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
          <SelectPrimitive.Trigger disabled={false}>
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
    </PanelGroup>
  );
};

import { arePropertiesTheSame } from "~/utils/arePropertiesTheSame";
import { PanelGroup, ValueType } from "./PropertiesPanel";
import { useMemo, useRef, useState } from "react";
import { PropertyLine } from "./PropertyLine";
import { Button, Select, TextField } from "@radix-ui/themes";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Icon } from "./Icon";
import { useEditorStore } from "~/stores/EditorStore";
import { css } from "styled-system/css";
import { PropertyTextField } from "./PropertyTextField";
import { getVarFromString } from "~/utils/getVarFromString";
import { updateElementsVariables } from "~/stores/actions/updateElementsVariables";
import { getVariablesWithoutProperty } from "~/utils/getVariablesWithoutProperty";

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
            flexDirection: "column",
            gap: "1",
          })}
        >
          {props.properties.src.map((srcProperty) => {
            return <AssetLine key={srcProperty.nodeId} src={srcProperty} />;
          })}
        </div>
      </PropertyLine>
    </PanelGroup>
  );
};

type AssetLineProps = {
  src: ValueType;
};

const AssetLine = (props: AssetLineProps) => {
  const srcInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const updateElements = useEditorStore((state) => state.updateElements);

  const [srcInputValue, setSrcInputValue] = useState(
    props.src.variable ? `{{${props.src.variable}}}` : props.src.value
  );

  const applySrc = (newSrcValue: string) => {
    const elementId = props.src.nodeId;

    const variableName = getVarFromString(newSrcValue);

    if (variableName && variableName.length > 0) {
      updateElementsVariables([elementId], "src", variableName);
      return;
    }

    const newVariablesWithoutProperty = getVariablesWithoutProperty(
      "src",
      elementId
    );

    updateElements(
      [
        {
          id: elementId,
          src: newSrcValue?.length > 0 ? newSrcValue : null,
          variables: newVariablesWithoutProperty,
        },
      ],
      true
    );

    //Blur the input to exit edit mode
    srcInputRef.current?.blur();
  };

  const onChangeFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    //send the file to the server with a POST request
    const file = e.target.files?.[0];
  };

  return (
    <div
      className={css({
        display: "flex",
        gap: "1",
        justifyContent: "space-between",
      })}
    >
      <PropertyTextField
        ref={srcInputRef}
        hasVariable={props.src.variable ? true : false}
        placeholder="Image url or upload"
        onChange={(e) => {
          setSrcInputValue(e.target.value);
        }}
        onBlur={() => {
          applySrc(srcInputValue);
        }}
        onKeyUp={(e) => {
          if (e.key == "Enter") {
            applySrc(srcInputValue);
          }
        }}
        value={srcInputValue}
      />
      <Button
        variant="outline"
        onClick={() => {
          uploadInputRef.current?.click();
        }}
      >
        <Icon name="arrow-upload" />
        Upload
      </Button>
      <input
        type="file"
        hidden
        ref={uploadInputRef}
        accept="image/png, image/gif, image/jpeg"
        multiple={false}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target?.result;
              if (typeof dataUrl === "string") {
                setSrcInputValue(dataUrl);
                applySrc(dataUrl);
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </div>
  );
};

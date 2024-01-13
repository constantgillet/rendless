import { Button, Select } from "@radix-ui/themes";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Icon } from "./Icon";
import fontContent from "../contents/fontInfo.json";
import { useMemo } from "react";

type FontWeightPickerProps = {
  fontFamily: string;
  fontWeightValue: number;
  fontStyleValue: "normal" | "italic";
  onValueChange?: (value: number) => void;
};

const fontSizeList = Array.from(Array(125), (_, i) => i + 4);

const variantsValueMap = {
  "0,100": {
    name: "thin",
    value: 100,
    style: "normal",
  },
  "0,200": {
    name: "extra-light",
    value: 200,
    style: "normal",
  },
  "0,300": {
    name: "light",
    value: 300,
    style: "normal",
  },
  "0,400": {
    name: "regular",
    value: 400,
    style: "normal",
  },
  "0,500": {
    name: "medium",
    value: 500,
    style: "normal",
  },
  "0,600": {
    name: "semi-bold",
    value: 600,
    style: "normal",
  },
  "0,700": {
    name: "bold",
    value: 700,
    style: "normal",
  },
  "0,800": {
    name: "extra-bold",
    value: 800,
    style: "normal",
  },
  "0,900": {
    name: "black",
    value: 900,
    style: "normal",
  },
  "1,100": {
    name: "thin italic",
    value: 100,
    style: "italic",
  },
  "1,200": {
    name: "extra-light italic",
    value: 200,
    style: "italic",
  },
  "1,300": {
    name: "light italic",
    value: 300,
    style: "italic",
  },
  "1,400": {
    name: "regular italic",
    value: 400,
    style: "italic",
  },
  "1,500": {
    name: "medium italic",
    value: 500,
    style: "italic",
  },
  "1,600": {
    name: "semi-bold italic",
    value: 600,
    style: "italic",
  },
  "1,700": {
    name: "bold italic",
    value: 700,
    style: "italic",
  },
};

export const FontVariantPicker = (props: FontWeightPickerProps) => {
  const fontVariants = useMemo(() => {
    const font = fontContent.find((font) => font.name === props.fontFamily);
    if (font) {
      return font.variants;
    }
    return [];
  }, [props.fontFamily]);

  const disabled = props.fontFamily === "Mixed";

  return (
    <Select.Root onValueChange={() => {}}>
      <SelectPrimitive.Trigger disabled={disabled}>
        <Button variant="surface" size={"2"} color="gray" disabled={disabled}>
          {disabled ? "Mixed" : "Regular"}
          <Icon name="chevron-down" />
        </Button>
      </SelectPrimitive.Trigger>
      <Select.Content position="popper" align="end">
        {fontVariants.map((variant) => {
          const variantValue = variantsValueMap[variant];
          return (
            <Select.Item key={variant} value={variantValue.value.toString()}>
              {variantValue.name}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select.Root>
  );
};

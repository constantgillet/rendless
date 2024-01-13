import { Button, Select } from "@radix-ui/themes";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Icon } from "./Icon";

type FontSizePickerProps = {
  value: string;
  onValueChange?(value: string): void;
};

const fontSizeList = Array.from(Array(125), (_, i) => i + 4);

export const FontSizePicker = (props: FontSizePickerProps) => {
  return (
    <Select.Root value={props.value} onValueChange={props.onValueChange}>
      <SelectPrimitive.Trigger>
        <Button variant="surface" size={"2"} color="gray">
          {props.value}px
          <Icon name="chevron-down" />
        </Button>
      </SelectPrimitive.Trigger>
      <Select.Content position="popper" align="end">
        <Select.Item
          key={fontSizeList[index]}
          value={fontSizeList[index].toString()}
        >
          {fontSizeList[index]}px
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
};

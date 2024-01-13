import { Button, Select } from "@radix-ui/themes";
import fontContent from "../contents/fontInfo.json";
import { Virtuoso } from "react-virtuoso";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Icon } from "./Icon";

type FontPickerProps = {
  value: string;
  onValueChange?: (value: string) => void;
};

export const FontPicker = (props: FontPickerProps) => {
  return (
    <Select.Root
      defaultValue=""
      onValueChange={(value) => {
        props.onValueChange?.(value);
      }}
    >
      <SelectPrimitive.Trigger>
        <Button variant="surface" size={"2"} color="gray">
          Font <Icon name="chevron-down" />
        </Button>
      </SelectPrimitive.Trigger>
      <Select.Content position="popper" align="end">
        <Virtuoso
          style={{ height: "400px", width: "200px" }}
          totalCount={fontContent.length}
          itemContent={(index) => (
            <Select.Item
              key={fontContent[index].name}
              value={fontContent[index].name}
            >
              {fontContent[index].name}
            </Select.Item>
          )}
        />
      </Select.Content>
    </Select.Root>
  );
};

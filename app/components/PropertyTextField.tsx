import { TextField, Tooltip } from "@radix-ui/themes";
import { Icon } from "./Icon";
import { css } from "styled-system/css";
import type { RootProps } from "node_modules/@radix-ui/themes/dist/esm/components/text-field";

//Get default props of input
type PropertyTextFieldProps = RootProps & {
  hasVariable: boolean;
  icon?: React.ReactNode;
  unit?: string;
};

export const PropertyTextField = (props: PropertyTextFieldProps) => {
  const { hasVariable, icon, unit, ...inputProps } = props;

  return (
    <TextField.Root {...inputProps}>
      {icon ? <TextField.Slot>{icon}</TextField.Slot> : null}

      {unit ? (
        <TextField.Slot
          style={{
            paddingLeft: "2px",
          }}
        >
          {unit}
        </TextField.Slot>
      ) : null}
      {hasVariable ? (
        <TextField.Slot
          style={{
            paddingLeft: "2px",
          }}
        >
          <Tooltip content="You can use this variable in your template">
            <div
              className={css({
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--accent-9)",
                color: "var(--accent-9-contrast)",
                rounded: "4px",
                _hover: { cursor: "help" },
              })}
            >
              <Icon name="braces-variable" size="sm" />
            </div>
          </Tooltip>
        </TextField.Slot>
      ) : null}
    </TextField.Root>
  );
};

import { Button, TextField } from "@radix-ui/themes";
import { ButtonProps } from "node_modules/@radix-ui/themes/dist/esm/components/button";
import { useField, useIsSubmitting } from "remix-validated-form";
import { css } from "styled-system/css";
import { Spinner } from "./Spinner";
import { RootProps } from "@radix-ui/themes/src/components/text-field.js";

type FormInputProps = RootProps & {
  name: string;
};

export const FormInput = ({ name, ...props }: FormInputProps) => {
  const { error, getInputProps } = useField(name);

  const textFieldInputProps = {
    ...getInputProps({ id: name }),
    ...props,
  };

  return (
    <div>
      <TextField.Root
        {...textFieldInputProps}
        color={error ? "red" : props.color}
      />
      {error && (
        <span
          className={css({
            color: "var(--red-9)",
            fontSize: "sm",
            marginTop: "var(--space-1)",
          })}
        >
          {error}
        </span>
      )}
    </div>
  );
};

type FormSubmitButtonProps = ButtonProps;

export const FormSubmitButton = (props: FormSubmitButtonProps) => {
  const isSubmitting = useIsSubmitting();

  return (
    <Button type="submit" disabled={isSubmitting} {...props}>
      {isSubmitting ? (
        <>
          <Spinner size={16} /> Submitting
        </>
      ) : (
        props.children
      )}
    </Button>
  );
};

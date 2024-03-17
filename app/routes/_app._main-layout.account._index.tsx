import { Card, Select } from "@radix-ui/themes";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { css } from "styled-system/css";
import { z } from "zod";
import { FormSubmitButton } from "~/components/Form";
import * as m from "~/paraglide/messages";

export const handle = {
  pageTitle: m.settings(),
};

export const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
);

export default function AccountPage() {
  return (
    <div>
      <h1
        className={css({
          fontSize: "xl",
          fontWeight: "bold",
          color: "var(--gray-11)",
          marginBottom: "4",
        })}
      >
        General settings
      </h1>
      <ValidatedForm
        validator={validator}
        method="post"
        className={css({
          spaceY: "18px",
          display: "flex",
          flexDirection: "column",
        })}
      >
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            spaceY: "1",
          })}
        >
          <label>Language</label>
          <p
            className={css({
              color: "var(--gray-11)",
              fontSize: "sm",
            })}
          >
            Set the language you want to use in the application.{" "}
          </p>
          <div
            className={css({
              w: "fit",
            })}
          >
            <Select.Root defaultValue="en">
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="en">English</Select.Item>
                <Select.Item value="fr">French</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <div
          className={css({
            display: "flex",
            justifyContent: "flex-end",
          })}
        >
          <FormSubmitButton>Save changes</FormSubmitButton>
        </div>
      </ValidatedForm>
    </div>
  );
}

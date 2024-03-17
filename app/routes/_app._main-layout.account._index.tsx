import { Card, Select } from "@radix-ui/themes";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { css } from "styled-system/css";
import { z } from "zod";
import { FormSubmitButton } from "~/components/Form";
import { languageCookie } from "~/libs/cookies.server";
import * as m from "~/paraglide/messages";
import { availableLanguageTags, languageTag } from "~/paraglide/runtime";

export const handle = {
  pageTitle: m.settings(),
};

export const validator = withZod(
  z.object({
    language: z.enum(availableLanguageTags),
  })
);

const languagesOptions = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
];

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    // validationError comes from `remix-validated-form`
    return validationError(result.error);
  }

  console.log(result.data);

  const cookieHeader = request.headers.get("Cookie");
  let languageCookieParsed = (await languageCookie.parse(cookieHeader)) || {};

  languageCookieParsed = result.data.language;

  return redirect("/account", {
    headers: {
      "Set-Cookie": await languageCookie.serialize(languageCookieParsed),
    },
  });
};

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
        defaultValues={{ language: languageTag() }}
      >
        <Card variant="surface">
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              spaceY: "2",
            })}
          >
            <label htmlFor="language">Language</label>
            <p
              className={css({
                color: "var(--gray-11)",
                fontSize: "sm",
              })}
            >
              Set the language you want to use in the application.
            </p>
            <div
              className={css({
                w: "fit",
              })}
            >
              <Select.Root defaultValue={languageTag()} name="language">
                <Select.Trigger id="language" />
                <Select.Content>
                  {languagesOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </Card>
        <div
          className={css({
            display: "flex",
            justifyContent: "flex-end",
          })}
        >
          <FormSubmitButton>{m.save_changes()}</FormSubmitButton>
        </div>
      </ValidatedForm>
    </div>
  );
}

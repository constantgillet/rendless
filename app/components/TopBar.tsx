import { css } from "styled-system/css";
import { Icon } from "./Icon";
import {
  Button,
  Callout,
  Dialog,
  IconButton,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import { Tool, useEditorStore } from "../stores/EditorStore";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ValidatedForm } from "remix-validated-form";
import { FormInput } from "./Form";
import { useState } from "react";

const toolsData = [
  {
    name: "select",
    icon: "cursor",
    tooltipText: "Select frame elements (V)",
  },
  {
    name: "text",
    icon: "text",
    tooltipText: "Add a text box (T)",
  },
  {
    name: "rect",
    icon: "shape",
    tooltipText: "Add a shape (R)",
  },
];

type TopBarProps = {
  initalName: string;
};

export const TopBar = ({ initalName }: TopBarProps) => {
  const selectedTool = useEditorStore((state) => state.selectedTool);
  const setSelectedTool = useEditorStore((state) => state.setSelectedTool);

  return (
    <header
      className={css({
        top: 0,
        left: 0,
        height: "58px",
        borderBottom: "1px solid var(--gray-a5)",
        backgroundColor: "var(--color-panel)",
        width: "100%",
      })}
    >
      <div
        className={css({
          paddingX: "var(--space-3)",
          height: "100%",
          display: "flex",
        })}
      >
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            height: "100%",
            gap: "var(--space-2)",
            flex: 1,
          })}
        >
          {toolsData.map(({ name, icon, tooltipText }) => (
            <Tooltip content={tooltipText} key={name}>
              <IconButton
                size="3"
                variant={selectedTool === name ? "solid" : "outline"}
                radius="none"
                onClick={() => setSelectedTool(name as Tool)}
              >
                <Icon name={icon} size="lg" />
              </IconButton>
            </Tooltip>
          ))}
        </div>
        <div
          className={css({
            flex: 1,
            display: "flex",
            justifyContent: "center",
          })}
        >
          <TemplateNameButton initalName={initalName} />
        </div>
        <div
          className={css({
            gap: "var(--space-2)",
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          })}
        >
          <Button variant="outline">Use image</Button>
          <Button>Preview</Button>
        </div>
      </div>
    </header>
  );
};

export const validator = withZod(
  z.object({
    templateName: z
      .string()
      .min(1, { message: "Template name is required" })
      .max(100, {
        message: "Template name can't be longer than 100 characters",
      })
      .regex(/^[a-zA-Z0-9_.-]*$/, {
        message:
          "Template name can only contain letters, numbers, and the characters . _ -",
      }),
  })
);

type TemplateNameButtonProps = {
  initalName: string;
};

const TemplateNameButton = ({ initalName }: TemplateNameButtonProps) => {
  const [templateName, setTemplateName] = useState(initalName);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button
          className={css({
            border: "none",
            outline: "none",
            textAlign: "center",
            fontSize: "var(--font-size-3)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-text)",
            backgroundColor: "transparent",
            cursor: "text",
          })}
        >
          {templateName}
        </button>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: 460 }}>
        <Dialog.Title>Edit template name</Dialog.Title>

        <ValidatedForm
          validator={validator}
          method="post"
          defaultValues={{
            templateName: templateName,
          }}
        >
          <div
            className={css({
              spaceY: "3",
            })}
          >
            <Callout.Root>
              <Callout.Icon>
                <Icon name="info" />
              </Callout.Icon>
              <Callout.Text>
                Please change the template name in your code after you changed
                it here.
              </Callout.Text>
            </Callout.Root>{" "}
            <FormInput name="templateName" placeholder="template-name" />
          </div>

          <div
            className={css({
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "4",
            })}
          >
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit">Save template</Button>
          </div>
        </ValidatedForm>
      </Dialog.Content>
    </Dialog.Root>
  );
};

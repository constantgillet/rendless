import {
  Badge,
  Box,
  Button,
  Callout,
  Dialog,
  IconButton,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Link } from "@remix-run/react";
import { css } from "styled-system/css";
import { grid, gridItem } from "styled-system/patterns";
import { getPublicEnv } from "~/utils/getPublicEnv";
import { Icon } from "./Icon";
import toast from "react-hot-toast";

type UseTemplateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string;
  variables: string[];
};

export const UseTemplateDialog = ({
  templateId,
  variables,
  open,
  onOpenChange,
}: UseTemplateDialogProps) => {
  const imageRenderUrl = `${getPublicEnv(
    "WEBSITE_URL"
  )}/api/simple-url/${templateId}`;

  const onClickCopyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable);
    toast.success(`Copied ${variable} to clipboard`);
  };

  const onClickCopyLink = () => {
    navigator.clipboard.writeText(imageRenderUrl);
    toast.success("Copied link to clipboard");
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content width={"100%"} maxWidth="1000px">
        <Dialog.Title>Use template</Dialog.Title>
        <Dialog.Description size="2">
          You can use this template to generate images.
        </Dialog.Description>
        <div className={grid({ columns: 12, gap: 6, mt: "24px" })}>
          <div className={gridItem({ colSpan: 6 })}>
            <img
              src={`/api/simple-url/${templateId}?draft=true`}
              width={"464"}
              height={"243"}
              alt="Og  template"
              className={css({
                borderRadius: "8px",
              })}
            />
          </div>
          <div className={gridItem({ colSpan: 6, spaceY: "4" })}>
            <div>
              <label
                className={css({
                  fontSize: "14px",
                  color: "var(--gray-11)",
                  fontWeight: "medium",
                  mb: "12px",
                })}
              >
                Image generation url:
              </label>
              <TextField.Root disabled value={imageRenderUrl} size="3">
                <TextField.Slot>
                  <div />
                </TextField.Slot>
                <TextField.Slot>
                  <IconButton size="1" onClick={onClickCopyLink}>
                    <Icon
                      name="copy"
                      size="lg"
                      className={css({
                        cursor: "pointer",
                      })}
                    />
                  </IconButton>
                </TextField.Slot>
              </TextField.Root>
            </div>
            <div
              className={css({
                spaceY: "2",
              })}
            >
              <Callout.Root size={"1"} color="gray">
                <Callout.Icon>
                  <Icon name="info" />
                </Callout.Icon>
                <Callout.Text>
                  You can use these variables in your template{" "}
                  <Link
                    to="/docs/variables"
                    target="_blank"
                    className={css({
                      color: "var(--accent-9)",
                      textDecoration: "underline",
                      cursor: "pointer",
                    })}
                  >
                    Learn more
                  </Link>
                </Callout.Text>
              </Callout.Root>
              <div>
                <Text size="2" color="gray">
                  Variables found in the template:
                </Text>
                <div
                  className={css({
                    display: "flex",
                    gap: "4px",
                    width: "100%",
                    flexWrap: "wrap",
                  })}
                >
                  {variables.map((variable) => (
                    <Badge key={variable} size="1" color="green">
                      {variable}
                      <Icon
                        name="copy"
                        size="lg"
                        className={css({
                          cursor: "pointer",
                        })}
                        onClick={() => onClickCopyVariable(variable)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Link
                to="/docs/variables"
                target="_blank"
                className={css({
                  color: "var(--accent-9)",
                  textDecoration: "underline",
                  cursor: "pointer",
                })}
              >
                Learn more about how to render images
              </Link>
            </div>
          </div>
        </div>
        <div
          className={css({
            display: "flex",
            justifyContent: "flex-end",
            mt: "24px",
            gap: "2",
          })}
        >
          <Dialog.Close>
            <Button size="2">Close and continue</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

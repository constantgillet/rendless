import { AlertDialog, Button } from "@radix-ui/themes";
import { useFetcher } from "@remix-run/react";
import { css } from "styled-system/css";
import { action as deleteAction } from "~/routes/api.delete-template";
import { Spinner } from "./Spinner";

type DeleteTemplateModalProps = {
  templateId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteTemplateModal = ({
  templateId,
  open,
  onOpenChange,
}: DeleteTemplateModalProps) => {
  const fetcher = useFetcher<typeof deleteAction>();

  const onClick = () => {
    fetcher.submit(
      {
        templateId: templateId,
      },
      {
        action: "/api/delete-template",
        method: "POST",
      }
    );
  };

  return (
    <>
      <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
        <AlertDialog.Content style={{ maxWidth: 382 }}>
          <AlertDialog.Title>Delete template</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure you want to delete this template? You can{"'"}t undo
            this action and the template will be lost forever.
          </AlertDialog.Description>

          <div
            className={css({
              display: "flex",
              mt: "24px",
              gap: "2",
              justifyContent: "flex-end",
            })}
          >
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <Button
              variant="solid"
              color="red"
              onClick={onClick}
              disabled={
                fetcher.state === "loading" || fetcher.state === "submitting"
              }
            >
              {fetcher.state === "loading" ||
                (fetcher.state === "submitting" && <Spinner />)}
              Delete template
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

import { ContextMenu } from "@radix-ui/themes";
import { useEffect } from "react";
import { useEditorStore } from "~/stores/EditorStore";

type CanvasContextMenuProps = {
  children: React.ReactNode;
};

export const CanvasContextMenu = (props: CanvasContextMenuProps) => {
  const selectedItems = useEditorStore((state) => state.selected);
  const deleteElements = useEditorStore((state) => state.deleteElements);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger disabled={selectedItems?.length === 0}>
        {props.children}
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="⌘ C">Copy</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="]">Bring to front</ContextMenu.Item>
        <ContextMenu.Item shortcut="[">Send to back</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item
          shortcut="suppr"
          color="red"
          onClick={() => {
            deleteElements(selectedItems);
          }}
        >
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

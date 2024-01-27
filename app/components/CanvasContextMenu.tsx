import { ContextMenu } from "@radix-ui/themes";
import { useEffect } from "react";
import { useEditorStore } from "~/stores/EditorStore";
import { getElementsIndexPositions } from "~/utils/getElementsIndexPositions";

type CanvasContextMenuProps = {
  children: React.ReactNode;
};

export const CanvasContextMenu = (props: CanvasContextMenuProps) => {
  const selectedItems = useEditorStore((state) => state.selected);
  const deleteElements = useEditorStore((state) => state.deleteElements);
  const moveIndexPosition = useEditorStore((state) => state.moveIndexPosition);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const onClickBringToFront = () => {
    const indexPositions = getElementsIndexPositions(selectedItems);

    //Get the highest index position
    let highestIndexPosition = 0;

    indexPositions.forEach((indexPosition) => {
      if (indexPosition.position > highestIndexPosition) {
        highestIndexPosition = indexPosition.position;
      }
    });

    const newPosition = highestIndexPosition + 1;

    moveIndexPosition(selectedItems, newPosition);
  };

  const onClickSendToBack = () => {
    const indexPositions = getElementsIndexPositions(selectedItems);

    //Get the lowest index position
    let lowestIndexPosition = 0;

    indexPositions.forEach((indexPosition) => {
      if (indexPosition.position < lowestIndexPosition) {
        lowestIndexPosition = indexPosition.position;
      }
    });

    const newPosition = lowestIndexPosition - 1;
    moveIndexPosition(selectedItems, newPosition);
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger disabled={selectedItems?.length === 0}>
        {props.children}
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="⌘ C">Copy</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="]" onClick={onClickBringToFront}>
          Bring to front
        </ContextMenu.Item>
        <ContextMenu.Item shortcut="[" onClick={onClickSendToBack}>
          Send to back
        </ContextMenu.Item>
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

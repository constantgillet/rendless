import { ContextMenu } from "@radix-ui/themes";
import { type ReactNode, useEffect } from "react";
import { useEditorStore } from "~/stores/EditorStore";
import { bringElementsToFront } from "~/stores/actions/bringElementsToFront";
import { sendElementsToBack } from "~/stores/actions/sendElementsToBack";

type CanvasContextMenuProps = {
	children: ReactNode;
};

export const CanvasContextMenu = (props: CanvasContextMenuProps) => {
	const selectedItems = useEditorStore((state) => state.selected);
	const deleteElements = useEditorStore((state) => state.deleteElements);
	const undo = useEditorStore((state) => state.undo);
	const redo = useEditorStore((state) => state.redo);

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
		bringElementsToFront();
	};

	const onClickSendToBack = () => {
		sendElementsToBack();
	};

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger>{props.children}</ContextMenu.Trigger>
			<ContextMenu.Content>
				{/* <ContextMenu.Item shortcut="⌘ C">Copy</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item> */}
				<ContextMenu.Item shortcut="Ctrl + z" onClick={undo}>
					Undo
				</ContextMenu.Item>
				<ContextMenu.Item shortcut="Ctrl + shift + z" onClick={redo}>
					Redo
				</ContextMenu.Item>
				{selectedItems.length >= 1 ? (
					<>
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
					</>
				) : null}
			</ContextMenu.Content>
		</ContextMenu.Root>
	);
};

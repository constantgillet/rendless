import type React from "react";
import { type HTMLProps, forwardRef, useEffect, useRef } from "react";
import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { useEditorStore } from "../stores/EditorStore";
import { useScaleStore } from "../stores/ScaleStore";
import { TextElement } from "./TextElement";
import { CanvasContextMenu } from "./CanvasContextMenu";
import InfiniteViewer from "react-infinite-viewer";
import Moveable, {
	type OnDragGroup,
	type OnResize,
	type OnDrag,
	type OnResizeGroup,
	type OnRotateGroup,
} from "react-moveable";
import Selecto from "react-selecto";
import { useKeepRatioStore } from "~/stores/KeepRatioStore";
import type { Rect } from "selecto";
import { v4 as uuidv4 } from "uuid";
import { RectElement } from "./RectElement";
import { defaultElements } from "~/constants/defaultElements";
import { ImageElement } from "./ImageElement";
import { saveCurrentElementsToHistory } from "~/stores/actions/saveCurrentElementsToHistory";
import type { Element } from "~/stores/elementTypes";

type Props = HTMLProps<HTMLDivElement> & {
	infiniteViewer: React.RefObject<InfiniteViewer>;
};

const componentElementMap = {
	rect: RectElement,
	text: TextElement,
	image: ImageElement,
};

export const FramePage = (props: Props) => {
	const tree = useEditorStore((state) => state.tree);
	const scale = useScaleStore((state) => state.scale);
	const selectedTool = useEditorStore((state) => state.selectedTool);

	const increaseScale = useScaleStore((state) => state.increase);
	const decreaseScale = useScaleStore((state) => state.decrease);

	const infiniteViewer = props.infiniteViewer;
	const container = useRef<HTMLDivElement>(null);

	const selectedTargets = useEditorStore((state) => state.selected);

	const onWheel = (e: WheelEvent) => {
		//Zoom in
		if (e.ctrlKey && e.deltaY < 0) {
			increaseScale(0.02);
		}

		//Zoom out
		if (e.ctrlKey && e.deltaY > 0) {
			decreaseScale(0.02);
		}
	};

	const selecto = useRef<Selecto>(null);
	const moveableManager = useRef<Moveable>(null);

	const setSelectedTargets = useEditorStore((state) => state.setSelected);
	const addElement = useEditorStore((state) => state.addElement);
	const setSelectedTool = useEditorStore((state) => state.setSelectedTool);
	const updateElements = useEditorStore((state) => state.updateElements);
	const isPressingShift = useKeepRatioStore((state) => state.keepRatio);

	useEffect(() => {
		moveableManager.current!.updateRect();
	}, [tree.children, scale]);

	const checkBlur = () => {
		const activeElement = document.activeElement;
		if (activeElement) {
			(activeElement as HTMLElement).blur();
		}
		const selection = document.getSelection()!;

		// console.log("selection", selection);

		if (selection) {
			selection.removeAllRanges();
		}
		// this.eventBus.trigger("blur");
	};

	const selectEndMaker = (rect: Rect) => {
		if (selectedTool === "select") {
			return false;
		}

		const containerRect = container.current!.getBoundingClientRect();

		//Set x and y with scale factor
		const x = Math.round((rect.left - containerRect.left) / scale);
		const y = Math.round((rect.top - containerRect.top) / scale);

		const width = Math.round(rect.width / scale);
		const height = Math.round(rect.height / scale);

		const defaultElement = defaultElements[selectedTool];

		const newElement: Element = {
			...defaultElement,
			id: uuidv4(),
			x,
			y,
			width,
			height,
		};

		addElement(newElement);
		setSelectedTargets([newElement.id]); //TODO select new element
		setSelectedTool("select");
		return true;
	};

	const selectedTargetsElements = selectedTargets.map((id) =>
		container.current?.querySelector<HTMLElement | SVGElement>(
			`[${DATA_SCENA_ELEMENT_ID}="${id}"]`,
		),
	);

	const onDragGroup = (dragEvent: OnDragGroup) => {
		const { targets, events } = dragEvent;

		const elements = [];

		for (let i = 0; i < targets.length; ++i) {
			const target = targets[i];

			const event = events[i];

			if (event.transform && typeof event?.transform !== "undefined") {
				target.style.transform = event.transform;
			}

			const element = {
				id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
				x: Math.round(event.translate[0]),
				y: Math.round(event.translate[1]),
			};

			elements.push(element);
		}
		updateElements(elements, false);
	};

	const onDrag = (dragEvent: OnDrag) => {
		const { target, translate } = dragEvent;

		const x = Math.round(translate[0]);
		const y = Math.round(translate[1]);

		const element = {
			id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
			x: x,
			y: y,
		};

		target!.style.transform = dragEvent.transform;
		updateElements([element], false);
	};

	const onResize = (resizeEvent: OnResize) => {
		const { target, width, height, delta, drag } = resizeEvent;

		delta[0] && (target!.style.width = `${Math.round(width)}px`);
		delta[1] && (target!.style.height = `${Math.round(height)}px`);
		target!.style.transform = drag.transform;

		const element = {
			id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
			width: width,
			height: height,
			x: Math.round(drag.translate[0]),
			y: Math.round(drag.translate[1]),
		};

		updateElements([element], false);
	};

	const onResizeGroup = (e: OnResizeGroup) => {
		const { events } = e;

		const elements = [];

		for (let i = 0; i < events.length; ++i) {
			const event = events[i];
			const target = event.target;

			event.target.style.width = `${event.width}px`;
			event.target.style.height = `${event.height}px`;
			event.target.style.transform = event.drag.transform;

			//Set x and y with scale factor
			const x = Math.round(event.drag.translate[0]);
			const y = Math.round(event.drag.translate[1]);

			const element = {
				id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
				x: x,
				y: y,
				width: Math.round(event.width / scale),
				height: Math.round(event.height / scale),
			};

			elements.push(element);
		}
		updateElements(elements, false);
	};

	const onRotateGroup = (e: OnRotateGroup) => {
		const { events } = e;

		const elements = [];
		for (let i = 0; i < events.length; ++i) {
			const event = events[i];
			const target = event.target;

			event.target.style.transform = event.drag.transform;

			const element = {
				id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
				rotate: event.rotation,
				x: Math.round(event.drag.translate[0]),
				y: Math.round(event.drag.translate[1]),
			};

			elements.push(element);
		}
		//TODO
		updateElements(elements, false);
	};

	//Add the oposite zoom of scale
	const opositeZoom = 1 / scale;

	return (
		<CanvasContextMenu>
			<div
				onWheel={onWheel}
				className={css({
					flex: 1,
				})}
			>
				<InfiniteViewer
					ref={infiniteViewer}
					// useMouseDrag={true}
					zoom={scale}
					className={cx(
						"scena-viewer",
						css({
							width: "100%",
							height: "100%",
						}),
					)}
				>
					<div
						className={cx(
							"scena-viewport",
							css({
								width: "100%",
								height: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}),
						)}
					>
						<Moveable
							zoom={opositeZoom}
							ref={moveableManager}
							targets={selectedTargetsElements}
							snappable={true}
							/* Resize event edges */
							edge={false}
							/* draggable */
							draggable={true}
							// throttleDrag={0}
							onDrag={(e) => onDrag(e)}
							onDragEnd={saveCurrentElementsToHistory}
							onDragGroup={(e) => onDragGroup(e)}
							onDragGroupEnd={saveCurrentElementsToHistory}
							/* When resize or scale, keeps a ratio of the width, height. */
							keepRatio={isPressingShift}
							/* resizable*/
							/* Only one of resizable, scalable, warpable can be used. */
							resizable={true}
							onResize={(e) => onResize(e)}
							onResizeEnd={saveCurrentElementsToHistory}
							onResizeGroup={(e) => onResizeGroup(e)}
							onResizeGroupEnd={saveCurrentElementsToHistory}
							rotatable={true}
							onRotate={(e) => {
								e.target.style.transform = e.drag.transform;

								const element = {
									id: e.target.getAttribute(DATA_SCENA_ELEMENT_ID)!,
									rotate: e.absoluteRotation,
								};

								updateElements([element], false);
							}}
							onRotateEnd={saveCurrentElementsToHistory}
							onRotateGroup={(e) => onRotateGroup(e)}
							onRotateGroupEnd={saveCurrentElementsToHistory}
							onClickGroup={(e) => {
								if (e.isTrusted) {
									selecto.current?.clickTarget(e.inputEvent, e.moveableTarget);
								}
							}}
						/>
						<div
							ref={container}
							className={cx(
								css({
									// aspectRatio: "1.91/1",
									backgroundColor: "gray.300",
									position: "relative",
									flexShrink: 0,
									// marginX: "auto",w²
								}),
							)}
							style={{
								width: 1200,
								height: 630,
								cursor: selectedTool === "select" ? "auto" : "crosshair",
								backgroundColor: tree.backgroundColor,
							}}
						>
							{tree?.children?.map((child) => {
								const id = child.id;

								const ElementComponent = componentElementMap[child.type];

								if (!ElementComponent) {
									return null;
								}

								return <ElementComponent key={id} {...child} />;
							})}
						</div>
					</div>
				</InfiniteViewer>
				<Selecto
					ref={selecto}
					dragContainer={".scena-viewer"}
					hitRate={0}
					selectableTargets={[`.scena-viewport [${DATA_SCENA_ELEMENT_ID}]`]}
					selectByClick={true}
					preventDragFromInside={true}
					selectFromInside={true}
					toggleContinueSelect={["shift"]}
					preventDefault={true}
					// scrollOptions={
					//   infiniteViewer.current
					//     ? {
					//         container: infiniteViewer.current.getContainer(),
					//         threshold: 30,
					//         throttleTime: 30,
					//         getScrollPosition: () => {
					//           const current = infiniteViewer.current!;
					//           return [current.getScrollLeft(), current.getScrollTop()];
					//         },
					//       }
					//     : undefined
					// }
					// onScroll={({ direction }) => {
					//   console.log(direction);
					//   // infiniteViewer.current!.scrollBy(
					//   //   direction[0] * 10,
					//   //   direction[1] * 10
					//   // );
					// }}
					onDragStart={(e) => {
						const inputEvent = e.inputEvent;
						const target = inputEvent.target;

						checkBlur();
						// if (target.isContentEditable) {
						//   const contentElement = getContentElement(target);

						//   if (
						//     contentElement &&
						//     contentElement.hasAttribute(DATA_SCENA_ELEMENT_ID)
						//   ) {
						//     e.stop();
						//     const id = contentElement.getAttribute(DATA_SCENA_ELEMENT_ID)!;
						//     setSelectedTargets([id]);
						//   }
						// }
						if (
							(inputEvent.type === "touchstart" && e.isTrusted) ||
							moveableManager.current!.isMoveableElement(target) ||
							selectedTargetsElements.some(
								(t) => t === target || t?.contains(target),
							)
						) {
							e.stop();
						}
					}}
					onSelectEnd={({ isDragStart, selected, inputEvent, rect }) => {
						if (isDragStart) {
							inputEvent.preventDefault();
						}

						// create new element
						if (selectEndMaker(rect)) {
							return;
						}

						// console.log("selected", selected);
						const ids = getIdsFromElements(selected);
						setSelectedTargets(ids);

						// this.setSelectedTargets(selected).then(() => {
						//   if (!isDragStart) {
						//     return;
						//   }
						//   moveableManager.current!.getMoveable().dragStart(inputEvent);
						// });
					}}
					onKeydown={(e) => console.log("onKeydown", e)}
				/>
			</div>
		</CanvasContextMenu>
	);
};

const getIdsFromElements = (targets: (HTMLElement | SVGElement)[]) => {
	return targets.map((t) => t.getAttribute(DATA_SCENA_ELEMENT_ID)!);
};

function getContentElement(el: HTMLElement): HTMLElement | null {
	if (el.contentEditable === "inherit") {
		return getContentElement(el.parentElement!);
	}
	if (el.contentEditable === "true") {
		return el;
	}
	return null;
}

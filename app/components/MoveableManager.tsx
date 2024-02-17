import { useEffect, useRef } from "react";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { ElementType, useEditorStore } from "../stores/EditorStore";
import { useScaleStore } from "../stores/ScaleStore";
import Moveable, {
  OnDrag,
  OnDragEnd,
  OnDragGroup,
  OnDragGroupEnd,
  OnResize,
  OnScale,
} from "react-moveable";
import Selecto from "react-selecto";
import { Rect } from "selecto";
import { v4 as uuidv4 } from "uuid";
import { useKeepRatioStore } from "~/stores/KeepRatioStore";

type MoveableManagerProps = {
  container: React.RefObject<HTMLDivElement>;
};

export const MoveableManager = (props: MoveableManagerProps) => {
  const container = props.container;

  const selecto = useRef<Selecto>(null);
  const moveableManager = useRef<Moveable>(null);
  const selectedTargets = useEditorStore((state) => state.selected);
  const selectedTool = useEditorStore((state) => state.selectedTool);
  const scale = useScaleStore((state) => state.scale);

  const setSelectedTargets = useEditorStore((state) => state.setSelected);
  const addElement = useEditorStore((state) => state.addElement);
  const updateElement = useEditorStore((state) => state.updateElement);
  const setSelectedTool = useEditorStore((state) => state.setSelectedTool);
  const updateElements = useEditorStore((state) => state.updateElements);
  const tree = useEditorStore((state) => state.tree);
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

    console.log("selection", selection);

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

    const newElement: ElementType = {
      id: uuidv4(),
      type: selectedTool,
      x: x,
      y: y,
      width: width,
      height: height,
      backgroundColor: selectedTool === "rect" ? "#9b9b9b" : undefined,
      content: selectedTool === "text" ? "" : undefined,
      color: selectedTool === "text" ? "#000000" : undefined,
      fontSize: selectedTool === "text" ? 18 : undefined,
      fontFamily: selectedTool === "text" ? "Inter" : undefined,
      fontWeight: selectedTool === "text" ? 400 : undefined,
      fontStyle: selectedTool === "text" ? "normal" : undefined,
      textAlign: selectedTool === "text" ? "left" : undefined,
      borderTopLeftRadius: selectedTool === "rect" ? 0 : undefined,
      borderTopRightRadius: selectedTool === "rect" ? 0 : undefined,
      borderBottomLeftRadius: selectedTool === "rect" ? 0 : undefined,
      borderBottomRightRadius: selectedTool === "rect" ? 0 : undefined,
    };

    addElement(newElement);
    setSelectedTargets([newElement.id]); //TODO select new element
    setSelectedTool("select");
    return true;
  };

  const selectedTargetsElements = selectedTargets.map((id) =>
    container.current?.querySelector<HTMLElement | SVGElement>(
      `[${DATA_SCENA_ELEMENT_ID}="${id}"]`
    )
  );

  const moveableContainer = useRef<HTMLDivElement>(null);

  const onDragGroup = (
    dragEvent: OnDragGroup | OnDragGroupEnd,
    isEnd = false
  ) => {
    const { targets, events } = dragEvent;

    const elements = [];
    const containerRect = container.current!.getBoundingClientRect();

    for (let i = 0; i < targets.length; ++i) {
      const target = targets[i];

      const targetRect = target!.getBoundingClientRect();

      const event = events[i];

      if (event.transform && typeof event?.transform !== "undefined") {
        target.style.transform = event.transform;
      }

      //Set x and y with scale factor
      const x = Math.round((targetRect.x - containerRect.x) / scale);
      const y = Math.round((targetRect.y - containerRect.y) / scale);

      const element = {
        id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
        x: x,
        y: y,
      };

      elements.push(element);
    }
    updateElements(elements, isEnd ? true : false);
  };

  const onDrag = (
    //dragEvent: OnDrag
    dragEvent: OnDrag,
    isEnd = false
  ) => {
    const { target } = dragEvent;

    const containerRect = container.current!.getBoundingClientRect();
    const targetRect = target!.getBoundingClientRect();
    const x = Math.round((targetRect.x - containerRect.x) / scale);
    const y = Math.round((targetRect.y - containerRect.y) / scale);

    const element = {
      id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
      x: x,
      y: y,
    };

    target!.style.transform = dragEvent.transform;
    updateElements([element], isEnd ? true : false);
  };

  const onResize = (resizeEvent: OnResize, isEnd = false) => {
    const { target, width, height, delta, drag } = resizeEvent;

    delta[0] && (target!.style.width = `${Math.round(width)}px`);
    delta[1] && (target!.style.height = `${Math.round(height)}px`);
    target!.style.transform = drag.transform;

    const targetRect = target!.getBoundingClientRect();

    const element = {
      id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
      width: Math.round(targetRect.width / scale),
      height: Math.round(targetRect.height / scale),
      x: Math.round(
        (targetRect.x - container.current!.getBoundingClientRect().x) / scale
      ),
      y: Math.round(
        (targetRect.y - container.current!.getBoundingClientRect().y) / scale
      ),
    };

    updateElements([element], isEnd ? true : false);
  };

  return (
    <>
      <div ref={moveableContainer}></div>
      <Moveable
        ref={moveableManager}
        targets={selectedTargetsElements}
        container={moveableContainer.current}
        // /* Resize event edges */
        // edge={false}
        // /* draggable */
        draggable={true}
        // throttleDrag={0}
        onDrag={(e) => onDrag(e, false)}
        onDragEnd={(e) => onDrag(e, true)}
        onDragGroup={(e) => onDragGroup(e, false)}
        onDragGroupEnd={(e) => onDragGroup(e, true)}
        /* When resize or scale, keeps a ratio of the width, height. */
        keepRatio={isPressingShift}
        /* resizable*/
        /* Only one of resizable, scalable, warpable can be used. */
        resizable={true}
        onResize={(e) => onResize(e, false)}
        onResizeEnd={({ target, isDrag, clientX, clientY }) => {
          const targetRect = target!.getBoundingClientRect();

          const element = {
            id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
            width: Math.round(targetRect.width / scale),
            height: Math.round(targetRect.height / scale),
          };

          updateElements([element], true);
        }}
      />
      <Selecto
        ref={selecto}
        dragContainer={".scena-viewer"}
        selectableTargets={[".scena-viewer .target"]}
        hitRate={0}
        selectableTargets={[`.scena-viewer [${DATA_SCENA_ELEMENT_ID}]`]}
        selectByClick={true}
        selectFromInside={false}
        toggleContinueSelect={["shift"]}
        preventDefault={true}
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
              (t) => t === target || t?.contains(target)
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

          console.log("selected", selected);
          const ids = getIdsFromElements(selected);
          setSelectedTargets(ids);

          // this.setSelectedTargets(selected).then(() => {
          //   if (!isDragStart) {
          //     return;
          //   }
          //   moveableManager.current!.getMoveable().dragStart(inputEvent);
          // });
        }}
      />
    </>
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

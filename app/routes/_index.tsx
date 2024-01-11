import type { MetaFunction } from "@remix-run/node";
import { css, cx } from "styled-system/css";
import Moveable, { OnDrag, OnResize, OnScale } from "react-moveable";
import Selecto from "react-selecto";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { PropertiesPanel } from "~/components/PropertiesPanel";
import { TopBar } from "~/components/TopBar";
import { LayersPanel } from "~/components/LayersPanel";
import { ElementType, Tree, useEditorStore } from "~/components/EditorStore";
import { v4 as uuidv4 } from "uuid";
import { Rect } from "selecto";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { FramePage } from "~/components/FramePage";
import { EditorHotKeys } from "~/components/EditorHotKeys";
import { useScaleStore } from "~/components/ScaleStore";
import "../contents/fontInfo.json";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const selecto = useRef<Selecto>(null);
  const container = useRef<HTMLDivElement>(null);
  const moveableManager = useRef<Moveable>(null);
  const selectedTargets = useEditorStore((state) => state.selected);
  const selectedTool = useEditorStore((state) => state.selectedTool);
  const scale = useScaleStore((state) => state.scale);

  const setSelectedTargets = useEditorStore((state) => state.setSelected);
  const addElement = useEditorStore((state) => state.addElement);
  const updateElement = useEditorStore((state) => state.updateElement);
  const setSelectedTool = useEditorStore((state) => state.setSelectedTool);
  const tree = useEditorStore((state) => state.tree);

  useEffect(() => {
    moveableManager.current!.updateRect();
  }, [tree.chilren]);

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

  if (typeof document === "undefined") {
    return null;
  }

  const selectedTargetsElements = selectedTargets.map((id) =>
    container.current!.querySelector<HTMLElement | SVGElement>(
      `[${DATA_SCENA_ELEMENT_ID}="${id}"]`
    )
  );

  return (
    <>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          lineHeight: "1.8",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TopBar />
        <div
          className={css({
            flex: 1,
            display: "flex",
            overflow: "hidden",
            position: "relative",
          })}
        >
          <LayersPanel />
          <FramePage ref={container} />
          <PropertiesPanel />
        </div>
      </div>

      <Moveable
        ref={moveableManager}
        targets={selectedTargetsElements}
        container={null}
        origin={true}
        /* Resize event edges */
        edge={false}
        /* draggable */
        draggable={true}
        throttleDrag={0}
        // onDragStart={({ target, clientX, clientY }) => {
        //   console.log("onDragStart", target);

        //   const containerRect = container.current!.getBoundingClientRect();

        //   //Set x and y with scale factor
        //   const x = (clientX - containerRect.left) / scale;
        //   const y = (clientY - containerRect.top) / scale;
        // }}
        // dragContainer={container.current}
        onDrag={({
          target,
          beforeDelta,
          beforeDist,
          left,
          top,
          right,
          bottom,
          delta,
          dist,
          transform,
          clientX,
          clientY,
        }: OnDrag) => {
          target!.style.transform = transform;
          const containerRect = container.current!.getBoundingClientRect();
          const targetRect = target!.getBoundingClientRect();

          //Set x and y with scale factor
          const x = Math.round((targetRect.x - containerRect.x) / scale);
          const y = Math.round((targetRect.y - containerRect.y) / scale);

          const element = {
            id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
            x: x,
            y: y,
          };

          updateElement(element);
        }}
        // onDragEnd={({ target }) => {
        //   const containerRect = container.current!.getBoundingClientRect();
        //   const targetRect = target!.getBoundingClientRect();

        //   //Set x and y with scale factor
        //   const x = (targetRect.x - containerRect.x) / scale;
        //   const y = (targetRect.y - containerRect.y) / scale;

        //   console.log({ x, y });

        //   const element = {
        //     id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
        //     x: x,
        //     y: y,
        //   };

        //   updateElement(element);
        // }}
        onDragGroup={({ targets, events }) => {
          for (let i = 0; i < targets.length; ++i) {
            const target = targets[i];
            const event = events[i];
            target.style.transform = event.transform;
          }
        }}
        /* When resize or scale, keeps a ratio of the width, height. */
        // keepRatio={true}
        /* resizable*/
        /* Only one of resizable, scalable, warpable can be used. */
        resizable={true}
        throttleResize={0}
        // onResizeStart={({ target, clientX, clientY }) => {
        //   console.log("onResizeStart", target);
        // }}
        onResize={({
          target,
          width,
          height,
          dist,
          delta,
          direction,
          clientX,
          clientY,
        }: OnResize) => {
          delta[0] && (target!.style.width = `${Math.round(width)}px`);
          delta[1] && (target!.style.height = `${Math.round(height)}px`);

          const targetRect = target!.getBoundingClientRect();

          const element = {
            id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
            width: Math.round(targetRect.width / scale),
            height: Math.round(targetRect.height / scale),
          };

          updateElement(element);
        }}
        // onResizeEnd={({ target, isDrag, clientX, clientY }) => {
        //   console.log("onResizeEnd", target, isDrag);

        //   const targetRect = target!.getBoundingClientRect();

        //   const element = {
        //     id: target!.getAttribute(DATA_SCENA_ELEMENT_ID)!,
        //     width: targetRect.width / scale,
        //     height: targetRect.height / scale,
        //   };

        //   updateElement(element as Tree);
        // }}
        /* scalable */
        /* Only one of resizable, scalable, warpable can be used. */
        scalable={true}
        throttleScale={0}
        onScaleStart={({ target, clientX, clientY }) => {
          console.log("onScaleStart", target);
        }}
        onScale={({
          target,
          scale,
          dist,
          delta,
          transform,
          clientX,
          clientY,
        }: OnScale) => {
          console.log("onScale scale", scale);
          target!.style.transform = transform;
        }}
        onScaleEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onScaleEnd", target, isDrag);
        }}
        /* rotatable */
        throttleRotate={0}
        onRotateStart={({ target, clientX, clientY }) => {
          console.log("onRotateStart", target);
        }}
        // Enabling pinchable lets you use events that
        // can be used in draggable, resizable, scalable, and rotateable.
        pinchable={true}
        onPinchStart={({ target, clientX, clientY, datas }) => {
          // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
          console.log("onPinchStart");
        }}
        onPinch={({ target, clientX, clientY, datas }) => {
          // pinch event occur before drag, rotate, scale, resize
          console.log("onPinch");
        }}
        onPinchEnd={({ isDrag, target, clientX, clientY, datas }) => {
          // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
          console.log("onPinchEnd");
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
      <EditorHotKeys />
    </>
  );
}

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

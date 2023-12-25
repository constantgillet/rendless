import type { MetaFunction } from "@remix-run/node";
import { css, cx } from "styled-system/css";
import Moveable, { OnDrag, OnResize, OnScale } from "react-moveable";
import Selecto from "react-selecto";
import { useRef, useState } from "react";
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
import { Tree, useEditorStore } from "~/components/EditorStore";
import { v4 as uuidv4 } from "uuid";
import { Rect } from "selecto";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { FramePage } from "~/components/FramePage";
import { EditorHotKeys } from "~/components/EditorHotKeys";

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

  const setSelectedTargets = useEditorStore((state) => state.setSelected);
  const addElement = useEditorStore((state) => state.addElement);
  const setSelectedTool = useEditorStore((state) => state.setSelectedTool);

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

    const newElement: Tree = {
      id: uuidv4(),
      type: selectedTool,
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
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
        onDragStart={({ target, clientX, clientY }) => {
          console.log("onDragStart", target);
        }}
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
          console.log("onDrag left, top", left, top);
          // target!.style.left = `${left}px`;
          // target!.style.top = `${top}px`;
          console.log("onDrag translate", dist);
          target!.style.transform = transform;
        }}
        onDragEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onDragEnd", target, isDrag);
        }}
        /* When resize or scale, keeps a ratio of the width, height. */
        // keepRatio={true}
        /* resizable*/
        /* Only one of resizable, scalable, warpable can be used. */
        resizable={true}
        throttleResize={0}
        onResizeStart={({ target, clientX, clientY }) => {
          console.log("onResizeStart", target);
        }}
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
          console.log("onResize", target);
          delta[0] && (target!.style.width = `${width}px`);
          delta[1] && (target!.style.height = `${height}px`);
        }}
        onResizeEnd={({ target, isDrag, clientX, clientY }) => {
          console.log("onResizeEnd", target, isDrag);
        }}
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

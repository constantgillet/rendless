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

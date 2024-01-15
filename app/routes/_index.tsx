import type { MetaFunction } from "@remix-run/node";
import { css } from "styled-system/css";
import { useRef } from "react";

import { PropertiesPanel } from "~/components/PropertiesPanel";
import { TopBar } from "~/components/TopBar";
import { LayersPanel } from "~/components/LayersPanel";
import { FramePage } from "~/components/FramePage";
import { EditorHotKeys } from "~/components/EditorHotKeys";
import "../contents/fontInfo.json";
import { FontLoader } from "~/components/FontLoader";
import { MoveableManager } from "~/components/MoveableManager";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const container = useRef<HTMLDivElement>(null);

  if (typeof document === "undefined") {
    return null;
  }

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
      <MoveableManager container={container} />
      <EditorHotKeys />
      <FontLoader />
    </>
  );
}

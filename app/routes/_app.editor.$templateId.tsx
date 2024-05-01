import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { css } from "styled-system/css";
import { useEffect, useRef } from "react";

import { PropertiesPanel } from "~/components/PropertiesPanel";
import { TopBar } from "~/components/TopBar";
import { LayersPanel } from "~/components/LayersPanel";
import { FramePage } from "~/components/FramePage";
import { EditorHotKeys } from "~/components/EditorHotKeys";
import "../contents/fontInfo.json";
import { FontLoader } from "~/components/FontLoader";
import { MoveableManager } from "~/components/MoveableManager";
import { prisma } from "~/libs/prisma";
import { ShouldRevalidateFunction, useLoaderData } from "@remix-run/react";
import { Tree, useEditorStore } from "~/stores/EditorStore";
import InfiniteViewer from "react-infinite-viewer";
import { useScaleStore } from "~/stores/ScaleStore";
import { defaultTree } from "~/constants/defaultTree";

export const meta: MetaFunction = () => {
  return [{ title: "Editor - Rendless" }];
};

export async function loader({
  context: { user },
  params,
}: LoaderFunctionArgs) {
  if (!user) {
    throw new Error("Not authenticated");
  }

  const templateId = params.templateId;

  if (!templateId) {
    throw new Error("Template name is required");
  }

  try {
    const templateData = await prisma.template.findFirst({
      where: { id: templateId },
    });

    if (!templateData) {
      throw new Error("Template not found");
    }

    if (templateData.userId !== user.id) {
      throw new Error("You don't have permission to access this template");
    }

    const template = {
      ...templateData,
      tree: templateData?.tree as unknown as Tree,
    };

    const isDraft =
      JSON.stringify(template.tree) !== JSON.stringify(template.prodTree);

    return json({ template, isDraft });
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching template");
  }
}

export default function Index() {
  const container = useRef<HTMLDivElement>(null);
  const { template, isDraft } = useLoaderData<typeof loader>();

  const infiniteViewer = useRef<InfiniteViewer>(null);

  if (typeof document === "undefined") {
    return null;
  }

  return (
    <>
      <TreeLoader tree={template.tree} />
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
        <TopBar
          initalName={template.name}
          templateId={template.id}
          isDraft={isDraft}
        />
        <div
          className={css({
            flex: 1,
            display: "flex",
            overflow: "hidden",
            position: "relative",
          })}
        >
          <LayersPanel />
          <FramePage ref={container} infiniteViewer={infiniteViewer} />
          <PropertiesPanel />
        </div>
      </div>
      <MoveableManager container={container} infiniteViewer={infiniteViewer} />
      <EditorHotKeys />
      <FontLoader />
    </>
  );
}

type TreeLoaderProps = {
  tree: Tree;
};

const TreeLoader = (props: TreeLoaderProps) => {
  const setTree = useEditorStore((state) => state.setTree);
  const setScale = useScaleStore((state) => state.setScale);
  const setSelected = useEditorStore((state) => state.setSelected);

  useEffect(() => {
    setTree(props.tree);

    return () => {
      reset();
      setSelected([]);
    };
  }, [props.tree, setTree]);

  const reset = () => {
    setTree(defaultTree);
    setScale(1);
  };

  return null;
};

export const shouldRevalidate = () => false;

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
import { useLoaderData } from "@remix-run/react";
import { Tree, useEditorStore } from "~/stores/EditorStore";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
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

    return json({ template });
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching template");
  }
}

export default function Index() {
  const container = useRef<HTMLDivElement>(null);
  const { template } = useLoaderData<typeof loader>();

  console.log(template);

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
        <TopBar initalName={template.name} />
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

type TreeLoaderProps = {
  tree: Tree;
};

const TreeLoader = (props: TreeLoaderProps) => {
  const setTree = useEditorStore((state) => state.setTree);

  useEffect(() => {
    setTree(props.tree);
  }, [props.tree, setTree]);

  return null;
};

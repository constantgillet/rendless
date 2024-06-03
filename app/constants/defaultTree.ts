import type { Tree } from "~/stores/EditorStore";

export const defaultTree: Tree = {
  x: 0,
  y: 0,
  id: "1",
  type: "page",
  width: 1200,
  height: 630,
  rotate: 1,
  children: [
    {
      x: 112,
      y: 287,
      id: "895fdefd-3b78-4d22-9d5f-892b4bf7c187",
      type: "text",
      color: "#0f0f0f",
      width: 968,
      height: 98,
      rotate: 0,
      content: "Hello {{name}}",
      fontSize: "76",
      fontStyle: "normal",
      textAlign: "center",
      variables: [],
      fontFamily: "Open Sans",
      fontWeight: 700,
      lineHeight: 1.5,
      textTransform: "none",
      textColorOpacity: 1,
    },
    {
      x: 222,
      y: 412,
      id: "9f181ca3-6ee6-4dcf-aeff-fcb1a24cad5a",
      type: "text",
      color: "#0a0a0a",
      width: 759,
      height: 172,
      rotate: 0,
      content: "This is your first template",
      fontSize: "42",
      fontStyle: "normal",
      textAlign: "center",
      variables: [],
      fontFamily: "Open Sans",
      fontWeight: 500,
      lineHeight: 1.5,
      textTransform: "none",
      textColorOpacity: 1,
    },
    {
      x: 529,
      y: 112,
      id: "0d31f776-b839-4648-b848-9e8b602fdc91",
      src: "https://dev.rendless.com/images/favicon-xl.png",
      type: "image",
      width: 149,
      height: 149,
      rotate: 0,
      objectFit: "cover",
      variables: [],
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  ],
  backgroundColor: "#dadada",
  backgroundOpacity: 1,
};

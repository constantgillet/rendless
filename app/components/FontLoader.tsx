import { Tree, useEditorStore } from "./EditorStore";
import fontContent from "../contents/fontInfo.json";
import { useEffect, useMemo, useRef } from "react";

export interface Font {
  category: string;
  name: string;
  sane: string;
  variants: Variant[];
}

export type Variant = FontVariant | string;

export interface FontVariant {
  italic: boolean;
  weight: number;
}

export interface FourFonts {
  regular?: number;
  bold?: number;
  italic?: number;
  boldItalic?: number;
}

const loadFontFromObject = (font: Font) => {
  const variants = font.variants;

  const cssId = "google-font-" + font.name + "-all";

  const existing = document.getElementById(cssId);
  if (!existing && font?.name && variants?.length > 0) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = cssId;
    link.href =
      "https://fonts.googleapis.com/css2?family=" +
      font.name +
      ":ital,wght@" +
      variants.sort().join(";") +
      "&display=swap";
    link.setAttribute("data-testid", cssId); // for react testing library
    document.head.appendChild(link);
  }
};

const getFonts = (tree: Tree) => {
  const fonts: string[] = [];

  const traverse = (node: Tree) => {
    if (node.type === "text") {
      fonts.push(node.fontFamily);
    }

    node.children?.forEach((child) => traverse(child));
  };

  traverse(tree);

  return Array.from(fonts);
};

const removeFonts = (fontNames: string[]) => {
  fontNames.forEach((font) => {
    const cssId = "google-font-" + font + "-all";
    const existing = document.getElementById(cssId);
    if (existing) {
      existing.remove();
    }
  });
};

export const FontLoader = () => {
  const tree = useEditorStore((state) => state.tree);
  const lastFonts = useRef<string[]>([]);

  const fonts = useMemo(() => {
    const usedFonts = getFonts(tree);
    return usedFonts;
  }, [tree]);

  useEffect(() => {
    fonts.forEach((font) => {
      const fontInfo = fontContent.find((f) => f.name === font);
      if (fontInfo) {
        loadFontFromObject(fontInfo);
      }
    });
    const removeRemoved = lastFonts.current.filter((f) => !fonts.includes(f));
    removeFonts(removeRemoved);
    lastFonts.current = fonts;
  }, [fonts]);

  return null;
};

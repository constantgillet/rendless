import { Button, Select } from "@radix-ui/themes";
import fontContent from "../contents/fontInfo.json";
import { Virtuoso } from "react-virtuoso";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Icon } from "./Icon";
import { useCallback } from "react";

type FontPickerProps = {};

export interface Font {
  category: string;
  name: string;
  sane: string;
  cased: string;
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

const loadAllVariants = true;

export const FontPicker = (props: FontPickerProps) => {
  const getFourVariants = (variants: string[]) => {
    const regularWeights = variants
      .filter((v: string) => v.substring(0, 2) === "0,")
      .map((v: string) => parseInt(v.substring(2)))
      .sort((a, b) => a - b);
    const italicWeights = variants
      .filter((v: string) => v.substring(0, 2) === "1,")
      .map((v: string) => parseInt(v.substring(2)))
      .sort((a, b) => a - b);

    const fourFonts: FourFonts = {};

    // Best regular font is whatever is closest to 400 (but use 300 if only 300 and 500 available)
    fourFonts.regular = regularWeights
      .sort((a, b) => Math.abs(399 - a) - Math.abs(399 - b))
      .shift();

    // Best bold font is whatever is larger than regular, and closest to 700
    fourFonts.bold = regularWeights
      .filter((v) => v > (fourFonts.regular || 0))
      .sort((a, b) => Math.abs(700 - a) - Math.abs(700 - b))
      .shift();

    // Same for italics
    fourFonts.italic = italicWeights
      .sort((a, b) => Math.abs(399 - a) - Math.abs(399 - b))
      .shift();
    fourFonts.boldItalic = italicWeights
      .filter((v) => v > (fourFonts.italic || 0))
      .sort((a, b) => Math.abs(700 - a) - Math.abs(700 - b))
      .shift();

    const fourVariants: string[] = [];
    if (fourFonts.regular) {
      fourVariants.push("0," + fourFonts.regular);
    }
    if (fourFonts.bold) {
      fourVariants.push("0," + fourFonts.bold);
    }
    if (fourFonts.italic) {
      fourVariants.push("1," + fourFonts.italic);
    }
    if (fourFonts.boldItalic) {
      fourVariants.push("1," + fourFonts.boldItalic);
    }
    return fourVariants;
  };

  const loadFontFromObject = useCallback(
    (font: Font, variants: Variant[] = []) => {
      if (variants?.length > 0) {
        variants = font.variants.filter((v: Variant) => variants.includes(v));
      } else if (loadAllVariants) {
        variants = font.variants;
      } else {
        variants = getFourVariants(font.variants.map((v) => toString(v)));
      }

      let cssId = "google-font-" + font.sane;
      const cssIdAll = cssId + "-all";
      if (variants.length === font.variants.length) {
        cssId = cssIdAll;
      } else {
        cssId +=
          "-" +
          variants.sort().join("-").replaceAll("1,", "i").replaceAll("0,", "");
      }

      const existing = document.getElementById(cssId);
      const existingAll = document.getElementById(cssIdAll);
      if (!existing && !existingAll && font?.name && variants?.length > 0) {
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
    },
    [loadAllVariants]
  );

  const autoLoadFont = useCallback(
    (font: Font) => {
      loadFontFromObject(font);
    },
    [loadFontFromObject]
  );

  return (
    <Select.Root
      defaultValue=""
      onValueChange={(value) => {
        const font = fontContent.find((f) => f.name === value);
        if (font) {
          autoLoadFont(font);
        }
      }}
    >
      <SelectPrimitive.Trigger>
        <Button variant="surface" size={"2"} color="gray">
          Font <Icon name="chevron-down" />
        </Button>
      </SelectPrimitive.Trigger>
      <Select.Content position="popper" align="end">
        <Virtuoso
          style={{ height: "400px", width: "200px" }}
          totalCount={fontContent.length}
          itemContent={(index) => (
            <Select.Item
              key={fontContent[index].name}
              value={fontContent[index].name}
            >
              {fontContent[index].name}
            </Select.Item>
          )}
        />
      </Select.Content>
    </Select.Root>
  );
};

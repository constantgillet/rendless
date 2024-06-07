import { z } from "zod";

//Create element types using zod
export const ElementType = z.enum(["text", "image", "rect"]);
export type ElementType = z.infer<typeof ElementType>;

//Base element properties that all elements share
export const BaseElement = z.object({
  id: z.string(),
  type: ElementType,
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number(),
});

export const RectElement = BaseElement.merge(
  z.object({
    type: z.enum(["rect"]),
    backgroundColor: z.string(),
    borderColor: z.string(),
    borderWidth: z.number(),
    borderTopLeftRadius: z.number(),
    borderTopRightRadius: z.number(),
    borderBottomLeftRadius: z.number(),
    borderBottomRightRadius: z.number(),
  })
);

export type RectElementType = z.infer<typeof RectElement>;

//Text element properties
export const TextElement = BaseElement.merge(
  z.object({
    type: z.literal("text"),
    content: z.string(),
    fontSize: z.number(),
    color: z.string(),
    textColorOpacity: z.number(),
    fontFamily: z.string(),
    fontWeight: z.number(),
    fontStyle: z.enum(["normal", "italic"]),
    textAlign: z.enum(["left", "center", "right", "justify"]),
    textTransform: z.enum(["none", "uppercase", "lowercase", "capitalize"]),
    lineHeight: z.number(),
  })
);

export type TextElementType = z.infer<typeof TextElement>;

//Image element properties
export const ImageElement = BaseElement.merge(
  z.object({
    type: z.literal("image"),
    src: z.string().nullable(),
    objectFit: z.enum(["fill", "contain", "cover", "none", "scale-down"]),
    borderTopLeftRadius: z.number(),
    borderTopRightRadius: z.number(),
    borderBottomLeftRadius: z.number(),
    borderBottomRightRadius: z.number(),
  })
);

export type ImageElementType = z.infer<typeof ImageElement>;

export const Variables = z.object({
  property: z.string(),
  name: z.string(),
});

export type VariablesType = z.infer<typeof Variables>;

export const RectElementWithVariables = RectElement.merge(
  z.object({
    variables: z.array(Variables),
  })
);

export type RectElementWithVariablesType = z.infer<
  typeof RectElementWithVariables
>;

export const TextElementWithVariables = TextElement.merge(
  z.object({
    variables: z.array(Variables),
  })
);
export type TextElementWithVariablesType = z.infer<
  typeof TextElementWithVariables
>;

export const ImageElementWithVariables = ImageElement.merge(
  z.object({
    variables: z.array(Variables),
  })
);

export type ImageElementWithVariablesType = z.infer<
  typeof ImageElementWithVariables
>;

export const defaultRectElement: RectElementType = {
  id: "",
  type: "rect",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  backgroundColor: "#fff",
  borderColor: "#000",
  borderWidth: 1,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
};

export const defaultTextElement: TextElementType = {
  id: "",
  type: "text",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  content: "Hello world",
  fontSize: 16,
  color: "#000",
  textColorOpacity: 1,
  fontFamily: "Arial",
  fontWeight: 400,
  fontStyle: "normal",
  textAlign: "left",
  textTransform: "none",
  lineHeight: 1.2,
};

export const defaultImageElement: ImageElementType = {
  id: "",
  type: "image",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  src: "",
  objectFit: "cover",
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
};

export const defaultElements = {
  rect: defaultRectElement,
  text: defaultTextElement,
  image: defaultImageElement,
};

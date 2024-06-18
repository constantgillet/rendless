import { z } from "zod";

//Create element types using zod
export const ElementType = z.enum(["text", "image", "rect"]);
export type ElementType = z.infer<typeof ElementType>;

//Base element properties that all elements share
const BaseElementSchema = z.object({
  id: z.string(),
  type: ElementType,
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotate: z.number(),
});

export const RectElementSchema = BaseElementSchema.merge(
  z.object({
    type: z.enum(["rect"]),
    backgroundColor: z.string(),
    backgroundOpacity: z.number(),
    borderTopLeftRadius: z.number(),
    borderTopRightRadius: z.number(),
    borderBottomLeftRadius: z.number(),
    borderBottomRightRadius: z.number(),
    borderColor: z.string().nullish().default(null),
    borderWidth: z.number().nullish().default(null),
    borderType: z.enum(["inside", "outside"]).nullish().default(null),
    borderOpacity: z.number().nullish().default(null),
    blur: z.number().nullish().default(null),
    shadowXOffset: z.number().nullish().default(null),
    shadowYOffset: z.number().nullish().default(null),
    shadowBlur: z.number().nullish().default(null),
    shadowColor: z.string().nullish().default(null),
    shadowOpacity: z.number().nullish().default(null),
    shadowSpread: z.number().nullish().default(null),
  })
);

export type RectElement = z.infer<typeof RectElementSchema>;

//Text element properties
export const TextElementSchema = BaseElementSchema.merge(
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
    blur: z.number().nullish().default(null),
    textShadowXOffset: z.number().nullish().default(null),
    textShadowYOffset: z.number().nullish().default(null),
    textShadowBlur: z.number().nullish().default(null),
    textShadowColor: z.string().nullish().default(null),
  })
);

export type TextElement = z.infer<typeof TextElementSchema>;

//Image element properties
export const ImageElementSchema = BaseElementSchema.merge(
  z.object({
    type: z.literal("image"),
    src: z.string().nullable(),
    objectFit: z.enum(["fill", "contain", "cover", "none", "scale-down"]),
    borderTopLeftRadius: z.number(),
    borderTopRightRadius: z.number(),
    borderBottomLeftRadius: z.number(),
    borderBottomRightRadius: z.number(),
    borderColor: z.string().nullish().default(null),
    borderWidth: z.number().nullish().default(null),
    borderType: z.enum(["inside", "outside"]).nullish().default(null),
    borderOpacity: z.number().nullish().default(null),
    blur: z.number().nullish().default(null),
    shadowXOffset: z.number().nullish().default(null),
    shadowYOffset: z.number().nullish().default(null),
    shadowBlur: z.number().nullish().default(null),
    shadowColor: z.string().nullish().default(null),
    shadowOpacity: z.number().nullish().default(null),
    shadowSpread: z.number().nullish().default(null),
  })
);

export type ImageElement = z.infer<typeof ImageElementSchema>;

export const PageElementSchema = BaseElementSchema.merge(
  z.object({
    type: z.literal("page"),
    backgroundColor: z.string(),
    backgroundOpacity: z.number(),
  })
);

export type PageElement = z.infer<typeof PageElementSchema>;

export const Variables = z.object({
  property: z.string(),
  name: z.string(),
});

export type Variables = z.infer<typeof Variables>;

export const RectElementWithVariables = RectElementSchema.merge(
  z.object({
    variables: z.array(Variables),
  })
);

export type RectElementWithVariables = z.infer<typeof RectElementWithVariables>;

export const TextElementWithVariables = TextElementSchema.merge(
  z.object({
    variables: z.array(Variables),
  })
);
export type TextElementWithVariables = z.infer<typeof TextElementWithVariables>;

export const ImageElementWithVariables = ImageElementSchema.merge(
  z.object({
    variables: z.array(Variables),
  })
);

export type ImageElementWithVariables = z.infer<
  typeof ImageElementWithVariables
>;

export const defaultRectElement: RectElement = {
  id: "",
  type: "rect",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotate: 0,
  backgroundColor: "#ff0000",
  backgroundOpacity: 1,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderColor: null,
  borderWidth: null,
  borderType: null,
  borderOpacity: null,
  blur: null,
  shadowXOffset: null,
  shadowYOffset: null,
  shadowBlur: null,
  shadowColor: null,
  shadowOpacity: null,
  shadowSpread: null,
};

export const defaultTextElement: TextElement = {
  id: "",
  type: "text",
  x: 0,
  y: 0,
  rotate: 0,
  width: 100,
  height: 100,
  color: "#000000",
  textColorOpacity: 1,
  textTransform: "none",
  fontSize: 28,
  fontWeight: 400,
  fontStyle: "normal",
  fontFamily: "Open Sans",
  textAlign: "left",
  content: "Text",
  lineHeight: 1.5,
  blur: null,
  textShadowXOffset: null,
  textShadowYOffset: null,
  textShadowBlur: null,
  textShadowColor: null,
};

export const defaultImageElement: ImageElement = {
  id: "",
  type: "image",
  x: 0,
  y: 0,
  rotate: 0,
  width: 100,
  height: 100,
  src: null,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0,
  borderColor: null,
  borderWidth: null,
  borderType: null,
  borderOpacity: null,
  objectFit: "cover",
  blur: null,
  shadowXOffset: null,
  shadowYOffset: null,
  shadowBlur: null,
  shadowColor: null,
  shadowOpacity: null,
  shadowSpread: null,
};

export const defaultElements = {
  rect: defaultRectElement,
  text: defaultTextElement,
  image: defaultImageElement,
};

//Element is type of RectElement, TextElement or ImageElement
export type Element = RectElement | TextElement | ImageElement;

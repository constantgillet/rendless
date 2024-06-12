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
		blur: z.number().nullish().default(null),
	}),
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
	}),
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
	}),
);

export type ImageElement = z.infer<typeof ImageElementSchema>;

export const PageElementSchema = BaseElementSchema.merge(
	z.object({
		type: z.literal("page"),
		backgroundColor: z.string(),
		backgroundOpacity: z.number(),
	}),
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
	}),
);

export type RectElementWithVariables = z.infer<typeof RectElementWithVariables>;

export const TextElementWithVariables = TextElementSchema.merge(
	z.object({
		variables: z.array(Variables),
	}),
);
export type TextElementWithVariables = z.infer<typeof TextElementWithVariables>;

export const ImageElementWithVariables = ImageElementSchema.merge(
	z.object({
		variables: z.array(Variables),
	}),
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
	backgroundColor: "#fff",
	backgroundOpacity: 1,
	borderTopLeftRadius: 0,
	borderTopRightRadius: 0,
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
	borderColor: null,
	borderWidth: null,
	borderType: null,
	blur: null,
};

export const defaultTextElement: TextElement = {
	id: "",
	type: "text",
	x: 0,
	y: 0,
	width: 100,
	height: 100,
	rotate: 0,
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

export const defaultImageElement: ImageElement = {
	id: "",
	type: "image",
	x: 0,
	y: 0,
	width: 100,
	height: 100,
	rotate: 0,
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

//Element is type of RectElement, TextElement or ImageElement
export type Element = RectElement | TextElement | ImageElement;

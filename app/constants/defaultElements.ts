import {
	defaultImageElement,
	defaultRectElement,
	defaultTextElement,
	type ImageElement,
	type ImageElementWithVariables,
	type RectElement,
	type RectElementWithVariables,
	type TextElement,
	type TextElementWithVariables,
} from "~/stores/elementTypes";

export const defaultElements = {
	rect: {
		...defaultRectElement,
		variables: [],
	} as RectElementWithVariables,
	text: {
		...defaultTextElement,
		variables: [],
	} as TextElementWithVariables,
	image: {
		...defaultImageElement,
		variables: [],
	} as ImageElementWithVariables,
};

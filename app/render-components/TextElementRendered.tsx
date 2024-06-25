import { addAlphaToHex } from "~/utils/addAlphaToHex";
import type { TextElement } from "~/stores/elementTypes";

type TextElementProps = TextElement;

export const TextElementRendered = (props: TextElementProps) => {
	return (
		<p
			style={{
				display: "flex",
				position: "absolute",
				transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
				fontFamily: props.fontFamily,
				fontWeight: props.fontWeight,
				fontSize: `${props.fontSize}px`,
				textTransform: props.textTransform,
				width: `${props.width}px`,
				height: `${props.height}px`,
				color: addAlphaToHex(props.color, props.textColorOpacity),
				overflowWrap: "break-word",
				whiteSpace: "pre-wrap",
				wordBreak: "break-word",
				textAlign: props.textAlign,
				justifyContent:
					props.textAlign === "center"
						? "center"
						: props.textAlign === "right"
							? "flex-end"
							: "flex-start",
				lineHeight: props.lineHeight,
				filter: props.blur ? `blur(${props.blur}px)` : "none",
				textShadow:
					props.textShadowXOffset &&
					props.textShadowYOffset &&
					props.textShadowBlur &&
					props.textShadowColor &&
					props.textShadowOpacity
						? `${props.textShadowXOffset}px ${props.textShadowYOffset}px ${
								props.textShadowBlur
							}px ${addAlphaToHex(
								props.textShadowColor,
								props.textShadowOpacity,
							)}`
						: "none",
			}}
		>
			{props.content}
		</p>
	);
};

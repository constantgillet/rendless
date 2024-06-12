import type { RectElement } from "~/stores/elementTypes";
import { addAlphaToHex } from "~/utils/addAlphaToHex";

type RectElementProps = RectElement;

export const RectElementRendered = (props: RectElementProps) => {
	return (
		<div
			style={{
				position: "absolute",
				transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
				width: `${props.width}px`,
				height: `${props.height}px`,
				backgroundColor: addAlphaToHex(
					props.backgroundColor,
					props.backgroundOpacity,
				),
				borderTopLeftRadius: `${props.borderTopLeftRadius}px`,
				borderTopRightRadius: `${props.borderTopRightRadius}px`,
				borderBottomLeftRadius: `${props.borderBottomLeftRadius}px`,
				borderBottomRightRadius: `${props.borderBottomRightRadius}px`,
				boxShadow:
					props.borderColor && props.borderType && props.borderWidth
						? `0px 0px 0px ${props.borderWidth}px ${
								props.borderType === "inside" ? "inset" : ""
							} ${props.borderColor}`
						: "none",
				filter: props.blur ? `blur(${props.blur}px)` : "none",
			}}
		/>
	);
};

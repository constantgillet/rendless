import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { addAlphaToHex } from "~/utils/addAlphaToHex";
import type { RectElement as RectElementType } from "~/stores/elementTypes";

type ReactElementProps = RectElementType;

export const RectElement = (props: ReactElementProps) => {
	return (
		<div
			className={cx(
				"target",
				css({
					position: "absolute",
					_hover: {
						outline: "1px solid #4af",
						outlineOffset: "-1px",
					},
				}),
			)}
			{...{
				[DATA_SCENA_ELEMENT_ID]: props.id,
			}}
			style={{
				transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rotate}deg)`,
				width: props.width,
				height: props.height,
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

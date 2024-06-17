import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { addAlphaToHex } from "~/utils/addAlphaToHex";
import type { RectElement as RectElementType } from "~/stores/elementTypes";

type ReactElementProps = RectElementType;

export const RectElement = (props: ReactElementProps) => {
	//Create boxShadow string with border and shadow properties
	const shadowValue =
		props.shadowXOffset &&
		props.shadowYOffset &&
		props.shadowBlur &&
		props.shadowSpread &&
		props.shadowColor
			? `${props.shadowXOffset}px ${props.shadowYOffset}px ${
					props.shadowBlur
				}px ${props.shadowSpread}px ${addAlphaToHex(
					props.shadowColor,
					props.shadowOpacity || 1,
				)}`
			: undefined;
	const borderValue =
		props.borderColor && props.borderType && props.borderWidth
			? `0px 0px 0px ${props.borderWidth}px ${
					props.borderType === "inside" ? "inset" : ""
				} ${props.borderColor}`
			: undefined;

	const shadowList = [shadowValue, borderValue].filter(Boolean).join(", ");

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
				boxShadow: shadowList !== "" ? shadowList : "unset",
				filter: props.blur ? `blur(${props.blur}px)` : "none",
			}}
		/>
	);
};

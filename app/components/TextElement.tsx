import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { useScaleStore } from "./ScaleStore";
import { useEffect, useRef, useState } from "react";

type TextElementProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
};

export const TextElement = (props: TextElementProps) => {
  const scale = useScaleStore((state) => state.scale);
  const textElementRef = useRef<HTMLTextAreaElement>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);

  const handleClick = (event: React.MouseEventHandler<HTMLTextAreaElement>) => {
    if (event.detail === 2) {
      textElementRef.current?.focus();
      setIsEditingContent(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditingContent(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    //If clicked outside textarea, stop editing
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textElementRef.current &&
        !textElementRef.current.contains(event.target as Node)
      ) {
        setIsEditingContent(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <textarea
      ref={textElementRef}
      className={cx(
        "target",
        css({
          position: "absolute",
          resize: "none",
          _hover: {
            outline: "1px solid #4af",
            outlineOffset: "-1px",
          },
          _focusVisible: {
            outline: "none",
          },
        })
      )}
      {...{
        [DATA_SCENA_ELEMENT_ID]: props.id,
      }}
      style={{
        transform: `translate(${props.x * scale}px, ${props.y * scale}px)`,
        width: props.width * scale,
        height: props.height * scale,
        fontSize: 18 * scale,
        background: "transparent",
        color: "black",
        cursor: isEditingContent ? "text" : "default",
      }}
      onClick={handleClick}
    ></textarea>
  );
};

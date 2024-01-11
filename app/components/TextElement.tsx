import { css, cx } from "styled-system/css";
import { DATA_SCENA_ELEMENT_ID } from "~/utils/consts";
import { useScaleStore } from "./ScaleStore";
import { useEffect, useRef, useState } from "react";
import { ElementText, useEditorStore } from "./EditorStore";

type TextElementProps = ElementText;

export const TextElement = (props: TextElementProps) => {
  const scale = useScaleStore((state) => state.scale);
  const textElementRef = useRef<HTMLTextAreaElement>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [val, setVal] = useState("");

  const updateElement = useEditorStore((state) => state.updateElement);

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

  const resizeTextArea = () => {
    if (!textElementRef.current) return;

    textElementRef.current.style.height = "auto";
    textElementRef.current.style.height =
      textElementRef.current.scrollHeight + "px";
  };

  useEffect(resizeTextArea, [
    props.content,
    props.fontSize,
    props.width,
    scale,
  ]);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateElement({
      id: props.id,
      content: event.target.value,
    });
  };

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
          _focusVisible: {
            outline: "none",
          },
        })
      )}
      style={{
        transform: `translate(${props.x * scale}px, ${props.y * scale}px)`,
        width: props.width * scale,
        height: props.height * scale,
      }}
      {...{
        [DATA_SCENA_ELEMENT_ID]: props.id,
      }}
    >
      <textarea
        ref={textElementRef}
        value={props.content}
        onChange={(e) => onChange(e)}
        className={cx(
          css({
            width: "100%",
            minHeight: "100%",
            resize: "none",
            _focusVisible: {
              outline: "none",
            },
          })
        )}
        style={{
          fontFamily: props.fontFamily,
          fontSize: props.fontSize * scale,
          background: "transparent",
          color: props.color,
          cursor: isEditingContent ? "text" : "default",
          textAlign: props.textAlign,
        }}
        onClick={handleClick}
      ></textarea>
    </div>
  );
};

import { ReactNode } from "react";
import { css } from "styled-system/css";

type PropertyLineProps = {
  label: string;
  children: ReactNode;
};

export const PropertyLine = (props: PropertyLineProps) => {
  return (
    <div
      className={css({
        display: "flex",
        gap: "1",
        alignItems: "center",
        justifyContent: "space-between",
      })}
    >
      <label className={css({ color: "var(--gray-a11)", fontSize: "14px" })}>
        {props.label}
      </label>
      <div>{props.children}</div>
    </div>
  );
};

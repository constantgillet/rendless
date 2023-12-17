import { css } from "styled-system/css";

export const TopBar = () => {
  return (
    <header
      className={css({
        position: "absolute",
        top: 0,
        left: 0,
        height: "48px",
        borderBottom: "1px solid var(--gray-a5)",
        backgroundColor: "var(--color-panel)",
        width: "100%",
      })}
    >
      Test
    </header>
  );
};

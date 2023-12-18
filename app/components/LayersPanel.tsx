import { css } from "styled-system/css";

export const LayersPanel = () => {
  return (
    <aside
      className={css({
        w: 244,
        backgroundColor: "var(--color-panel)",
        padding: "var(--space-3)",
        borderRight: "1px solid var(--gray-a5)",
        position: "absolute",
        bottom: 0,
        left: 0,
        height: "calc(100vh - 58px)",
      })}
    ></aside>
  );
};

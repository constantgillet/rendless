import { css } from "styled-system/css";
import { Icon } from "./Icon";
import { Button, IconButton, Tooltip } from "@radix-ui/themes";

export const TopBar = () => {
  return (
    <header
      className={css({
        position: "absolute",
        top: 0,
        left: 0,
        height: "58px",
        borderBottom: "1px solid var(--gray-a5)",
        backgroundColor: "var(--color-panel)",
        width: "100%",
      })}
    >
      <div
        className={css({
          paddingX: "var(--space-3)",
          height: "100%",
          display: "flex",
        })}
      >
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            height: "100%",
            gap: "var(--space-2)",
            flex: 1,
          })}
        >
          <Tooltip content="Add a text">
            <IconButton size="3" variant="outline" highContrast radius="none">
              <Icon name="text" size="lg" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Add a shape">
            <IconButton size="3" variant="outline" highContrast radius="none">
              <Icon name="shape" size="lg" />
            </IconButton>
          </Tooltip>
        </div>
        <div
          className={css({
            flex: 1,
            display: "flex",
            justifyContent: "center",
          })}
        >
          <input
            value={"Template name"}
            className={css({
              border: "none",
              outline: "none",
              textAlign: "center",
              fontSize: "var(--font-size-3)",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--color-text)",
              backgroundColor: "transparent",
            })}
          />
        </div>
        <div
          className={css({
            gap: "var(--space-2)",
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          })}
        >
          <Button variant="outline">Use image</Button>
          <Button>Preview</Button>
        </div>
      </div>
    </header>
  );
};

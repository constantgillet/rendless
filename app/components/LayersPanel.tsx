import { css } from "styled-system/css";
import { useEditorStore } from "./EditorStore";
import { Button } from "@radix-ui/themes";
import { Icon } from "./Icon";

export const LayersPanel = () => {
  const tree = useEditorStore((state) => state.tree);
  const selectedItems = useEditorStore((state) => state.selected);
  const setSelected = useEditorStore((state) => state.setSelected);

  return (
    <aside
      className={css({
        w: 244,
        backgroundColor: "var(--color-panel)",
        padding: "var(--space-3)",
        borderRight: "1px solid var(--gray-a5)",
        bottom: 0,
        left: 0,
        height: "calc(100vh - 58px)",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingX: "var(--space-2)",
        })}
      >
        {tree?.chilren?.map((child) => {
          const id = child.id;
          const isSelected = selectedItems.includes(id);

          return (
            <div key={id}>
              <Button
                variant="ghost"
                color="gray"
                className={css({ w: "full", justifyContent: "space-between" })}
                style={{
                  justifyContent: "space-between",
                  border: isSelected ? "1px dashed var(--accent-8)" : "none",
                }}
                size={"3"}
                onClick={(e) => {
                  if (e.shiftKey) {
                    if (isSelected) {
                      setSelected(selectedItems.filter((item) => item !== id));
                    } else {
                      setSelected([...selectedItems, id]);
                    }
                  } else {
                    setSelected([id]);
                  }
                }}
              >
                <div
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                  })}
                >
                  <Icon name={child.type === "rect" ? "shape" : "text"} />
                  Layer {child.type}
                </div>
                {/* <Icon
                  name="lock-open"
                  size="lg"
                  className={css({
                    color: "var(--gray-a8)",
                  })}
                /> */}
              </Button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

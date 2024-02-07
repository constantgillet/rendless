import { Button, Card } from "@radix-ui/themes";
import { css } from "styled-system/css";
import { grid, gridItem } from "styled-system/patterns";

export default function AppHome() {
  return (
    <>
      <div className={css({ spaceY: "4" })}>
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
          })}
        >
          <div
            className={css({
              fontSize: "medium",
              color: "var(--gray-a11)",
            })}
          >
            You will discover here all your images templates
          </div>
          <Button>Create a template</Button>
        </div>
        <div className={grid({ columns: 12, gap: 6 })}>
          <Card className={gridItem({ colSpan: 4, padding: 0 })}>
            <div
              className={css({
                aspectRatio: "1.91/1",
              })}
            ></div>
            <div className={css({ display: "flex", alignItems: "center" })}>
              <div className={css({ flex: 1 })}>template #1</div>
              <div className={css({ display: "flex", gap: 2 })}>
                <Button size="2">Edition</Button>
                <Button size="2" variant="outline" color="red">
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

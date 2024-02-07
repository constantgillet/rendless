import { Button, Card, Inset } from "@radix-ui/themes";
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
          <Button variant="classic">Create a template</Button>
        </div>
        <div className={grid({ columns: 12, gap: 6 })}>
          <Card className={gridItem({ colSpan: 4 })}>
            <Inset
              className={css({
                backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='12' height='12' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0)'/><path d='M10-6V6M10 14v12M26 10H14M6 10H-6'  stroke-linecap='square' stroke-width='0.5' stroke='hsla(226, 70%, 55%, 0.27)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`,
              })}
            >
              <div
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  padding: "14px",
                })}
              >
                <div
                  className={css({
                    aspectRatio: "1.91/1",
                    rounded: "6px",
                    overflow: "hidden",
                  })}
                >
                  <img
                    src="https://assets-global.website-files.com/6040ba28127600ad9182e1be/648ac36424d7794b98b5d3ce_artboard.jpg"
                    width={"full"}
                    height={"full"}
                    alt="Og  template"
                  />
                </div>
                <div className={css({ display: "flex", alignItems: "center" })}>
                  <div className={css({ flex: 1 })}>template #1</div>
                  <div className={css({ display: "flex", gap: 2 })}>
                    <Button size="2">Edition</Button>
                    <Button size="2" variant="outline" color="red">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Inset>
          </Card>
        </div>
      </div>
    </>
  );
}

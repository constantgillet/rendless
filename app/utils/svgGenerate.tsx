import satori from "satori";
import { Tree } from "~/stores/EditorStore";

async function fetchFont(font: string): Promise<ArrayBuffer | null> {
  const API = `https://fonts.googleapis.com/css2?family=${font}`;

  const css = await (
    await fetch(API, {
      headers: {
        // Make sure it returns TTF.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (!resource) return null;

  const res = await fetch(resource[1]);

  return res.arrayBuffer();
}

export const SvgGenerate = async (tree: Tree) => {
  let robotoArrayBuffer: ArrayBuffer | null = null;
  const buffer = await fetchFont("Roboto");
  robotoArrayBuffer = buffer;

  if (!robotoArrayBuffer) {
    throw new Error("Font not found");
  }

  const svg = await satori(<TreeToJsx tree={tree} />, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Roboto",
        // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
        data: robotoArrayBuffer,
        weight: 400,
        style: "normal",
      },
    ],
  });

  return svg;
};

const TreeToJsx = ({ tree }: { tree: Tree }) => {
  return (
    <div
      style={{
        backgroundColor: tree.backgroundColor,
        width: 1200,
        height: 630,
        position: "relative",
        display: "flex",
      }}
    >
      {tree.children.map((child) => {
        return (
          <div
            key={child.id}
            style={{
              display: "flex",
              position: "absolute",
              top: child.y,
              left: child.x,
              width: child.width,
              height: child.height,
              backgroundColor:
                child?.type === "text" ? undefined : child.backgroundColor,
              borderTopLeftRadius:
                child?.type === "text" ? undefined : child.borderTopLeftRadius,
              borderTopRightRadius:
                child?.type === "text" ? undefined : child.borderTopRightRadius,
              borderBottomLeftRadius:
                child?.type === "text"
                  ? undefined
                  : child.borderBottomLeftRadius,
              borderBottomRightRadius:
                child?.type === "text"
                  ? undefined
                  : child.borderBottomRightRadius,
            }}
          ></div>
        );
      })}
    </div>
  );
};

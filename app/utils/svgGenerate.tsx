import satori, { Font } from "satori";
import { ImageElementRendered } from "~/render-components/ImageElementRendered";
import { RectElementRendered } from "~/render-components/RectElementRendered";
import { TextElementRendered } from "~/render-components/TextElementRendered";
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

const getAllFonts = async (tree: Tree) => {
  const fontList = tree.children
    .filter((child) => child.type === "text")
    .map((child) => ({
      fontFamily: child.fontFamily,
      fontWeight: child.fontWeight,
      fontStyle: child.fontStyle,
    }));

  const fonts: Font[] = [];

  for (const font of fontList) {
    const buffer = await fetchFont(font.fontFamily);
    if (!buffer) {
      throw new Error("Font not found");
    }

    fonts.push({
      name: font.fontFamily,
      data: buffer,
      weight: font.fontWeight,
      style: font.fontStyle,
    });
  }

  return fonts;
};

export const SvgGenerate = async (tree: Tree) => {
  const fontsLoaded = await getAllFonts(tree);

  const svg = await satori(<TreeToJsx tree={tree} />, {
    width: 1200,
    height: 630,
    fonts: fontsLoaded,
  });

  return svg;
};

const renderedComponentsMap = {
  rect: RectElementRendered,
  text: TextElementRendered,
  image: ImageElementRendered,
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
        const Component = renderedComponentsMap[child.type];

        return <Component key={child.id} {...child} />;
      })}
    </div>
  );
};

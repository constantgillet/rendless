import { LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/libs/prisma";
import { Tree } from "~/stores/EditorStore";
import satori from "satori";

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

  console.log(res);

  return res.arrayBuffer();
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { templateId } = params;

  console.log("RENDER TEMPLATE", templateId);

  if (!templateId) {
    throw json(
      {
        ok: false,
        error: {
          message: "Template ID is required",
          code: "TEMPLATE_ID_REQUIRED",
        },
      },
      { status: 405 }
    );
  }

  let tree: Tree | null = null;

  try {
    const template = await prisma.template.findFirst({
      where: {
        name: templateId,
      },
    });

    if (!template) {
      return json(
        {
          ok: false,
          error: {
            message: "Template not found",
            code: "TEMPLATE_NOT_FOUND",
          },
        },
        { status: 404 }
      );
    }

    tree = template.tree as unknown as Tree;
  } catch (error) {
    console.error("Error fetching template", error);
    throw json(
      {
        ok: false,
        error: {
          message: "Error fetching template",
          code: "FETCH_TEMPLATE_ERROR",
        },
      },
      { status: 500 }
    );
  }

  if (!tree) {
    throw json(
      {
        ok: false,
        error: {
          message: "Template not found",
          code: "TEMPLATE_NOT_FOUND",
        },
      },
      { status: 404 }
    );
  }

  //https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu7GxKOzY.woff2

  let robotoArrayBuffer: ArrayBuffer | null = null;

  //https://github.com/vercel/satori/blob/main/playground/pages/api/font.ts
  try {
    const buffer = await fetchFont("Roboto");
    robotoArrayBuffer = buffer;
  } catch (error) {
    console.error("Error fetching font", error);
    throw json(
      {
        ok: false,
        error: {
          message: "Error fetching font",
          code: "FETCH_FONT_ERROR",
        },
      },
      { status: 500 }
    );
  }

  if (!robotoArrayBuffer) {
    throw json(
      {
        ok: false,
        error: {
          message: "Font not found",
          code: "FONT_NOT_FOUND",
        },
      },
      { status: 404 }
    );
  }

  let svg: string | null = null;

  try {
    svg = await satori(<div style={{ color: "black" }}>hello, world</div>, {
      width: 1600,
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

    console.log(svg);
  } catch (error) {
    console.error("Error rendering template", error);
    throw json(
      {
        ok: false,
        error: {
          message: "Error rendering template",
          code: "RENDER_TEMPLATE_ERROR",
        },
      },
      { status: 500 }
    );
  }

  return json({ ok: true });
};

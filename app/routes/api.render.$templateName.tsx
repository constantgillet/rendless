import { LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/libs/prisma";
import { Tree } from "~/stores/EditorStore";
import { Resvg } from "@resvg/resvg-js";
import { uploadToS3 } from "~/libs/s3";
import CryptoJS from "crypto-js";
import { getCacheData, setCacheData } from "~/libs/redis.server";
import { SvgGenerate } from "~/utils/svgGenerate";

const cacheEnabled = true;

const bucketURL = "https://cgbucket.ams3.digitaloceanspaces.com";

//TODO prevent duplicated templateName
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { templateName } = params;

  console.log("RENDER TEMPLATE", templateName);
  if (!templateName) {
    throw json(
      {
        ok: false,
        error: {
          message: "Template name is required",
          code: "TEMPLATE_NAME_REQUIRED",
        },
      },
      { status: 405 }
    );
  }
  const url = new URL(`https://og-image/render/${templateName}`);

  const urlHashed = CryptoJS.SHA256(url.toString()).toString();
  const cacheKey = `og-image-render-${urlHashed}`;

  const imageLocation = `ogimages/generated/${urlHashed}.png`;
  const imageUrl = `${bucketURL}/${imageLocation}`;

  try {
    const cachedData = await getCacheData(cacheKey);

    if (cachedData && cacheEnabled) {
      return json({
        ok: true,
        data: {
          url: imageUrl,
        },
      });
    }
  } catch (error) {}

  let tree: Tree | null = null;

  try {
    const template = await prisma.template.findFirst({
      where: {
        name: templateName,
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

  let svg: string | null = null;

  try {
    svg = await SvgGenerate(tree);

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

  const resvg = new Resvg(svg);

  try {
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    const location = await uploadToS3(pngBuffer, imageLocation);

    console.log("Location", location);
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

  try {
    await setCacheData(cacheKey, "true");
  } catch (error) {
    console.error("Error caching data", error);
  }

  return json({
    ok: true,
    data: {
      url: imageUrl,
    },
  });
};

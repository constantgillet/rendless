import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/libs/prisma";
import type { Tree } from "~/stores/EditorStore";
import { Resvg } from "@resvg/resvg-js";
import CryptoJS from "crypto-js";
import { getCacheData, setCacheData } from "~/libs/redis.server";
import { SvgGenerate } from "~/utils/svgGenerate";
import { fileExists, uploadToS3 } from "~/libs/s3";
import { CACHED_FOLDER, BUCKET_URL } from "~/constants/s3Constants";

const cacheEnabled = true;

//TODO prevent duplicated templateName
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { templateId } = params;

  console.log("RENDER TEMPLATE", templateId);
  if (!templateId) {
    throw json(
      {
        ok: false,
        error: {
          message: "Template id is required",
          code: "TEMPLATE_IS_REQUIRED",
        },
      },
      { status: 405 }
    );
  }

  //Get all search params
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const variablesValues = [] as { name: string; value: string }[];

  //replace foreach with for of
  for (const [key, value] of searchParams) {
    // Ignore the templateId
    if (key === "templateId") {
      return;
    }
    variablesValues.push({ name: key, value });
  }

  //create a hash of the params
  const variablesValuesHashed = CryptoJS.SHA256(
    JSON.stringify(variablesValues)
  ).toString();

  const imageKey = `render-${variablesValuesHashed}`;
  const redisKey = `render:${templateId}:${variablesValuesHashed}`;
  const imageLocation = `${CACHED_FOLDER}${templateId}/${imageKey}.png`;

  if (cacheEnabled) {
    const cachedData = await getCacheData(redisKey);

    //If the exit 307 the image is cached
    if (cachedData) {
      console.log("Image cached", imageLocation);

      return new Response(null, {
        status: 307,
        headers: {
          Location: `${BUCKET_URL}/${imageLocation}`,
        },
      });
    }
  }

  let tree: Tree | null = null;

  try {
    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
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
    svg = await SvgGenerate(tree, variablesValues);

    // console.log(svg);
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

    //Save the image to S3 as a cache
    uploadToS3(pngBuffer, imageLocation);

    // //Save the log to redis
    setCacheData(redisKey, "true");

    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
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
};

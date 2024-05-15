import { LoaderFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/libs/prisma";
import { Tree } from "~/stores/EditorStore";
import { Resvg } from "@resvg/resvg-js";
import CryptoJS from "crypto-js";
import { getCacheData, setCacheData } from "~/libs/redis.server";
import { SvgGenerate } from "~/utils/svgGenerate";
import { fileExists, uploadToS3 } from "~/libs/s3";
import { CACHED_FOLDER } from "~/constants/s3Constants";

const cacheEnabled = true;

const bucketURL = "https://cgbucket.ams3.digitaloceanspaces.com";

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

  const isDraft = searchParams.get("draft") === "true";

  const variablesValues = [] as { name: string; value: string }[];

  searchParams.forEach((value, key) => {
    variablesValues.push({ name: key, value });
  });

  //create a hash of the params
  const variablesValuesHashed = CryptoJS.SHA256(
    JSON.stringify(variablesValues)
  ).toString();

  const cacheKey = `render-${variablesValuesHashed}`;

  const imageLocation = `${CACHED_FOLDER}${templateId}/${
    isDraft ? "draft" : "prod"
  }/${cacheKey}.png`;

  // const resFileExists = await fileExists(imageLocation);
  const resFileExists = false;

  //If the exit 307 the image is cached
  if (resFileExists.exists) {
    return new Response(null, {
      status: 307,
      headers: {
        Location: `${bucketURL}/${imageLocation}`,
      },
    });
  }

  //Get query params
  //   const url = new URL(`https://og-image/render/${templateName}`);

  //   const urlHashed = CryptoJS.SHA256(url.toString()).toString();
  //   const cacheKey = `og-image-render-${urlHashed}`;

  //   const imageLocation = `ogimages/generated/${urlHashed}.png`;
  //   const imageUrl = `${bucketURL}/${imageLocation}`;

  //   try {
  //     const cachedData = await getCacheData(cacheKey);

  //     if (cachedData && cacheEnabled) {
  //       return json({
  //         ok: true,
  //         data: {
  //           url: imageUrl,
  //         },
  //       });
  //     }
  //   } catch (error) {}

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

    // If the template is

    tree =
      template.prodTree === null || isDraft
        ? (template.tree as unknown as Tree)
        : (template.prodTree as unknown as Tree);
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

    //Add redis log for doing analytics
    const monitorKey = `render:simple:${templateId}:${
      isDraft ? "draft" : "prod"
    }:${new Date().getTime()}`;

    //Save the log to redis
    setCacheData(
      monitorKey,
      JSON.stringify({
        values: variablesValues,
      })
    );

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

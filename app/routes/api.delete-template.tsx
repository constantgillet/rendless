import { type ActionFunctionArgs, json } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { CACHED_FOLDER } from "~/constants/s3Constants";
import { ensureAuthenticated } from "~/libs/lucia";
import { prisma } from "~/libs/prisma";
import { deleteFolder, multipleDeleteFromS3 } from "~/libs/s3";

export const validator = withZod(
  z.object({
    templateId: z.string(),
  })
);

export async function action({ context, request }: ActionFunctionArgs) {
  ensureAuthenticated(context.user);

  const result = await validator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error);
  }

  if (!context.user?.id) {
    return json({ data: "unauthorized" }, { status: 401 });
  }

  const { templateId } = result.data;

  try {
    const template = await prisma.template.findUnique({
      where: {
        id: templateId,
      },
    });

    if (!template) {
      return json({ data: "not found" }, { status: 404 });
    }

    if (template.userId !== context.user.id) {
      return json({ data: "unauthorized" }, { status: 401 });
    }

    const assets = await prisma.asset.findMany({ where: { templateId } });

    //Delete the assets
    await prisma.asset.deleteMany({
      where: {
        templateId,
      },
    });

    //Delete the assets from S3
    if (assets.length > 0) {
      const keys = assets.map((asset) => new URL(asset.url).pathname.slice(1));
      multipleDeleteFromS3(keys);
    }

    //Delete the template
    await prisma.template.delete({
      where: {
        id: templateId,
      },
    });

    deleteFolder(CACHED_FOLDER + templateId);

    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ data: "error" }, { status: 500 });
  }
}

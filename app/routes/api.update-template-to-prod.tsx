import { Prisma } from "@prisma/client";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { ensureAuthenticated } from "~/libs/lucia";
import { prisma } from "~/libs/prisma";

export const updateTemplateToProdValidator = withZod(
  z.object({
    templateId: z.string(),
  })
);

export async function action({ context, request }: ActionFunctionArgs) {
  ensureAuthenticated(context.user);

  const result = await updateTemplateToProdValidator.validate(
    await request.formData()
  );

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

    await prisma.template.update({
      where: {
        id: templateId,
      },
      data: {
        prodTree: template.tree as unknown as Prisma.JsonArray,
      },
    });

    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ data: "error" }, { status: 500 });
  }
}

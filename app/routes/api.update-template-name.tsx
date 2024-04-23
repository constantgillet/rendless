import { ActionFunctionArgs, json } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { ensureAuthenticated } from "~/libs/lucia";
import { prisma } from "~/libs/prisma";

export const editTemplateNamevalidator = withZod(
  z.object({
    templateId: z.string(),

    templateName: z
      .string()
      .min(1, { message: "Template name is required" })
      .max(100, {
        message: "Template name can't be longer than 100 characters",
      }),
  })
);

export async function action({ context, request }: ActionFunctionArgs) {
  ensureAuthenticated(context.user);

  const result = await editTemplateNamevalidator.validate(
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
        name: result.data.templateName,
      },
    });

    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ data: "error" }, { status: 500 });
  }
}

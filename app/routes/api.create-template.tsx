import type { Prisma } from "@prisma/client";
import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { defaultTree } from "~/constants/defaultTree";
import { ensureAuthenticated } from "~/libs/lucia";
import { prisma } from "~/libs/prisma";
import { nanoid } from "~/utils/nanoid";

export const validator = withZod(
  z.object({
    fromTemplateId: z.string().optional(),
  })
);

export async function action({ context, request }: ActionFunctionArgs) {
  ensureAuthenticated(context.user);

  const result = await validator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error);
  }

  const duplicateTemplateId = result.data.fromTemplateId;

  if (!context.user?.id) {
    return json({ data: "unauthorized" }, { status: 401 });
  }

  //If duplicateTemplateId is provided, duplicate the template
  let duplicatedTemplateTree: Prisma.JsonValue | null = null;

  if (duplicateTemplateId) {
    const template = await prisma.template.findUnique({
      where: {
        id: duplicateTemplateId,
      },
    });

    if (!template) {
      return json({ data: "not found" }, { status: 404 });
    }

    if (template.userId !== context.user.id) {
      return json({ data: "unauthorized" }, { status: 401 });
    }

    duplicatedTemplateTree = template.tree;
  }

  //Get all search params
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const defaultTreeValue =
    duplicatedTemplateTree || (defaultTree as unknown as Prisma.JsonArray);

  const templateName = "template " + Math.floor(Math.random() * 1000);

  //Check if template name already exists
  const id = nanoid(8);
  const templateFound = await prisma.template.findUnique({
    where: {
      id,
    },
  });

  if (templateFound) {
    return json({ error: "Template already exists" }, { status: 400 });
  }

  //Replace id by
  const template = await prisma.template.create({
    data: {
      id: id,
      name: templateName,
      tree: defaultTreeValue,
      userId: context.user.id,
    },
  });

  //If search params contains noredirect, return the template id
  if (searchParams.get("noredirect")) {
    return json({ id: template.id, name: template.name });
  }

  return redirect(`/editor/${template.id}`);
}

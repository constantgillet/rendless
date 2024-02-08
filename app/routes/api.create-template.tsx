import { Prisma } from "@prisma/client";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { defaultTree } from "~/constants/defaultTree";
import { ensureAuthenticated } from "~/libs/lucia";
import { prisma } from "~/libs/prisma";

export async function action({ context }: ActionFunctionArgs) {
  ensureAuthenticated(context.user);

  if (!context.user?.id) {
    return json({ data: "unauthorized" }, { status: 401 });
  }

  const defaultTreeValue = defaultTree as unknown as Prisma.JsonArray;

  const templateName = "template-" + Math.floor(Math.random() * 1000);

  //Check if template name already exists

  //Replace id by
  const template = await prisma.template.create({
    data: {
      name: templateName,
      tree: defaultTreeValue,
      userId: context.user.id,
    },
  });

  return redirect(`/editor/${template.id}`);
}

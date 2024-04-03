import { Prisma } from "@prisma/client";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { defaultTree } from "~/constants/defaultTree";
import { ensureAuthenticated } from "~/libs/lucia";
import { prisma } from "~/libs/prisma";

export async function action({ context, request }: ActionFunctionArgs) {
  ensureAuthenticated(context.user);

  if (!context.user?.id) {
    return json({ data: "unauthorized" }, { status: 401 });
  }

  //Get all search params
  const url = new URL(request.url);
  const searchParams = url.searchParams;

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

  //If search params contains noredirect, return the template id
  if (searchParams.get("noredirect")) {
    return json({ id: template.id, name: template.name });
  }

  return redirect(`/editor/${template.id}`);
}

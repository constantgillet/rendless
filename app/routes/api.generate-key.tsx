import { type ActionFunctionArgs, json } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { ensureAuthenticated } from "~/libs/lucia";
import { prisma } from "~/libs/prisma";
import { nanoid } from "~/utils/nanoid";

export const validator = withZod(
  z.object({
    name: z.string(),
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

  const { name } = result.data;

  // Generate the key
  const token = nanoid(24);

  const partialKey = `${token.slice(0, 3)}...${token.slice(-4)}`;

  //Save the token in the database
  await prisma.token.create({
    data: {
      name,
      hashedKey: token,
      partialKey: partialKey,
      userId: context.user.id,
    },
  });

  return json({ token: token, partialKey: partialKey, name });
}

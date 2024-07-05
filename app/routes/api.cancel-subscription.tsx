import type { ActionFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const validator = withZod(
	z.object({
		//convert the string to a number
		variantId: z
			.string()
			.min(1, { message: "variantId is required" })
			.transform((v) => Number(v)),
	}),
);

export const action = async ({ request, context }: ActionFunctionArgs) => {};

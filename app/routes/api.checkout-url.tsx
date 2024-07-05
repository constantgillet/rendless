import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { environment } from "~/libs/environment.server";
import { configureLemonSqueezy } from "~/libs/lemonsqueezy";
import { ensureAuthenticated } from "~/libs/lucia";

export const validator = withZod(
  z.object({
    //convert the string to a number
    variantId: z
      .string()
      .min(1, { message: "variantId is required" })
      .transform((v) => Number(v)),
  })
);

export const action = async ({ request, context }: ActionFunctionArgs) => {
  ensureAuthenticated(context.user);
  configureLemonSqueezy();

  if (!context.user) {
    throw new Response("Unauthorized", {
      status: 401,
    });
  }

  const result = await validator.validate(await request.formData());

  if (result.error) {
    // validationError comes from `remix-validated-form`
    throw validationError(result.error);
  }

  const { variantId } = result.data;
  const user = context.user;

  const checkout = await createCheckout(
    environment().LEMONSQUEEZY_STORE_ID,
    variantId,
    {
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
      checkoutData: {
        email: user.email ?? undefined,
        custom: {
          user_id: user.id,
        },
      },
      productOptions: {
        enabledVariants: [variantId],
        redirectUrl: `${environment().WEBSITE_URL}/account/billing/`,
        receiptButtonText: "Go to Dashboard",
        receiptThankYouNote: "Thank you for signing up to Rendless!",
      },
    }
  );

  const url = checkout.data?.data.attributes.url;

  if (!url) {
    throw new Response("Error creating checkout ", {
      status: 500,
    });
  }

  return json({ url: url });
};

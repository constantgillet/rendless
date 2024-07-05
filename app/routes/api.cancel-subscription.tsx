import { cancelSubscription } from "@lemonsqueezy/lemonsqueezy.js";
import type { ActionFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { configureLemonSqueezy } from "~/libs/lemonsqueezy";
import { ensureAuthenticated } from "~/libs/lucia";
import { prisma } from "~/libs/prisma";

export const validator = withZod(
	z.object({
		//convert the string to a number
		subscriptionId: z
			.string()
			.min(1, { message: "subscriptionId is required" })
			.transform((v) => Number(v)),
	}),
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

	const subscription = await prisma.subscription.findUnique({
		where: {
			id: result.data.subscriptionId,
		},
	});

	if (!subscription) {
		throw new Error("Subscription not found");
	}

	//Check if right user is trying to cancel the subscription
	if (subscription.userId !== context.user.id) {
		throw new Response("Unauthorized to cancel", {
			status: 401,
		});
	}

	const cancelledSub = await cancelSubscription(subscription.lemonSqueezyId);
	if (cancelledSub.error) {
		throw new Error(cancelledSub.error.message);
	}

	// Update the db
	try {
		await prisma.subscription.update({
			where: {
				id: subscription.id,
			},
			data: {
				status: cancelledSub.data?.data.attributes.status,
				statusFormatted: cancelledSub.data?.data.attributes.status_formatted,
				endsAt: cancelledSub.data?.data.attributes.ends_at,
			},
		});
	} catch {
		throw new Error(
			`Failed to cancel Subscription #${subscription.id} in the database.`,
		);
	}

	return cancelledSub;
};

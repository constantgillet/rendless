import {
	getProduct,
	listPrices,
	listProducts,
	type Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import type { ActionFunctionArgs } from "@remix-run/node";
import { environment } from "~/libs/environment.server";
import { configureLemonSqueezy } from "~/libs/lemonsqueezy";
import { prisma } from "~/libs/prisma";
import type { Plan } from "@prisma/client";

export async function action({ request }: ActionFunctionArgs) {
	configureLemonSqueezy();

	// Fetch all the variants from the database.
	const productVariants = await prisma.plan.findMany();

	type NewPlan = Omit<Plan, "id">;
	// Helper function to add a variant to the productVariants array and sync it with the database.
	async function _addVariant(variant: NewPlan) {
		console.log(`Syncing variant ${variant.name} with the database...`);

		//If variant is in db update it, else insert it
		if (productVariants.some((v) => v.variantId === variant.variantId)) {
			await prisma.plan.update({
				where: { variantId: variant.variantId },
				data: variant,
			});
		} else {
			await prisma.plan.create({
				data: variant,
			});

			productVariants.push({ ...variant, id: 0 });
		}

		console.log(`${variant.name} synced with the database...`);
	}

	// Fetch products from the Lemon Squeezy store.
	const products = await listProducts({
		filter: { storeId: environment().LEMONSQUEEZY_STORE_ID },
		include: ["variants"],
	});

	// Loop through all the variants.
	const allVariants = products.data?.included as Variant["data"][] | undefined;

	// for...of supports asynchronous operations, unlike forEach.
	if (allVariants) {
		/* eslint-disable no-await-in-loop -- allow */
		for (const v of allVariants) {
			const variant = v.attributes;

			// Skip draft variants or if there's more than one variant, skip the default
			// variant. See https://docs.lemonsqueezy.com/api/variants
			if (
				variant.status === "draft" ||
				(allVariants.length !== 1 && variant.status === "pending")
			) {
				// `return` exits the function entirely, not just the current iteration.
				// so use `continue` instead.
				continue;
			}

			// Fetch the Product name.
			const productName =
				(await getProduct(variant.product_id)).data?.data.attributes.name ?? "";

			// Fetch the Price object.
			const variantPriceObject = await listPrices({
				filter: {
					variantId: v.id,
				},
			});

			const currentPriceObj = variantPriceObject.data?.data.at(0);
			const isUsageBased =
				currentPriceObj?.attributes.usage_aggregation !== null;
			const interval = currentPriceObj?.attributes.renewal_interval_unit;
			const intervalCount =
				currentPriceObj?.attributes.renewal_interval_quantity;
			const trialInterval = currentPriceObj?.attributes.trial_interval_unit;
			const trialIntervalCount =
				currentPriceObj?.attributes.trial_interval_quantity;

			const price = isUsageBased
				? currentPriceObj?.attributes.unit_price_decimal
				: currentPriceObj.attributes.unit_price;

			const priceString = price !== null ? price?.toString() ?? "" : "";

			const isSubscription =
				currentPriceObj?.attributes.category === "subscription";

			// If not a subscription, skip it.
			if (!isSubscription) {
				continue;
			}

			await _addVariant({
				name: variant.name,
				description: variant.description,
				price: priceString,
				interval: interval as string,
				intervalCount: intervalCount as number,
				isUsageBased,
				productId: variant.product_id,
				productName,
				variantId: Number.parseInt(v.id) as unknown as number,
				trialInterval: trialInterval as string,
				trialIntervalCount: trialIntervalCount as number,
				sort: variant.sort,
			});
		}
	}

	return productVariants;
}

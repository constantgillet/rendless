import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

/**
 * Ensures  sets up the Lemon
 * Squeezy JS SDK. Throws an error if any environment variables are missing or
 * if there's an error setting up the SDK.
 */
export function configureLemonSqueezy() {
	lemonSqueezySetup({
		apiKey: process.env.LEMONSQUEEZY_API_KEY,
		onError: (error) => {
			throw new Error(`Lemon Squeezy API error: ${error.message}`);
		},
	});
}

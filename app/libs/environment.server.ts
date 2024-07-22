import * as z from "zod";

const environmentSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	WEBSITE_URL: z.string().min(1),
	DATABASE_URL: z.string().min(1),
	REDIS_URL: z.string().optional(),
	BUCKET_URL: z.string().min(1),
	BUCKET_NAME: z.string().min(1),
	IMAGES_FOLDER: z.string().optional().default("ogimages/cached/"),
	SPACES_KEY: z.string().min(1),
	SPACES_SECRET: z.string().min(1),
	RESEND_API_KEY: z.string().min(1),
	EMAIL_FROM: z.string().email().default("no-reply@mail.rendless.com"),
	LEMONSQUEEZY_WEBHOOK_SECRET: z.string().min(1),
	LEMONSQUEEZY_API_KEY: z.string().min(1),
	LEMONSQUEEZY_STORE_ID: z.string().default("93622"),
});

const environment = () => environmentSchema.parse(process.env);

export { environment };

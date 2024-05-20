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
});

const environment = () => environmentSchema.parse(process.env);

export { environment };

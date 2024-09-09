// TODO: Fix by creating a function that return the value of the env variable

export const BUCKET_URL =
	typeof process !== "undefined" ? process?.env?.BUCKET_URL : "";
export const MAX_IMAGE_SIZE = 5_000_000;
export const BUCKET_NAME =
	typeof process !== "undefined" ? process?.env?.BUCKET_NAME : "";

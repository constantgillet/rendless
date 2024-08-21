export type PublicEnv = {
	WEBSITE_URL: string;
	GA_TRACKING_ID: string;
};

export function getPublicEnv<T extends keyof PublicEnv>(key: T) {
	return typeof window === "undefined"
		? (process.env[key] as PublicEnv[T])
		: window.ENV[key];
}

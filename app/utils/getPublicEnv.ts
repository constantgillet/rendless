import { environment } from "~/libs/environment.server";

export type PublicEnv = {
  WEBSITE_URL: string;
};

export function getPublicEnv<T extends keyof PublicEnv>(key: T): PublicEnv[T] {
  return typeof window === "undefined" ? environment()[key] : window.ENV[key];
}

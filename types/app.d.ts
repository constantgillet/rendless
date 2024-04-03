import "@remix-run/server-runtime";
import { availableLanguageTags } from "~/paraglide/runtime";
import { PublicEnv } from "~/utils/getPublicEnv";

type Context = {
  user?: null | {
    id: string;
    username: string;
    email: string;
  };
  session?: null | {
    id: string;
  };
  lang: (typeof availableLanguageTags)[number];
};

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext extends Context {}
}

declare global {
  namespace Express {
    interface NextFunction {
      locales: Context;
    }
  }
  interface Window {
    ENV: PublicEnv;
  }
}

declare module "express" {
  export interface Response {
    locals: Context;
  }
}

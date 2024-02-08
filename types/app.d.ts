import "@remix-run/server-runtime";

type Context = {
  user?: null | {
    username: string;
    email: string;
  };
  session?: null | {
    id: string;
  };
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
}

declare module "express" {
  export interface Response {
    locals: Context;
  }
}

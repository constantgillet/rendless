import { Request, Response, NextFunction } from "express";
import { lucia } from "../app/libs/lucia";

export async function setupRemixContext(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.name = "test3";

  const auth = await validateAuth(req, res);

  next();
}

//validate auth
const validateAuth = async (req: Request, res: Response) => {
  const sessionId = req.cookies[lucia.sessionCookieName];

  if (!sessionId) {
    console.log("no session id");

    return { session: null, user: null };
  }

  const result = await lucia.validateSession(sessionId);

  // next.js throws when you attempt to set cookie when rendering page
  try {
    console.log("result", result);

    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      res.cookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      res.cookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    return result;
  } catch (e) {
    console.error(e);
  }
};

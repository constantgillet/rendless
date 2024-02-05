import { Request, Response, NextFunction } from "express";
import { lucia } from "../app/libs/lucia";

export async function setupRemixContext(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = await validateAuth(req, res);

  if (auth?.user) {
    res.locals.user = {
      username: auth.user.username,
      email: auth.user.email as unknown as string,
    };
  } else {
    res.locals.user = null;
  }

  next();
}

//validate auth
const validateAuth = async (req: Request, res: Response) => {
  const sessionId = req.cookies[lucia.sessionCookieName];

  if (!sessionId) {
    return { session: null, user: null };
  }

  const result = await lucia.validateSession(sessionId);

  // next.js throws when you attempt to set cookie when rendering page
  try {
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

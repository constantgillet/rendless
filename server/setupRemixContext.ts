import { Request, Response, NextFunction } from "express";
import { lucia } from "../app/libs/lucia";

export async function setupRemixContext(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.name = "test3";
  const auth = await validateAuth(req, res);

  console.log(auth?.user);

  next();
}

//validate auth
const validateAuth = async (req: Request, res: Response) => {
  const sessionId = req.cookies[lucia.sessionCookieName];

  console.log(sessionId);

  // next.js throws when you attempt to set cookie when rendering page
  try {
    const result = await lucia.validateSession(sessionId);

    // if (result.session && result.session.fresh) {
    //   const sessionCookie = lucia.createSessionCookie(result.session.id);
    //   res.cookie(
    //     sessionCookie.name,
    //     sessionCookie.value,
    //     sessionCookie.attributes
    //   );
    // }
    // if (!result.session) {
    //   const sessionCookie = lucia.createBlankSessionCookie();
    //   res.cookie(
    //     sessionCookie.name,
    //     sessionCookie.value,
    //     sessionCookie.attributes
    //   );
    // }

    return result;
  } catch (e) {
    console.error(e);
  }
};

import { createCookie } from "@remix-run/node";
import { lucia } from "./lucia";

export const authCookie = createCookie(lucia.sessionCookieName, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
  maxAge: 1209600,
});

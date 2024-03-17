import { createCookie } from "@remix-run/node"; // or cloudflare/deno
import { LANGUAGE_COOKIE } from "~/constants/cookiesNames";

export const languageCookie = createCookie(LANGUAGE_COOKIE);

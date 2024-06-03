import type { Request, Response, NextFunction } from "express";
import { lucia } from "../app/libs/lucia";
import {
	availableLanguageTags,
	sourceLanguageTag,
} from "../app/paraglide/runtime";
import { languageCookie } from "../app/libs/cookies.server";

export async function setupRemixContext(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const auth = await validateAuth(req, res);
	const language = await getLanguage(req);

	res.locals.lang = language;

	if (auth?.user && auth?.session) {
		res.locals.user = {
			id: auth.user.id,
			username: auth.user.username,
			email: auth.user.email as unknown as string,
		};
		res.locals.session = {
			id: auth.session.id,
		};
	} else {
		res.locals.user = null;
		res.locals.session = null;
	}

	next();
}

//validate auth
const validateAuth = async (req: Request, res: Response) => {
	const sessionId = req.cookies[lucia.sessionCookieName];

	if (!sessionId) {
		return { session: null, user: null };
	}

	// next.js throws when you attempt to set cookie when rendering page
	try {
		const result = await lucia.validateSession(sessionId);

		if (result.session?.fresh) {
			const sessionCookie = lucia.createSessionCookie(result.session.id);
			res.cookie(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);
		}
		if (!result.session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			res.cookie(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);
		}

		return result;
	} catch (e) {
		console.error(e);
	}
};

const getLanguage = async (req: Request) => {
	//Get cookie language

	const cookieLanguageValue = await languageCookie.parse(
		req.headers.cookie || "",
	);

	if (
		cookieLanguageValue &&
		availableLanguageTags.includes(
			cookieLanguageValue as (typeof availableLanguageTags)[number],
		)
	) {
		return cookieLanguageValue as (typeof availableLanguageTags)[number];
	}

	const aceptedLanguages = req.acceptsLanguages();
	const filteredLanguages = aceptedLanguages.filter((lang) => {
		return [availableLanguageTags].includes(lang);
	});

	if (filteredLanguages.length > 0) {
		return filteredLanguages[0] as (typeof availableLanguageTags)[number];
	}

	return sourceLanguageTag;
};

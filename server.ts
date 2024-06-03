import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express, { type NextFunction } from "express";
import morgan from "morgan";
import { setupRemixContext } from "server/setupRemixContext";
import cookieParser from "cookie-parser";

const viteDevServer =
	process.env.NODE_ENV === "production"
		? undefined
		: await import("vite").then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
			);

const remixHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		return createRequestHandler({
			build: viteDevServer
				? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
				: //@ts-ignore
					await import("./build/server/index.js"),
			getLoadContext() {
				return {
					//@ts-ignore
					...res.locals,
				};
			},
			//@ts-ignore
		})(req, res, next);
	} catch (error) {
		next(error);
	}
};

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
	app.use(viteDevServer.middlewares);
} else {
	// Vite fingerprints its assets so we can cache forever.
	app.use(
		"/assets",
		express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
	);
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

app.use(cookieParser());

// handle SSR requests
//@ts-ignore
app.all("*", setupRemixContext, remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
	console.log(`Express server listening at http://localhost:${port}`),
);

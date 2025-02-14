import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import radixStyle from "@radix-ui/themes/styles.css?url";
import { Theme } from "@radix-ui/themes";
import style from "./global.css?url";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { environment } from "./libs/environment.server";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

export const links: LinksFunction = () => {
	return [
		{
			rel: "stylesheet",
			href: style,
		},
		{
			rel: "stylesheet",
			href: radixStyle,
		},
	];
};

export const loader = ({ context: { user, lang } }: LoaderFunctionArgs) => {
	return {
		user,
		lang,
		ENV: {
			WEBSITE_URL: environment().WEBSITE_URL,
			GA_TRACKING_ID: environment().GA_TRACKING_ID,
		},
	};
};

export default function App() {
	const { lang, ENV } = useLoaderData<typeof loader>();

	return (
		<html lang={lang}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" type="image/png" href="/images/favicon-xl.png" />
				<Meta />
				<Links />
			</head>
			<body className="dark">
				{process.env.NODE_ENV === "development" ||
				!ENV.GA_TRACKING_ID ? null : (
					<>
						<script
							async
							src={`https://www.googletagmanager.com/gtag/js?id=${ENV.GA_TRACKING_ID}`}
						/>
						<script
							async
							id="gtag-init"
							dangerouslySetInnerHTML={{
								__html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${ENV.GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
							}}
						/>
					</>
				)}
				<Toaster position="bottom-center" reverseOrder={true} />
				<Theme accentColor="indigo" grayColor="slate" radius="medium">
					<Outlet />
				</Theme>
				<ScrollRestoration />
				<script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(ENV)}`,
					}}
				/>
				<Scripts />
			</body>
		</html>
	);
}

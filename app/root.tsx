import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Theme } from "@radix-ui/themes";

import styles from "./index.css";
import radixStyles from "@radix-ui/themes/styles.css";
import { Toaster } from "react-hot-toast";

export const loader = ({ context: { user, lang } }: LoaderFunctionArgs) => {
  return { user, lang };
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: radixStyles },
];

export default function App() {
  const { lang } = useLoaderData<typeof loader>();

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/images/favicon-xl.png"></link>
        <Meta />
        <Links />
      </head>
      <body className="dark">
        <Toaster position="bottom-center" reverseOrder={true} />
        <Theme accentColor="indigo" grayColor="slate" radius="medium">
          <Outlet />
        </Theme>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

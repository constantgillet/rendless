import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { ensureAuthenticated } from "~/libs/lucia";

export default function AppLayout() {
  return <Outlet />;
}

export async function loader({ context: { user } }: LoaderFunctionArgs) {
  ensureAuthenticated(user);

  return { user };
}

import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export default function AppLayout() {
  return <Outlet />;
}

export async function loader({ context: { name } }: LoaderFunctionArgs) {
  // code here
  console.log("loader _app");

  return { name };
}

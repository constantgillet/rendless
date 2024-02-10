import { useRouteLoaderData } from "@remix-run/react";
import { loader } from "../root";

export const useUser = () => {
  const rootLoader = useRouteLoaderData<typeof loader>("root");
  return rootLoader?.user;
};

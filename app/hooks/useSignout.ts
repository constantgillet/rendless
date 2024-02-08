import { useFetcher } from "@remix-run/react";

export const useSignout = () => {
  const fetcher = useFetcher();

  const signout = async () => {
    fetcher.submit(
      {},
      {
        action: "/api/auth/signout",
        method: "POST",
      }
    );
  };

  return signout;
};

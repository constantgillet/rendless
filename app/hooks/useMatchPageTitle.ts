import { useMatches } from "@remix-run/react";

/**
 * Get the title of the current page
 * @returns {string} The title of the current page
 * @example
 * const title = useMatchPageTitle();
 */
export const useMatchPageTitle = () => {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  return lastMatch?.handle?.pageTitle || "";
};

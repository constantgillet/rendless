import { Button, Link } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";

function getLocalStorage(key: string, defaultValue: any) {
  const stickyValue = localStorage.getItem(key);

  return stickyValue !== null && stickyValue !== "undefined"
    ? JSON.parse(stickyValue)
    : defaultValue;
}

function setLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

type CookieConsent = null | "granted" | "denied";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  const setCookieConsent = (value: CookieConsent) => {
    if (!value) return;

    setShowBanner(false);
    setLocalStorage("cookie_consent", value);

    // window.gtag("consent", "update", {
    //   analytics_storage: value,
    // });
  };

  useEffect(() => {
    const storedCookieConsent = getLocalStorage("cookie_consent", null);

    //If the user has not accepted or denied the cookie consent, show the banner
    if (storedCookieConsent === null) {
      return setShowBanner(true);
    }

    //Apply the user's choice
    setCookieConsent(storedCookieConsent);
  }, []);

  return (
    <div
      style={{
        display: showBanner ? "block" : "none",
      }}
      className={css({
        display: "flex",
        flexDirection: "row",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 8,
        backgroundColor: "var(--gray-2)",
        borderTop: "1px solid",
        borderColor: "var(--gray-4)",
        zIndex: 20,
      })}
    >
      <p
        className={css({
          maxWidth: "4xl",
          fontSize: "sm",
          lineHeight: 2,
        })}
      >
        This website uses cookies to enhance your browsing experience, analyze
        site traffic, and serve better user experiences. By continuing to use
        this site, you consent to our use of cookies. Learn more in our{" "}
        <Link className="font-semibold text-primary" href="/cookies">
          cookie policy
        </Link>
      </p>

      <div className="flex gap-2">
        <div
          className={css({
            display: "flex",
            gap: 5,
          })}
        >
          <Button onClick={() => setCookieConsent("granted")} type="button">
            Accept all 🍪
          </Button>
          <button
            onClick={() => setCookieConsent("denied")}
            type="button"
            className="text-sm font-semibold leading-6 text-neutral-12"
          >
            Reject all
          </button>
        </div>
      </div>
    </div>
  );
}

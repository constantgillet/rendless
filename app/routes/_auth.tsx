import { Button, Link } from "@radix-ui/themes";
import { Outlet } from "@remix-run/react";
import { css } from "styled-system/css";

export default function AuthLayout() {
  return (
    <main
      className={css({
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <div
        className={css({
          position: "absolute",
          top: 0,
          left: 0,
          padding: "var(--space-4)",
        })}
      >
        <Link href="/">
          <Button variant="ghost" color="gray" size="3">
            Back to Home
          </Button>
        </Link>
      </div>
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <div
          className={css({
            maxWidth: 360,
            width: "100%",
            margin: "auto",
          })}
        >
          <Outlet />
        </div>
      </div>
    </main>
  );
}

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

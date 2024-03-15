import { Outlet } from "@remix-run/react";

export default function SettingsLayout() {
  return (
    <div>
      outlet
      <Outlet />
    </div>
  );
}

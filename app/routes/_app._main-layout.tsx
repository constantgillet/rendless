import { Avatar, Button, DropdownMenu, IconButton } from "@radix-ui/themes";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { css, cx } from "styled-system/css";
import { container } from "styled-system/patterns";
import { Icon, IconName } from "~/components/Icon";
import { useMatchPageTitle } from "~/hooks/useMatchPageTitle";
import { useSignout } from "~/hooks/useSignout";
import { useUser } from "~/hooks/useUser";
import * as m from "~/paraglide/messages";

const links: {
  label: string;
  href: string;
  iconName: IconName;
  disabled?: boolean;
}[] = [
  {
    label: "Home",
    href: "/app",
    iconName: "home",
  },
  {
    label: "Templates",
    href: "/templates",
    iconName: "templates",
  },
  {
    label: "Logs",
    href: "/logs",
    iconName: "data-bar-horizontal",
    disabled: true,
  },
  {
    label: m.settings(),
    href: "/account",
    iconName: "settings",
  },
];

const linkClassName = css({
  fontSize: "sm",
  color: "var(--gray-11)",
  _hover: {
    textDecoration: "underline",
  },
  alignItems: "center",
  display: "flex",
});

export default function MainLayout() {
  const pageTitle = useMatchPageTitle();

  const signout = useSignout();
  const user = useUser();

  const { pathname } = useLocation();

  return (
    <div>
      <header
        className={css({
          borderBottom: "1px solid var(--gray-a5)",
          backgroundColor: "var(--color-panel)",
          paddingY: "18px",
        })}
      >
        <div
          className={cx(
            container({
              display: "flex",
              justifyContent: "space-between",
            })
          )}
        >
          <div
            className={css({
              display: "flex",
            })}
          >
            <div
              className={css({
                mr: "24px",
              })}
            >
              <Link to={"/app"}>
                <img
                  src="/images/rendless-logo.png"
                  alt="Logo"
                  width={120}
                  height={"auto"}
                />
              </Link>
            </div>
            <div
              className={css({
                spaceX: "24px",
                display: "flex",
                gap: "4px",
              })}
            >
              {links.map((link) => (
                <Link key={link.href} to={link.href} title={link.label}>
                  <Button
                    variant="ghost"
                    size="3"
                    color="gray"
                    style={{
                      background: link.href.includes(pathname)
                        ? "var(--gray-a3)"
                        : undefined,
                    }}
                    disabled={link.disabled}
                  >
                    <Icon name={link.iconName} size="md" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div className={css({ display: "flex", gap: 4 })}>
            <div className={css({ display: "flex", gap: "2" })}>
              <Link to={"https://docs.rendless.com"} className={linkClassName}>
                Doc
                <Icon
                  name="open"
                  size="md"
                  className={css({
                    transform: "translateY(-8px)",
                    ml: "1",
                  })}
                />
              </Link>
            </div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost" size="2" color="gray">
                  {user?.username}
                  <Avatar
                    fallback={user?.username[0] || ""}
                    size="1"
                    radius="full"
                  />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <Link to={"/account"}>
                  <DropdownMenu.Item>General settings</DropdownMenu.Item>
                </Link>
                <Link to={"/onboarding"}>
                  <DropdownMenu.Item>Onboarding</DropdownMenu.Item>
                </Link>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  onClick={() => {
                    signout();
                  }}
                >
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </header>
      <div
        className={css({
          spaceY: "24px",
        })}
      >
        <div
          className={css({
            h: "160px",
            position: "relative",
            borderBottom: "1px solid var(--gray-a4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <div className={cx(container())}>
            <h1
              className={css({
                fontSize: "2xl",
                fontWeight: "semibold",
                textTransform: "capitalize",
              })}
            >
              {pageTitle}
            </h1>
          </div>

          <div
            className={css({
              position: "absolute",
              top: 0,
              left: 0,
              w: "full",
              h: "full",
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.05)'%3E%3Cpath d='M0 .5h31.5V32'/%3E%3C/svg%3E")`,
              //background: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.05)'%3E%3Cpath d='M0 .5h31.5V32'/%3E%3C/svg%3E")'%3E%3Cpath d='M0 .5h31.5V32'/%3E%3C/svg%3E)`,
              maskImage: "linear-gradient(180deg,transparent,#000)",
            })}
          ></div>
          <div
            className={css({
              top: 0,
              left: 0,
              w: "full",
              h: "full",
              position: "absolute",
              background:
                "linear-gradient(191deg, rgba(62, 99, 221, .15) 0%, rgba(0, 212, 255, 0) 44%)",
            })}
          ></div>
        </div>
        <div className={container()}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

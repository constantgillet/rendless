import { Button } from "@radix-ui/themes";
import { Link } from "@remix-run/react";
import { css, cx } from "styled-system/css";
import { container } from "styled-system/patterns";
import { Icon, IconName } from "~/components/Icon";

const links: {
  label: string;
  href: string;
  iconName: IconName;
}[] = [
  {
    label: "Home",
    href: "/app",
    iconName: "home",
  },
  {
    label: "Templates",
    href: "/app/templates",
    iconName: "templates",
  },
  {
    label: "Logs",
    href: "/app/logs",
    iconName: "data-bar-horizontal",
  },
  {
    label: "Settings",
    href: "/app/settings",
    iconName: "settings",
  },
];

export default function AppHome() {
  return (
    <div>
      <header
        className={css({
          borderBottom: "1px solid var(--gray-a5)",
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
              logo
            </div>
            <div
              className={css({
                spaceX: "24px",
              })}
            >
              {links.map((link) => (
                <Link key={link.href} to={link.href} title={link.label}>
                  <Button variant="ghost" size="3" color="gray">
                    <Icon name={link.iconName} size="md" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div>right part</div>
        </div>
      </header>
    </div>
  );
}

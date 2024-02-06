import { Button, Card, DropdownMenu, IconButton } from "@radix-ui/themes";
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
          <div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost" size="2" color="gray">
                  davendrix
                  <IconButton
                    radius="full"
                    size={"1"}
                    color="gray"
                    variant="classic"
                  >
                    C
                  </IconButton>
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item shortcut="⌘ E">Settings</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Logout</DropdownMenu.Item>
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
              })}
            >
              Home
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
          <OnboardingCard />
        </div>
      </div>
    </div>
  );
}

const OnboardingCard = () => {
  return (
    <Card
      className={css({
        position: "relative",
      })}
    >
      <div
        className={css({
          p: "16px",
        })}
      >
        <h2
          className={css({
            fontSize: "2xl",
            fontWeight: "semibold",
          })}
        >
          Get started
        </h2>
        <p
          className={css({
            color: "var(--gray-a11)",
            fontSize: "lg",
          })}
        >
          Start generating your og templates in fews clics
        </p>

        <div
          className={css({
            display: "flex",
            alignItems: "center",
            spaceX: "14px",
            mt: "24px",
          })}
        >
          <div
            className={css({
              rounded: "100%",
              width: "40px",
              height: "40px",
              color: "var(--accent-9-contrast)",
              position: "relative",
              zIndex: 0,
              boxShadow:
                "var(--base-button-classic-box-shadow-top), inset 0 0 0 1px #636465, var(--base-button-classic-box-shadow-bottom)",
              fontSize: "xl",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            })}
          >
            1
          </div>
          <div
            className={css({
              fontSize: "xl",
              fontWeight: "medium",
            })}
          >
            Generate a template
          </div>
        </div>
        <p
          className={css({
            color: "var(--gray-a11)",
          })}
        >
          Your can choose between an example template or your own design
        </p>
      </div>
      <div
        className={css({
          position: "absolute",
          top: "0px",
          left: "40px",
          width: "100px",
          height: "1px",
          background:
            "linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.67) 64.41%, rgba(236, 72, 153, 0) 98.93%)",
        })}
      ></div>
    </Card>
  );
};

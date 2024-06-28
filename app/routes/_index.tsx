import { Button } from "@radix-ui/themes";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { css } from "styled-system/css";
import { container, grid, gridItem } from "styled-system/patterns";
import * as m from "~/paraglide/messages";

export default function Index() {
  return (
    <div>
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0)'/><path d='M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z'  stroke-width='0.5' stroke='hsla(259, 1%, 57%, 0.1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`,
        }}
      >
        <Header />
        <HeroSection />
      </div>
      <FeaturesSection />
      <BottomCTA />
    </div>
  );
}

export function loader({ context: { user } }: LoaderFunctionArgs) {
  return {};
  throw redirect("/app");

  if (user) {
    throw redirect("/app");
  }

  return { ok: true };
}

const Header = () => {
  return (
    <header
      className={css({
        position: "sticky",
        top: 0,
        left: 0,
      })}
    >
      <div
        className={container({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 3,
        })}
      >
        <Link to={"/app"}>
          <img
            src="/images/rendless-logo.png"
            alt="Logo"
            width={160}
            height={"auto"}
          />
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <Link to={"/#features"}>
            <Button variant="ghost" size="3" color="gray">
              Features
            </Button>
          </Link>
          <Link to={"/#pricing"}>
            <Button variant="ghost" size="3" color="gray">
              Pricing
            </Button>
          </Link>
          <a
            href={"https://docs.rendless.com"}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="ghost" size="3" color="gray">
              Documentation
            </Button>
          </a>
        </div>
        <div>
          <Link to={"/signin"}>
            <Button size={"3"}>Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

const HeroSection = () => {
  return (
    <section>
      <div className={container({})}>
        <div
          className={css({
            spaceY: "8",
            width: "100%",
            maxWidth: "800px",
            margin: "auto",
            py: "62px",
          })}
        >
          <h1
            className={css({
              fontSize: "48px",
              fontWeight: "bold",
              textAlign: "center",
            })}
          >
            The fastest way to {""}
            <span className={"text-gradient"}>
              generate dynamic
            </span> opengraph <span className={"text-gradient"}>images</span>{" "}
          </h1>
          <p
            className={css({
              fontSize: "24px",
              textAlign: "center",
              color: "var(--gray-11)",
            })}
          >
            Generate dynamic opengraph images for your website, blog, or app
            with our simple editor and API.
          </p>
          <div>
            <Link
              to={"/signin"}
              className={css({
                w: "fit",
                mx: "auto",
                display: "block",
              })}
            >
              <Button size={"4"} variant="classic" radius="full">
                Get started
              </Button>
            </Link>
          </div>{" "}
        </div>
        <div>
          <img
            src="/images/hero-image.png"
            alt="Hero"
            width="100%"
            height="auto"
          />
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className={css({
        py: "48px",
        bg: "var(--gray-2)",
      })}
    >
      <div className={container()}>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            spaceY: "8",
            mb: "48px",
          })}
        >
          <h2
            className={css({
              fontSize: "38px",
              fontWeight: "bold",
              textAlign: "center",
            })}
          >
            Features
          </h2>
          <p
            className={css({
              fontSize: "20px",
              textAlign: "center",
              color: "var(--gray-11)",
            })}
          >
            Everything you need to create dynamic opengraph images for your
            website.
          </p>
        </div>
        <div
          className={grid({
            columns: 12,
            gap: 12,
          })}
        >
          <div
            className={gridItem({
              backgroundColor: "var(--gray-3)",
              borderRadius: "12px",
              display: "flex",
              border: "1px solid var(--gray-4)",
              overflow: "hidden",
              colSpan: 12,
            })}
          >
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                w: "65%",
                p: "32px",
                justifyContent: "center",
                alignItems: "center",
              })}
            >
              <h3
                className={css({
                  fontSize: "34px",
                  fontWeight: "bold",
                  textAlign: "center",
                  mb: "16px",
                })}
              >
                A <span className={"text-gradient"}>simple editor</span> to
                create dynamic images
              </h3>
              <p
                className={css({
                  fontSize: "20px",
                  textAlign: "center",
                  color: "var(--gray-11)",
                  px: "32px",
                  pb: "32px",
                })}
              >
                Rendless provides a simple editor to create dynamic opengraph
                images for your website, blog, or app. You can customize the
                background, text, images, and more.
              </p>
            </div>
            <div
              className={css({
                pt: "86px",
              })}
            >
              <img
                src="/images/illustration-1.png"
                alt="Illustration 1"
                width="100%"
                height="auto"
                className={css({
                  borderTopLeftRadius: "12px",
                  borderTop: "1px solid var(--gray-3)",
                  borderLeft: "1px solid var(--gray-3)",
                })}
              />
            </div>
          </div>
          <div
            className={gridItem({
              colSpan: 6,
              backgroundColor: "var(--gray-3)",
              border: "1px solid var(--gray-4)",
              borderRadius: "12px",
            })}
          >
            <h3
              className={css({
                fontSize: "34px",
                fontWeight: "bold",
                textAlign: "center",
                mb: "16px",
              })}
            >
              Ultra fast <span className={"text-gradient"}>API</span>
            </h3>
          </div>
          <div
            className={gridItem({
              colSpan: 6,
              backgroundColor: "var(--gray-3)",
              border: "1px solid var(--gray-4)",
              borderRadius: "12px",
              p: "32px",
            })}
          >
            <h3
              className={css({
                fontSize: "34px",
                fontWeight: "bold",
                textAlign: "center",
                mb: "16px",
              })}
            >
              Integrated with{" "}
              <span className={"text-gradient"}>your tools</span>
            </h3>
            <p
              className={css({
                fontSize: "20px",
                textAlign: "center",
                color: "var(--gray-11)",
                px: "32px",
                pb: "32px",
              })}
            >
              Rendless integrates with your favorite tools, frameworks, and
              languages.
            </p>
            <div
              className={grid({
                columns: 6,
                gap: 4,
              })}
            >
              <ToolItem image="/images/logos/wordpress.png" />
              <ToolItem image="/images/logos/webflow.svg" />
              <ToolItem image="/images/logos/php.webp" />
              <ToolItem image="/images/logos/symfony.webp" />
              <ToolItem image="/images/logos/shopify.webp" />
              <div
                className={css({
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bg: "var(--gray-4)",
                  p: "8px",
                  rounded: "12px",
                  textAlign: "center",
                  fontSize: "14px",
                })}
              >
                And more...
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type ToolItemProps = {
  image: string;
};

const ToolItem = ({ image }: ToolItemProps) => {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bg: "var(--gray-4)",
        p: "8px",
        rounded: "12px",
      })}
    >
      <img src={image} alt="" />
    </div>
  );
};

const BottomCTA = () => {
  return (
    <section
      className={css({
        bg: "var(--gray-2)",
        py: "48px",
      })}
    >
      <div className={container()}>
        <div
          className={css({
            p: "24px",
            bg: "var(--accent-9)",
            rounded: "18px",
            spaceY: "6",
          })}
        >
          <h2
            className={css({
              fontSize: "38px",
              fontWeight: "bold",
              textAlign: "center",
            })}
          >
            Ready to get started?
          </h2>
          <p
            className={css({
              fontSize: "20px",
              textAlign: "center",
              color: "var(--gray-12)",
              w: "full",
              mx: "auto",
              maxWidth: "500px",
            })}
          >
            Create dynamic opengraph images for your website, blog, or app with
            Rendless.
          </p>
          <div>
            <Link
              to={"/signin"}
              className={css({
                w: "fit",
                mx: "auto",
                display: "block",
              })}
            >
              <Button size={"4"} highContrast>
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

import { Button } from "@radix-ui/themes";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { css } from "styled-system/css";
import { container } from "styled-system/patterns";
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
      <h1>Index 1</h1>
      <p>{m.hello_world()}</p>
      <p></p>
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
            <span className={css({ color: "var(--accent-9)" })}>
              generate dynamic
            </span>{" "}
            opengraph{" "}
            <span className={css({ color: "var(--accent-9)" })}>images</span>{" "}
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
        py: "px",
        bg: "var(--gray-2)",
      })}
    >
      <h2
        className={css({
          fontSize: "38px",
          fontWeight: "bold",
          textAlign: "center",
          mb: "32px",
        })}
      >
        Features
      </h2>
    </section>
  );
};

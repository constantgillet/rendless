import { Button, Card, TextField } from "@radix-ui/themes";
import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { css } from "styled-system/css";
import { Icon } from "~/components/Icon";
import { prisma } from "~/libs/prisma";

export async function loader({ context }: LoaderFunctionArgs) {
  const userId = context.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const templates = await prisma.template.findMany({
    where: {
      userId,
    },
  });

  if (templates.length === 0) {
    throw redirect("/onboarding");
  }

  return json({ ok: true });
}

export default function AppHome() {
  return (
    <>
      <OnboardingCard />
    </>
  );
}

export const handle = {
  pageTitle: "Welcome to Rendless",
};

export const meta: MetaFunction = () => {
  return [{ title: "Home - Rendless" }];
};

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
      ></div>
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

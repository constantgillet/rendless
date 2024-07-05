import { Badge, Button } from "@radix-ui/themes";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { css } from "styled-system/css";
import { grid, gridItem } from "styled-system/patterns";
import { prisma } from "~/libs/prisma";

export const meta: MetaFunction = () => {
  return [{ title: "Billing - Rendless" }];
};

export const handle = {
  pageTitle: "Billing",
};

export const loader = async ({
  context: { user, lang },
}: LoaderFunctionArgs) => {
  const plans = await prisma.plan.findMany();

  const monthly = plans.find((plan) => plan.interval === "month");
  const yearly = plans.find((plan) => plan.interval === "year");

  if (!monthly || !yearly) {
    throw new Error("Missing plans");
  }

  return {
    monthly: {
      ...monthly,
      price: Number(monthly.price),
    },
    yearly: {
      ...yearly,
      price: Number(yearly.price) / 12,
    },
  };
};

export default function BillingPage() {
  const { monthly, yearly } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1
        className={css({
          fontSize: "xl",
          fontWeight: "bold",
          color: "var(--gray-11)",
          marginBottom: "4",
        })}
      >
        Billing
      </h1>
      <div>
        <div
          className={grid({
            columns: 12,
            gap: 12,
            w: "full",
            maxW: "900px",
            mx: "auto",
          })}
        >
          <PlanCard variantId={monthly.variantId} price={monthly.price} />
          <PlanCard variantId={yearly.variantId} price={yearly.price} />
        </div>
      </div>
    </div>
  );
}

type PlanCardProps = {
  variantId: number;
  price: number;
};

const PlanCard = ({ variantId, price }: PlanCardProps) => {
  return (
    <div
      className={gridItem({
        colSpan: 6,
        backgroundColor: "var(--accent-9)",
        p: "32px",
        rounded: "12px",
        border: "1px solid var(--accent-10)",
        spaceY: "6",
      })}
    >
      <div>
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <h3
            className={css({
              fontWeight: "bold",
              fontSize: "22px",
            })}
          >
            Pro Plan
          </h3>
          <Badge size="3" variant="solid" color="yellow" radius="full">
            50% off
          </Badge>
        </div>
        <div>
          <div
            className={css({
              fontSize: "42px",
              fontWeight: "bold",
            })}
          >
            {price / 100}€
          </div>
          <div>
            <span
              className={css({
                color: "var(--gray-11)",
              })}
            >
              per month, paid yearly
            </span>
          </div>
        </div>
      </div>
      <div>
        <Button size={"4"} highContrast>
          Upgrade
        </Button>
      </div>
      <div>Create unlimited dynamic opengraph images</div>
    </div>
  );
};

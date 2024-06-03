import { Card } from "@radix-ui/themes";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import { css } from "styled-system/css";
import { prisma } from "~/libs/prisma";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// import { scanAll } from "~/libs/redis.server";

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

  //Disable this page

  throw redirect("/templates");

  // return json({ ok: true });
}

export default function AppHome() {
  return (
    <>
      <HomeCard />
    </>
  );
}

export const handle = {
  pageTitle: "Home",
};

export const meta: MetaFunction = () => {
  return [{ title: "Home - Rendless" }];
};

const data = [
  {
    name: "Page A",
    rendercount: 4000,
    amt: 2400,
  },
  {
    name: "Page B",
    rendercount: 3000,
    amt: 2210,
  },
  {
    name: "Page C",
    rendercount: 2000,
    amt: 2290,
  },
  {
    name: "Page D",
    rendercount: 2780,
    amt: 2000,
  },
  {
    name: "Page E",
    rendercount: 1890,
    amt: 2181,
  },
  {
    name: "Page F",
    rendercount: 2390,
    amt: 2500,
  },
  {
    name: "Page G",
    rendercount: 3490,
    amt: 2100,
  },
];

const HomeCard = () => {
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
        <h1
          className={css({
            fontSize: "22px",
            fontWeight: "medium",
            mb: "16px",
          })}
        >
          Last 7 days renders
        </h1>
        <div
          className={css({
            mx: "auto",
            width: "fit-content",
          })}
        >
          <BarChart
            width={700}
            height={500}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              wrapperClassName={css({
                bg: "white",
                color: "black",
                border: "1px solid",
                borderColor: "gray",
                rounded: "8px",
              })}
            />
            <Legend />
            <Bar
              dataKey="rendercount"
              fill="var(--accent-9)"
              activeBar={
                <Rectangle fill="var(--accent-7)" stroke="var(--accent-12)" />
              }
              name={"Renders"}
            />
          </BarChart>
        </div>
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
      />
    </Card>
  );
};

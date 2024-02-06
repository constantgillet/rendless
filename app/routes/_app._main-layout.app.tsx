import { Card } from "@radix-ui/themes";
import { css } from "styled-system/css";

export default function AppHome() {
  return (
    <>
      <OnboardingCard />
    </>
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

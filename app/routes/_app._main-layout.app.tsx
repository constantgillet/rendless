import { Button, Card, TextField } from "@radix-ui/themes";
import { MetaFunction } from "@remix-run/node";
import { css } from "styled-system/css";

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
          Start generating your og images in fews clics
        </p>
        <div
          className={css({
            spaceY: "2",
            mt: "24px",
          })}
        >
          <Step
            number={1}
            title="Create a new template"
            description={
              "Your can choose between an example template or your own design"
            }
            content={
              <div>
                <Button>Generate a template</Button>
              </div>
            }
          />
          <Step
            number={2}
            title="Call the render API with variables"
            description={
              "You can pass variables to your template to customize the content of your image"
            }
            content={
              <div
                className={css({
                  spaceY: "2",
                })}
              >
                <TextField.Input
                  disabled
                  value={`https://dev.rendless.com/api/render/my-template?name=davendrix`}
                />
                <Button>Render the Image</Button>
              </div>
            }
          />
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
      ></div>
    </Card>
  );
};

const Step = ({
  number,
  title,
  description,
  content,
  disabled = false,
}: {
  number: number;
  title: string;
  description: string;
  content: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <div
      aria-disabled={disabled}
      className={css({
        '&[aria-disabled="true"]': {
          opacity: 0.4,
          pointerEvents: "none",
        },
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          spaceX: "14px",
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
          {number}
        </div>
        <div
          className={css({
            fontSize: "xl",
            fontWeight: "medium",
          })}
        >
          {title}
        </div>
      </div>
      <div
        className={css({
          display: "flex",
        })}
      >
        <div
          className={css({
            width: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <div
            className={css({
              backgroundColor: "var(--gray-a7)",
              width: "2px",
              height: "100%",
            })}
          ></div>
        </div>
        <div
          className={css({
            spaceY: "4",
            pb: "24px",
            width: "100%",
          })}
        >
          <p
            className={css({
              color: "var(--gray-a11)",
              maxWidth: "400px",
            })}
          >
            {description}
          </p>
          {content}
        </div>
      </div>
    </div>
  );
};

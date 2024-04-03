import { Button, Card, TextField } from "@radix-ui/themes";
import { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import toast from "react-hot-toast";
import { css } from "styled-system/css";
import { Icon } from "~/components/Icon";
import { Spinner } from "~/components/Spinner";
import { useUser } from "~/hooks/useUser";
import { getPublicEnv } from "~/utils/getPublicEnv";

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
  return [{ title: "Onboarding - Rendless" }];
};

const OnboardingCard = () => {
  const [templateNameCreated, setTemplateNameCreated] = useState<{
    templateId: string;
    templateName: string;
  } | null>(null);

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
              <FirstStepComponent onSuccessCreated={setTemplateNameCreated} />
            }
          />
          <Step
            number={2}
            title="Call the render API with variables"
            description={
              "You can pass variables to your template to customize the content of your image"
            }
            disabled={!templateNameCreated}
            content={
              <SecondStepComponent
                templateName={templateNameCreated?.templateName || null}
              />
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
        transition: "opacity 0.6s  ease-in-out",
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
              width: "1px",
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

const FirstStepComponent = ({
  onSuccessCreated,
}: {
  onSuccessCreated?: ({
    templateId,
    templateName,
  }: {
    templateId: string;
    templateName: string;
  }) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [templateIdCreated, setTemplateIdCreated] = useState<string | null>(
    null
  );

  const onClick = async () => {
    if (isLoading || templateIdCreated) {
      return;
    }

    setIsLoading(true);
    const response = await fetch("/api/create-template?noredirect=true", {
      method: "POST",
    });

    setIsLoading(false);
    if (response.status === 401) {
      return;
    }

    const data = await response.json();

    if (data.id) {
      toast.success("Template created");
      setTemplateIdCreated(data.id);
      onSuccessCreated?.({
        templateId: data.id,
        templateName: data.name,
      });
    }
  };

  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
      })}
    >
      <Button onClick={onClick} disabled={templateIdCreated ? true : false}>
        {isLoading && (
          <>
            <Spinner size={16} />
          </>
        )}
        Generate a template
      </Button>
      {templateIdCreated && (
        <div
          className={css({
            color: "var(--green-9)",
            fontSize: "sm",
            ml: "16px",
          })}
        >
          <Icon
            name="checkmark-circle"
            className={css({
              mr: "4px",
            })}
          />
          Template created! You can now edit it{" "}
          <a
            href={`/editor/${templateIdCreated}`}
            rel="noreferrer"
            target="_blank"
            className={css({
              textDecoration: "underline",
            })}
          >
            here
          </a>
        </div>
      )}
    </div>
  );
};

const SecondStepComponent = ({
  templateName,
}: {
  templateName: string | null;
}) => {
  const user = useUser();
  const [hasClickedRender, setHasClickedRender] = useState(false);

  const imageRenderUrl = `${getPublicEnv("WEBSITE_URL")}/api/render/${
    templateName || "your-template"
  }?name=${user?.username}`;

  return (
    <div
      className={css({
        spaceY: "4",
      })}
    >
      <div
        className={css({
          maxWidth: "482px",
        })}
      >
        <TextField.Input disabled value={imageRenderUrl} />
      </div>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
        })}
      >
        <Button
          onClick={() => {
            toast.success("Image rendered");
            setHasClickedRender(true);
          }}
          disabled={hasClickedRender}
        >
          Render the Image
        </Button>
        {hasClickedRender && (
          <div
            className={css({
              color: "var(--green-9)",
              fontSize: "sm",
              ml: "16px",
            })}
          >
            <Icon
              name="checkmark-circle"
              className={css({
                mr: "4px",
              })}
            />
            You have rendered the image! You can use it in your website <head />{" "}
            as og:image
          </div>
        )}
      </div>
      {hasClickedRender ? (
        <img
          src={imageRenderUrl}
          alt="Rendered "
          className={css({
            border: "1px solid var(--gray-a7)",
            borderRadius: "6px",
            width: "348px",
            aspectRatio: "1.91 / 1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "var(--gray-a11)",
          })}
        />
      ) : (
        <div
          className={css({
            border: "1px solid var(--gray-a7)",
            borderRadius: "6px",
            width: "348px",
            aspectRatio: "1.91 / 1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "var(--gray-a11)",
          })}
        >
          <Icon name="image" size="4xl" />
          <div
            className={css({
              mt: "12px",
              fontSize: "14px",
            })}
          >
            Click on the button to render the image{" "}
          </div>
        </div>
      )}
    </div>
  );
};

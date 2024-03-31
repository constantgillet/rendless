import { Button, Card, IconButton, Inset } from "@radix-ui/themes";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import toast from "react-hot-toast";
import { css } from "styled-system/css";
import { grid, gridItem } from "styled-system/patterns";
import { DeleteTemplateButton } from "~/components/DeleteTemplateButton";
import { Icon } from "~/components/Icon";
import { Spinner } from "~/components/Spinner";
import { prisma } from "~/libs/prisma";
import { Tree } from "~/stores/EditorStore";

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

  //Convert template.tree to Tree type
  const templatesWithTree = templates.map((template) => {
    const tree = template.tree as Tree;
    return {
      ...template,
      tree,
    };
  });

  return json({ templates: templatesWithTree });
}

export default function TemplatePage() {
  const { templates } = useLoaderData<typeof loader>();

  const createTemplateFetcher = useFetcher();

  const createTemplate = async () => {
    createTemplateFetcher.submit(
      {},
      {
        action: "/api/create-template",
        method: "POST",
      }
    );
  };

  const onClickCreateButton = () => {
    if (
      createTemplateFetcher.state === "loading" ||
      createTemplateFetcher.state === "submitting"
    )
      return;

    createTemplate();
  };

  return (
    <>
      <div className={css({ spaceY: "4" })}>
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
          })}
        >
          <div
            className={css({
              fontSize: "medium",
              color: "var(--gray-a11)",
            })}
          >
            You will discover here all your images templates
          </div>
          <Button variant="classic" onClick={onClickCreateButton}>
            {createTemplateFetcher.state === "loading" ||
              (createTemplateFetcher.state === "submitting" && <Spinner />)}
            Create a template
          </Button>
        </div>
        <div className={grid({ columns: 12, gap: 6 })}>
          {templates?.map((template) => {
            const onClickCopyName = (name: string) => {
              navigator.clipboard.writeText(name);
              toast.success(`Copied ${name} to clipboard`);
            };
            return (
              <Card key={template.id} className={gridItem({ colSpan: 4 })}>
                <Inset
                  className={css({
                    backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='12' height='12' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0)'/><path d='M10-6V6M10 14v12M26 10H14M6 10H-6'  stroke-linecap='square' stroke-width='0.5' stroke='hsla(226, 70%, 55%, 0.27)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`,
                  })}
                >
                  <div
                    className={css({
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      padding: "14px",
                    })}
                  >
                    <div
                      className={css({
                        aspectRatio: "1.91/1",
                        rounded: "6px",
                        overflow: "hidden",
                      })}
                    >
                      <Link to={`/editor/${template.id}`}>
                        <img
                          src={`/api/render/${template.name}`}
                          width={"full"}
                          height={"full"}
                          alt="Og  template"
                        />
                      </Link>
                    </div>
                    <div
                      className={css({ display: "flex", alignItems: "center" })}
                    >
                      <div
                        className={css({
                          display: "flex",
                          flex: 1,
                          gap: "2",
                          alignItems: "center",
                        })}
                      >
                        {template.name}
                        <IconButton
                          size="1"
                          aria-label="Copy value"
                          color="gray"
                          variant="ghost"
                        >
                          <Icon
                            name="copy"
                            onClick={() => onClickCopyName(template.name)}
                          />
                        </IconButton>
                      </div>
                      <div className={css({ display: "flex", gap: 2 })}>
                        <Link to={`/editor/${template.id}`}>
                          <Button size="2">Edition</Button>
                        </Link>
                        <DeleteTemplateButton templateId={template.id} />
                      </div>
                    </div>
                  </div>
                </Inset>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

export const handle = {
  pageTitle: "templates",
};

export const meta: MetaFunction = () => {
  return [{ title: "Templates - Rendless" }];
};

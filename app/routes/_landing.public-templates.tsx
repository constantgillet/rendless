import { Button, Card, Inset } from "@radix-ui/themes";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import {
	Link,
	useFetcher,
	useLoaderData,
	type MetaFunction,
} from "@remix-run/react";
import { css, cx } from "styled-system/css";
import { container, grid, gridItem } from "styled-system/patterns";
import { Icon } from "~/components/Icon";
import { UpgradeCallout } from "~/components/UpgradeCallout";
import {
	type PublicTemplate,
	publicTemplates,
} from "~/constants/publicTemplates";
import { useUser } from "~/hooks/useUser";
import { prisma } from "~/libs/prisma";

export const meta: MetaFunction = () => {
	return [{ title: "Public templates - Rendless" }];
};

export async function loader({ context }: LoaderFunctionArgs) {
	const userId = context.user?.id;

	if (!userId) {
		return json({ templatesNumber: 0, hasSubscription: false });
	}

	//Count the numver
	const templatesNumber = await prisma.template.count({
		where: {
			userId,
		},
	});

	const subscription = await prisma.subscription.findFirst({
		where: {
			userId: userId,
			//Status is active or on_trial
			status: {
				in: ["active", "on_trial"],
			},
		},
	});

	const hasSubscription = Boolean(subscription);

	return json({ templatesNumber: templatesNumber, hasSubscription });
}

export default function PublicTemplates() {
	const { templatesNumber, hasSubscription } = useLoaderData<typeof loader>();
	const user = useUser();

	return (
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
				<div
					className={cx(
						container({
							spaceY: "4",
						}),
					)}
				>
					<h1
						className={css({
							fontSize: "2xl",
							fontWeight: "semibold",
							textTransform: "capitalize",
						})}
					>
						Public Templates
					</h1>
					<p>
						Browse and use use pre made templates to render faster your og
						images
					</p>
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
			<div
				className={container({
					spaceY: "24px",
				})}
			>
				{hasSubscription || !user ? null : <UpgradeCallout />}
				<div
					className={cx(
						grid({
							columns: 12,
							gap: 4,
						}),
					)}
				>
					{publicTemplates.map((template) => {
						return (
							<PublicTemplateCard
								key={template.name}
								template={template}
								canDuplicate={templatesNumber < 2 || hasSubscription || false}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}

type PublicTemplateCardProps = {
	template: PublicTemplate;
	canDuplicate?: boolean;
};

const PublicTemplateCard = ({ template }: PublicTemplateCardProps) => {
	const user = useUser();

	const createTemplateFetcher = useFetcher();

	const createTemplate = async () => {
		createTemplateFetcher.submit(
			{
				fromPublicTemplate: template.name,
			},
			{
				action: "/api/create-template",
				method: "POST",
			},
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
		<Card key={template.name} className={gridItem({ colSpan: 4 })}>
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
						<img
							src={template.preview}
							width={"full"}
							height={"full"}
							alt="Og  template"
						/>
					</div>
					{user ? (
						<div>
							<Button
								variant="outline"
								loading={
									createTemplateFetcher.state === "submitting" ||
									createTemplateFetcher.state === "loading"
								}
								onClick={onClickCreateButton}
							>
								Use Template
								<Icon name="chevron-right" />
							</Button>
						</div>
					) : (
						<Link to={"/login"}>
							<Button variant="outline">Login to use</Button>
						</Link>
					)}
				</div>
			</Inset>
		</Card>
	);
};

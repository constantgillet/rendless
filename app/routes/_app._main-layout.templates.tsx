import {
	Badge,
	Button,
	Callout,
	Card,
	DropdownMenu,
	IconButton,
	Inset,
} from "@radix-ui/themes";
import {
	type LoaderFunctionArgs,
	type MetaFunction,
	json,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { css } from "styled-system/css";
import { grid, gridItem } from "styled-system/patterns";
import { DeleteTemplateModal } from "~/components/DeleteTemplateModal";
import { Icon } from "~/components/Icon";
import { Spinner } from "~/components/Spinner";
import { UpgradeCallout } from "~/components/UpgradeCallout";
import { UseTemplateDialog } from "~/components/UseTemplateDialog";
import { prisma } from "~/libs/prisma";
import type { Tree } from "~/stores/EditorStore";
import { getAllVariablesList } from "~/utils/getAllVariablesList";

export async function loader({ context }: LoaderFunctionArgs) {
	const userId = context.user?.id;

	if (!userId) {
		throw new Error("User not found");
	}

	const templates = await prisma.template.findMany({
		where: {
			userId,
		},
		orderBy: {
			updatedAt: "desc",
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

	//Convert template.tree to Tree type
	const templatesWithTree = templates.map((template) => {
		const tree = template.tree as Tree;
		return {
			...template,
			tree,
		};
	});

	return json({ templates: templatesWithTree, hasSubscription });
}

export default function TemplatePage() {
	const { templates, hasSubscription } = useLoaderData<typeof loader>();

	const createTemplateFetcher = useFetcher();

	const createTemplate = async () => {
		createTemplateFetcher.submit(
			{},
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
		<>
			<div className={css({ spaceY: "4" })}>
				{hasSubscription ? null : <UpgradeCallout />}
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
					<div
						className={css({
							display: "flex",
							gap: "4",
						})}
					>
						<Link to="/public-templates">
							<Button variant="outline">Public templates</Button>
						</Link>
						<Button
							variant="classic"
							onClick={onClickCreateButton}
							disabled={templates?.length >= 1 && !hasSubscription}
						>
							{createTemplateFetcher.state === "loading" ||
								(createTemplateFetcher.state === "submitting" && <Spinner />)}
							Create a template
						</Button>
					</div>
				</div>

				{templates?.length > 0 ? (
					<div className={grid({ columns: 12, gap: 6 })}>
						{templates?.map((template) => {
							return (
								<TemplateCard
									key={template.id}
									template={template}
									canDuplicate={templates.length < 2 || hasSubscription}
								/>
							);
						})}
					</div>
				) : (
					<div>
						<div
							className={css({
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								gap: "4",
								color: "var(--gray-a11)",
								flexDirection: "column",
								py: "64px",
							})}
						>
							<Icon name="image" size="4xl" />
							<div className={css({ fontSize: "16px" })}>
								There is no template yet
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
const onClickCopyId = (id: string) => {
	navigator.clipboard.writeText(id);
	toast.success(`Copied ${id} to clipboard`);
};

const TemplateCard = ({
	template,
	canDuplicate,
}: {
	template: {
		id: string;
		name: string;
		tree: Tree;
	};
	canDuplicate?: boolean;
}) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [useTemplateDialogOpen, setUseTemplateDialogOpen] = useState(false);

	const variables = getAllVariablesList(template.tree);

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
								src={`/api/simple-url/${template.id}`}
								width={"full"}
								height={"full"}
								alt="Og  template"
							/>
						</Link>
					</div>
					<div
						className={css({
							display: "flex",
							alignItems: "center",
						})}
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
							<Badge>{template.id}</Badge>
							<IconButton
								size="1"
								aria-label="Copy value"
								color="gray"
								variant="ghost"
							>
								<Icon name="copy" onClick={() => onClickCopyId(template.id)} />
							</IconButton>{" "}
						</div>
						<div></div>
						<div className={css({ display: "flex", gap: 2 })}>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button variant="surface" highContrast>
										Actions <Icon name="chevron-down" />
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<Link to={`/editor/${template.id}`}>
										<DropdownMenu.Item>Edit</DropdownMenu.Item>
									</Link>
									<DropdownMenu.Item
										onClick={() => setUseTemplateDialogOpen(true)}
									>
										Use template
									</DropdownMenu.Item>
									<DuplicateTemplateDropdownItem
										templateId={template.id}
										canDuplicate={canDuplicate}
									/>
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										color="red"
										onClick={() => setModalOpen(true)}
									>
										Delete
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
							<UseTemplateDialog
								templateId={template.id}
								open={useTemplateDialogOpen}
								onOpenChange={(open) => setUseTemplateDialogOpen(open)}
								variables={variables}
							/>
							<DeleteTemplateModal
								templateId={template.id}
								open={modalOpen}
								onOpenChange={(open) => setModalOpen(open)}
							/>
							{/* <Link to={`/editor/${template.id}`}>
            <Button size="2">Edition</Button>
          </Link>
          <DeleteTemplateButton templateId={template.id} /> */}
						</div>
					</div>
				</div>
			</Inset>
		</Card>
	);
};

const DuplicateTemplateDropdownItem = ({
	templateId,
	canDuplicate,
}: {
	templateId: string;
	canDuplicate?: boolean;
}) => {
	const duplicateTemplateFetcher = useFetcher();

	const duplicateTemplate = async () => {
		duplicateTemplateFetcher.submit(
			{
				fromTemplateId: templateId,
			},
			{
				action: "/api/create-template",
				method: "POST",
			},
		);
	};

	const onClickDuplicateButton = () => {
		if (!canDuplicate) return;

		if (
			duplicateTemplateFetcher.state === "loading" ||
			duplicateTemplateFetcher.state === "submitting"
		)
			return;

		duplicateTemplate();
	};

	return (
		<DropdownMenu.Item
			onClick={onClickDuplicateButton}
			disabled={!canDuplicate}
		>
			{duplicateTemplateFetcher.state === "loading" ||
				(duplicateTemplateFetcher.state === "submitting" && <Spinner />)}
			Duplicate
		</DropdownMenu.Item>
	);
};

export const handle = {
	pageTitle: "templates",
};

export const meta: MetaFunction = () => {
	return [{ title: "Templates - Rendless" }];
};

import { css } from "styled-system/css";
import { Icon } from "./Icon";
import {
	AlertDialog,
	Badge,
	Button,
	Callout,
	Dialog,
	Flex,
	IconButton,
	Tooltip,
} from "@radix-ui/themes";
import { type Tool, useEditorStore } from "../stores/EditorStore";

import { ValidatedForm, useFormContext } from "remix-validated-form";
import { FormInput, FormSubmitButton } from "./Form";
import { useEffect, useMemo, useState } from "react";
import {
	editTemplateNameValidator,
	type action as updateTemplateNameAction,
} from "~/routes/api.update-template-name";
import { Link, useFetcher } from "@remix-run/react";
import { Spinner } from "./Spinner";
import { SaveTreeIndicator } from "./SaveTreeIndicator";
import toast from "react-hot-toast";
import { UseTemplateDialog } from "./UseTemplateDialog";
import { getAllVariablesList } from "~/utils/getAllVariablesList";

const toolsData = [
	{
		name: "select",
		icon: "cursor",
		tooltipText: "Select frame elements (V)",
	},
	{
		name: "text",
		icon: "text",
		tooltipText: "Add a text box (T)",
	},
	{
		name: "rect",
		icon: "shape",
		tooltipText: "Add a shape (R)",
	},
	{
		name: "image",
		icon: "image",
		tooltipText: "Add an image (I)",
	},
];

type TopBarProps = {
	initalName: string;
	templateId: string;
};

export const TopBar = ({ initalName, templateId }: TopBarProps) => {
	const selectedTool = useEditorStore((state) => state.selectedTool);
	const setSelectedTool = useEditorStore((state) => state.setSelectedTool);

	return (
		<header
			className={css({
				top: 0,
				left: 0,
				height: "58px",
				borderBottom: "1px solid var(--gray-a5)",
				backgroundColor: "var(--color-panel)",
				width: "100%",
			})}
		>
			<div
				className={css({
					paddingX: "var(--space-3)",
					height: "100%",
					display: "flex",
				})}
			>
				<div
					className={css({
						flex: 1,
						display: "flex",
						justifyContent: "left",
						alignItems: "center",
						gap: "var(--space-2)",
					})}
				>
					<Link
						to="/templates"
						title="Back to templates"
						className={css({
							display: "flex",
							alignItems: "center",
							gap: "var(--space-2)",
							color: "var(--color-text)",
							textDecoration: "none",
						})}
					>
						<Icon name="chevron-left" />
						<Icon
							name="rendless"
							size="2xl"
							className={css({
								color: "var(--accent-9)",
							})}
						/>
					</Link>
					<TemplateNameButton templateId={templateId} initalName={initalName} />
				</div>
				<div
					className={css({
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						height: "100%",
						gap: "var(--space-2)",
						flex: 1,
					})}
				>
					{toolsData.map(({ name, icon, tooltipText }) => (
						<Tooltip content={tooltipText} key={name}>
							<IconButton
								size="3"
								variant={selectedTool === name ? "solid" : "outline"}
								radius="none"
								onClick={() => setSelectedTool(name as Tool)}
							>
								<Icon name={icon} size="lg" />
							</IconButton>
						</Tooltip>
					))}
				</div>

				<div
					className={css({
						gap: "var(--space-2)",
						display: "flex",
						flex: 1,
						justifyContent: "flex-end",
						alignItems: "center",
					})}
				>
					<SaveTreeIndicator templateId={templateId} />
					<UseTemplateButton templateId={templateId} />
				</div>
			</div>
		</header>
	);
};

type TemplateNameButtonProps = {
	initalName: string;
	templateId: string;
};

const formId = "edit-template-name";

//TODO CHANGE THE WAY FOR PREVENTING REFETCHING
const TemplateNameButton = ({
	initalName,
	templateId,
}: TemplateNameButtonProps) => {
	const [templateName, setTemplateName] = useState(initalName);
	const [open, setOpen] = useState(false);
	const formContext = useFormContext(formId);

	const fetcher = useFetcher<typeof updateTemplateNameAction>();

	useEffect(() => {
		if (fetcher.data?.ok) {
			const newTemplateName = formContext.getValues().get("templateName");

			if (newTemplateName) {
				setTemplateName(newTemplateName as string);
				setOpen(false);
				toast.success("Template name updated");
			}
		}
	}, [fetcher.data]);

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(val) => {
				setOpen(val);
			}}
		>
			<Dialog.Trigger onClick={() => setOpen(true)}>
				<button
					className={css({
						border: "none",
						outline: "none",
						textAlign: "center",
						fontSize: "var(--font-size-3)",
						fontWeight: "var(--font-weight-medium)",
						color: "var(--color-text)",
						backgroundColor: "transparent",
						cursor: "text",
					})}
				>
					{templateName}
				</button>
			</Dialog.Trigger>
			<Badge
				className={css({
					userSelect: "text!important",
				})}
			>
				{templateId}
			</Badge>
			<Dialog.Content style={{ maxWidth: 460 }}>
				<Dialog.Title>Edit template name</Dialog.Title>
				<ValidatedForm
					id={formId}
					validator={editTemplateNameValidator}
					defaultValues={{
						templateName: templateName,
					}}
					fetcher={fetcher}
					onSubmit={(values, e) => {
						e.preventDefault();

						fetcher.submit(values, {
							method: "POST",
							action: "/api/update-template-name",
						});
					}}
					replace={false}
				>
					<input type="hidden" name="templateId" value={templateId} />
					<div
						className={css({
							spaceY: "3",
						})}
					>
						<Callout.Root>
							<Callout.Icon>
								<Icon name="info" size="lg" />
							</Callout.Icon>
							<Callout.Text>
								The template name is used to identify your template in the
								dashboard.
							</Callout.Text>
						</Callout.Root>{" "}
						<FormInput name="templateName" placeholder="template name" />
					</div>

					<div
						className={css({
							display: "flex",
							justifyContent: "flex-end",
							gap: "8px",
							marginTop: "4",
						})}
					>
						<Dialog.Close>
							<Button variant="soft" color="gray">
								Cancel
							</Button>
						</Dialog.Close>
						<FormSubmitButton>Save template</FormSubmitButton>
					</div>
				</ValidatedForm>
			</Dialog.Content>
		</Dialog.Root>
	);
};

const UseTemplateButton = ({ templateId }: { templateId: string }) => {
	const tree = useEditorStore((state) => state.tree);
	const variables = useMemo(() => getAllVariablesList(tree), [tree]);
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setOpen(true)}>Use template</Button>
			<UseTemplateDialog
				templateId={templateId}
				variables={variables}
				open={open}
				onOpenChange={(val) => setOpen(val)}
			/>
		</>
	);
};

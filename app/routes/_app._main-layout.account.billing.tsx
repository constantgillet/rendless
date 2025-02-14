import { AlertDialog, Badge, Button, Flex } from "@radix-ui/themes";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
	useActionData,
	useFetcher,
	useLoaderData,
	useRevalidator,
} from "@remix-run/react";
import { css } from "styled-system/css";
import { grid, gridItem } from "styled-system/patterns";
import { prisma } from "~/libs/prisma";
import type { action } from "./api.checkout-url";
import { useEffect, useState } from "react";
import type { action as cancelSubscriptionAction } from "./api.cancel-subscription";
import { Spinner } from "~/components/Spinner";
import toast from "react-hot-toast";
import { environment } from "~/libs/environment.server";

export const meta: MetaFunction = () => {
	return [{ title: "Billing - Rendless" }];
};

export const handle = {
	pageTitle: "Billing",
};

export const loader = async ({ context: { user } }: LoaderFunctionArgs) => {
	const plans = await prisma.plan.findMany();

	const monthly = plans.find((plan) => plan.interval === "month");
	const yearly = plans.find((plan) => plan.interval === "year");

	if (!monthly || !yearly) {
		const fetchPlansURL = `${environment().WEBSITE_URL}/api/sync-plans`;
		fetch(fetchPlansURL, {
			method: "POST",
		});
		throw new Error("Missing plans");
	}

	const subscription = await prisma.subscription.findFirst({
		where: {
			userId: user?.id,
			status: {
				in: ["active", "on_trial"],
			},
		},
		include: {
			plan: true,
		},
	});

	return {
		monthly: {
			...monthly,
			price: Number(monthly.price),
		},
		yearly: {
			...yearly,
			price: Number(yearly.price) / 12,
		},
		subscription: subscription,
	};
};

export default function BillingPage() {
	const { monthly, yearly, subscription } = useLoaderData<typeof loader>();

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
					{subscription ? (
						<div
							className={gridItem({
								colSpan: 12,
								backgroundColor: "var(--gray-3)",
								p: "32px",
								rounded: "12px",
								border: "1px solid var(--gray-4)",
								spaceY: "3",
							})}
						>
							<div
								className={css({
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								})}
							>
								<h2
									className={css({
										fontSize: "22px",
										fontWeight: "bold",
										marginBottom: "4",
									})}
								>
									Currrent plan:
								</h2>
								<CancelSubscriptionButton subscriptionId={subscription.id} />
							</div>
							<div
								className={css({
									spaceY: "2  ",
								})}
							>
								<div
									className={css({
										display: "flex",
										alignItems: "center",
										gap: "4",
									})}
								>
									<Badge size="3">{subscription.plan.name}</Badge>
									{subscription.status === "on_trial" && (
										<Badge size="2" variant="solid" color="blue">
											Trial until{" "}
											{new Date(subscription.trialEndsAt).toLocaleDateString()}
										</Badge>
									)}
								</div>
								<div>
									<span
										className={css({
											fontWeight: "medium",
										})}
									>
										Price:
									</span>{" "}
									<span>€{Number(subscription.plan.price) / 100}</span>
								</div>
								<div>
									<span
										className={css({
											fontWeight: "medium",
										})}
									>
										Interval:
									</span>{" "}
									<span>{subscription.plan.interval}</span>
								</div>
								<div>
									<span
										className={css({
											fontWeight: "medium",
										})}
									>
										Next payment:
									</span>{" "}
									<span>
										{new Date(subscription?.renewsAt).toLocaleDateString()}
									</span>
								</div>
							</div>{" "}
						</div>
					) : (
						<>
							<PlanCard
								type="monthly"
								variantId={monthly.variantId}
								price={monthly.price}
							/>
							<PlanCard
								type="yearly"
								variantId={yearly.variantId}
								price={yearly.price}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

type PlanCardProps = {
	type: "monthly" | "yearly";
	variantId: number;
	price: number;
};

const PlanCard = ({ variantId, price, type }: PlanCardProps) => {
	const fetcherPost = useFetcher<typeof action>();

	const handleClick = async () => {
		fetcherPost.submit(
			{
				variantId: variantId,
			},
			{
				method: "POST",
				action: "/api/checkout-url",
			},
		);
	};

	useEffect(() => {
		if (fetcherPost.data?.url) {
			window.location.href = fetcherPost.data.url;
		}
	}, [fetcherPost.data]);

	return (
		<div
			className={gridItem({
				colSpan: 6,
				backgroundColor: "var(--gray-3)",
				p: "32px",
				rounded: "12px",
				border: "1px solid var(--gray-4)",
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
						{type === "monthly" ? "Monthly" : "Yearly"}
					</h3>
					{type === "yearly" && (
						<Badge size="3" variant="solid" color="yellow" radius="full">
							50% off
						</Badge>
					)}
				</div>
				<div>
					<div
						className={css({
							fontSize: "42px",
							fontWeight: "bold",
						})}
					>
						€{price / 100}
					</div>
					<div>
						<span
							className={css({
								color: "var(--gray-11)",
							})}
						>
							per month, paid monthly
						</span>
					</div>
				</div>
			</div>
			<div>
				<Button
					size={"4"}
					highContrast
					onClick={handleClick}
					loading={
						fetcherPost.state === "submitting" ||
						fetcherPost.state === "loading"
					}
				>
					Upgrade
				</Button>
			</div>
			<div>Create unlimited dynamic opengraph images</div>
		</div>
	);
};

type CancelSubscriptionButtonProps = {
	subscriptionId: number;
};

const CancelSubscriptionButton = ({
	subscriptionId,
}: CancelSubscriptionButtonProps) => {
	const [open, setOpen] = useState(false);

	const fetcher = useFetcher<typeof cancelSubscriptionAction>();
	const revalidator = useRevalidator();

	const onClick = () => {
		fetcher.submit(
			{
				subscriptionId: subscriptionId,
			},
			{
				action: "/api/cancel-subscription",
				method: "POST",
			},
		);
	};

	useEffect(() => {
		if (fetcher.data?.data) {
			setOpen(false);
			toast.success("You have successfully canceled your subscription");

			setTimeout(() => {
				revalidator.revalidate();
			}, 1500);
		}
	}, [fetcher.data]);

	return (
		<AlertDialog.Root open={open} onOpenChange={setOpen}>
			<AlertDialog.Trigger>
				<Button variant="surface">Cancel subscription</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content maxWidth="450px">
				<AlertDialog.Title>Cancel subscription</AlertDialog.Title>
				<AlertDialog.Description size="2">
					Are you sure you want to cancel your subscription? You will loose
					access to all premium features.
				</AlertDialog.Description>

				<Flex gap="3" mt="4" justify="end">
					<AlertDialog.Cancel>
						<Button variant="soft" color="gray">
							Cancel
						</Button>
					</AlertDialog.Cancel>
					<AlertDialog.Action>
						<Button
							variant="solid"
							color="red"
							onClick={onClick}
							disabled={
								fetcher.state === "loading" || fetcher.state === "submitting"
							}
						>
							{fetcher.state === "loading" ||
								(fetcher.state === "submitting" && <Spinner />)}
							Cancel subscription
						</Button>
					</AlertDialog.Action>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
};

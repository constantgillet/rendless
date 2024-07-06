import { AlertDialog, Badge, Button, Flex } from "@radix-ui/themes";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { css } from "styled-system/css";
import { grid, gridItem } from "styled-system/patterns";
import { prisma } from "~/libs/prisma";
import type { action } from "./api.checkout-url";
import { useEffect } from "react";

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

	const subscription = await prisma.subscription.findFirst({
		where: {
			userId: user?.id,
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
								<AlertDialog.Root>
									<AlertDialog.Trigger>
										<Button variant="surface">Cancel subscription</Button>
									</AlertDialog.Trigger>
									<AlertDialog.Content maxWidth="450px">
										<AlertDialog.Title>Cancel subscription</AlertDialog.Title>
										<AlertDialog.Description size="2">
											Are you sure you want to cancel your subscription? You
											will loose access to all premium features.
										</AlertDialog.Description>

										<Flex gap="3" mt="4" justify="end">
											<AlertDialog.Cancel>
												<Button variant="soft" color="gray">
													Cancel
												</Button>
											</AlertDialog.Cancel>
											<AlertDialog.Action>
												<Button variant="solid" color="red">
													Cancel subscription
												</Button>
											</AlertDialog.Action>
										</Flex>
									</AlertDialog.Content>
								</AlertDialog.Root>
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
							per month, paid yearly
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

import { Badge, Button } from "@radix-ui/themes";
import type { MetaFunction } from "@remix-run/node";
import { css } from "styled-system/css";
import { grid, gridItem } from "styled-system/patterns";

export const meta: MetaFunction = () => {
	return [{ title: "Billing - Rendless" }];
};

export const handle = {
	pageTitle: "Billing",
};

export default function BillingPage() {
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
					<div
						className={gridItem({
							colSpan: 6,
							backgroundColor: "var(--accent-9)",
							p: "32px",
							rounded: "12px",
							border: "1px solid var(--accent-10)",
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
									Pro Plan
								</h3>
								<Badge size="3" variant="solid" color="yellow" radius="full">
									50% off
								</Badge>
							</div>
							<div>
								<div
									className={css({
										fontSize: "42px",
										fontWeight: "bold",
									})}
								>
									$9.99
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
							<Button size={"4"} highContrast>
								Upgrade
							</Button>
						</div>
						<div>Create unlimited dynamic opengraph images</div>
					</div>
				</div>
			</div>
		</div>
	);
}

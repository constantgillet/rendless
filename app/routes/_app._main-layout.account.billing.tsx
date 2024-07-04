import type { MetaFunction } from "@remix-run/node";
import { css } from "styled-system/css";

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
			<div></div>
		</div>
	);
}

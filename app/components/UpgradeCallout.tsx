import { Callout } from "@radix-ui/themes";
import { css } from "styled-system/css";
import { Icon } from "./Icon";
import { Link } from "@remix-run/react";

export const UpgradeCallout = () => {
	return (
		<div>
			<Callout.Root>
				<Callout.Icon>
					<Icon name="info" />
				</Callout.Icon>
				<Callout.Text>
					Please{" "}
					<Link
						to="/account/billing"
						className={css({
							color: "var(--accent-12)",
							textDecoration: "underline",
							cursor: "pointer",
						})}
					>
						upgrade to premium
					</Link>{" "}
					plan to create more than 1 template
				</Callout.Text>
			</Callout.Root>
		</div>
	);
};

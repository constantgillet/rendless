import { Button } from "@radix-ui/themes";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { grid, gridItem } from "styled-system/patterns";
import { css, cx } from "styled-system/css";

const settingsLinks = [
	{
		label: "General",
		href: ".",
	},
	{
		label: "Security",
		href: "./security",
		disabled: true,
	},
	{
		label: "Billing",
		href: "./billing",
	},
];

const isCurrentPage = (pathname: string, href: string) => {
	//Get last part of pathname
	const currentPathWithoutParent = pathname.split("/account").pop();
	const hrefName = href.replace(".", "");
	return currentPathWithoutParent === hrefName;
};

export default function SettingsLayout() {
	const { pathname } = useLocation();

	return (
		<div className={grid({ columns: 12, gap: 8 })}>
			<div
				className={cx(
					gridItem({ colSpan: 3 }),
					css({
						display: "flex",
						flexDirection: "column",
						spaceY: "4",
						mt: "2",
					}),
				)}
			>
				{settingsLinks.map((link) => {
					const isCurrent = isCurrentPage(pathname, link.href);

					return (
						<Link key={link.href} to={link.href} title={link.label}>
							<Button
								variant="ghost"
								size="3"
								color="gray"
								disabled={link.disabled}
								className={css({
									w: "full!important",
									textAlign: "left",
								})}
								style={{
									background: isCurrent ? "var(--gray-a3)" : undefined,
									textAlign: "left",
								}}
							>
								<div
									className={css({
										w: "full!important",
										textAlign: "left",
									})}
								>
									{link.label}
								</div>
							</Button>
						</Link>
					);
				})}
			</div>
			<div className={gridItem({ colSpan: 9 })}>
				<Outlet />
			</div>
		</div>
	);
}

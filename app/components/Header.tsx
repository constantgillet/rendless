import { Avatar, Button, DropdownMenu, IconButton } from "@radix-ui/themes";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { css, cx } from "styled-system/css";
import { container } from "styled-system/patterns";
import { Footer } from "~/components/Footer";
import { Icon, type IconName } from "~/components/Icon";
import { useMatchPageTitle } from "~/hooks/useMatchPageTitle";
import { useSignout } from "~/hooks/useSignout";
import { useUser } from "~/hooks/useUser";
import * as m from "~/paraglide/messages";

const links: {
	label: string;
	href: string;
	iconName: IconName;
	disabled?: boolean;
}[] = [
	// {
	//   label: "Home",
	//   href: "/app",
	//   iconName: "home",
	// },
	{
		label: "Templates",
		href: "/templates",
		iconName: "templates",
	},
	{
		label: "Logs",
		href: "/logs",
		iconName: "data-bar-horizontal",
		disabled: true,
	},
	{
		label: m.settings(),
		href: "/account",
		iconName: "settings",
	},
];

const linkClassName = css({
	fontSize: "sm",
	color: "var(--gray-11)",
	_hover: {
		textDecoration: "underline",
	},
	alignItems: "center",
	display: "flex",
});

export const Header = () => {
	const signout = useSignout();
	const user = useUser();
	const { pathname } = useLocation();

	if (!user) {
		return (
			<header
				className={css({
					position: "sticky",
					top: 0,
					left: 0,
					background: "rgb(20 20 20 / 38%)",
					zIndex: 100,
					borderBottom: "1px solid var(--gray-4)",
					backdropFilter: "blur(14px)",
				})}
			>
				<div
					className={container({
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: 3,
					})}
				>
					<Link to={"/"}>
						<img
							src="/images/rendless-logo.png"
							alt="Logo"
							width={160}
							height={"auto"}
						/>
					</Link>
					<div
						style={{
							justifyContent: "space-between",
							gap: 24,
						}}
						className={css({
							display: {
								base: "none",
								md: "flex",
							},
							gap: 2,
						})}
					>
						<Link to={"/#features"}>
							<Button variant="ghost" size="3" color="gray">
								Features
							</Button>
						</Link>
						<Link to={"/#pricing"}>
							<Button variant="ghost" size="3" color="gray">
								Pro Pricing
							</Button>
						</Link>
						<a
							href={"https://docs.rendless.com"}
							target="_blank"
							rel="noreferrer"
						>
							<Button variant="ghost" size="3" color="gray">
								Documentation
							</Button>
						</a>
					</div>
					<div
						className={css({
							display: "flex",
							gap: 2,
						})}
					>
						<Link
							to={"/login"}
							className={css({
								display: {
									base: "none",
									md: "flex",
								},
							})}
						>
							<Button size={"3"} variant="outline">
								Login
							</Button>
						</Link>
						<Link to={"/register"}>
							<Button size={"3"}>Get started</Button>
						</Link>
					</div>
				</div>
			</header>
		);
	}

	return (
		<header
			className={css({
				borderBottom: "1px solid var(--gray-a5)",
				backgroundColor: "var(--color-panel-solid)",
				paddingY: "18px",
				position: "sticky",
				top: 0,
				zIndex: 10,
			})}
		>
			<div
				className={cx(
					container({
						display: "flex",
						justifyContent: "space-between",
					}),
				)}
			>
				<div
					className={css({
						display: "flex",
					})}
				>
					<div
						className={css({
							mr: "24px",
						})}
					>
						<Link to={"/app"}>
							<img
								src="/images/rendless-logo.png"
								alt="Logo"
								width={120}
								height={"auto"}
							/>
						</Link>
					</div>
					<div
						className={css({
							spaceX: "24px",
							display: "flex",
							gap: "4px",
						})}
					>
						{links.map((link) => (
							<Link key={link.href} to={link.href} title={link.label}>
								<Button
									variant="ghost"
									size="3"
									color="gray"
									style={{
										background: link.href.includes(pathname)
											? "var(--gray-a3)"
											: undefined,
									}}
									disabled={link.disabled}
								>
									<Icon name={link.iconName} size="md" />
									{link.label}
								</Button>
							</Link>
						))}
					</div>
				</div>
				<div className={css({ display: "flex", gap: 4 })}>
					<div className={css({ display: "flex", gap: "2" })}>
						<Link to={"https://docs.rendless.com"} className={linkClassName}>
							Docs
							<Icon
								name="open"
								size="sm"
								className={css({
									transform: "translateY(-6px)",
									ml: "1",
								})}
							/>
						</Link>
					</div>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button variant="ghost" size="2" color="gray">
								{user?.username}
								<Avatar
									fallback={user?.username[0] || ""}
									size="1"
									radius="full"
								/>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<Link to={"/account"}>
								<DropdownMenu.Item>General settings</DropdownMenu.Item>
							</Link>
							<Link to={"/account/billing"}>
								<DropdownMenu.Item>Billing</DropdownMenu.Item>
							</Link>
							<Link to={"/onboarding"}>
								<DropdownMenu.Item>Onboarding</DropdownMenu.Item>
							</Link>
							<DropdownMenu.Separator />
							<DropdownMenu.Item
								onClick={() => {
									signout();
								}}
							>
								Logout
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		</header>
	);
};

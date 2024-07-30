import { Avatar, Button, DropdownMenu, IconButton } from "@radix-ui/themes";
import { Link, Outlet, useLocation } from "@remix-run/react";
import { css, cx } from "styled-system/css";
import { container } from "styled-system/patterns";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { Icon, type IconName } from "~/components/Icon";
import { useMatchPageTitle } from "~/hooks/useMatchPageTitle";
import { useSignout } from "~/hooks/useSignout";
import { useUser } from "~/hooks/useUser";
import * as m from "~/paraglide/messages";

export default function MainLayout() {
	const pageTitle = useMatchPageTitle();

	return (
		<div>
			<div
				className={css({
					minHeight: "calc(100vh - 84px)",
				})}
			>
				<Header />
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
						<div className={cx(container())}>
							<h1
								className={css({
									fontSize: "2xl",
									fontWeight: "semibold",
									textTransform: "capitalize",
								})}
							>
								{pageTitle}
							</h1>
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
					<div className={container()}>
						<Outlet />
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

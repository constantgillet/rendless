import { Link } from "@remix-run/react";
import { css, cx } from "styled-system/css";
import { container } from "styled-system/patterns";

export const Footer = () => {
	return (
		<footer
			className={css({
				mt: "24px",
			})}
		>
			<div
				className={cx(
					container(),
					css({
						borderTop: "1px solid var(--gray-a5)",
						display: "flex",
						py: "12px",
						justifyContent: "space-between",
					}),
				)}
			>
				<Link
					to={"/app"}
					className={css({
						display: "flex",
						gap: "2px",
						alignItems: "center",
						color: "var(--gray-10)",
					})}
				>
					<img
						src="/images/rendless-logo.png"
						alt="Logo"
						width={82}
						height={"auto"}
						className={css({
							opacity: 0.5,
						})}
					/>
					© 2024
				</Link>
				<div
					className={css({
						display: "flex",
						gap: "8px",
						alignItems: "center",
					})}
				>
					<Link to={"/terms"} className={linkClassName}>
						Terms
					</Link>
					<Link to={"/privacy"} className={linkClassName}>
						Privacy
					</Link>
					<a href="mailto:contact@rendless.com" className={linkClassName}>
						Contact
					</a>
					<Link to={"https://docs.rendless.com"} className={linkClassName}>
						Docs
					</Link>
				</div>
			</div>
		</footer>
	);
};

const linkClassName = css({
	fontSize: "sm",
	color: "var(--gray-11)",
	_hover: {
		textDecoration: "underline",
	},
	alignItems: "center",
	display: "flex",
});

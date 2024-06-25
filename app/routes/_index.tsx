import { Button } from "@radix-ui/themes";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { css } from "styled-system/css";
import { container } from "styled-system/patterns";
import * as m from "~/paraglide/messages";

export default function Index() {
	return (
		<div>
			<header>
				<div
					className={container({
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: 3,
					})}
				>
					<Link to={"/app"}>
						<img
							src="/images/rendless-logo.png"
							alt="Logo"
							width={160}
							height={"auto"}
						/>
					</Link>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							gap: 24,
						}}
					>
						<Link to={"/#features"}>
							<Button variant="ghost" size="3" color="gray">
								Features
							</Button>
						</Link>
						<Link to={"/#pricing"}>
							<Button variant="ghost" size="3" color="gray">
								Pricing
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
					<div>
						<Link to={"/signin"}>
							<Button size={"3"}>Get started</Button>
						</Link>
					</div>
				</div>
			</header>
			<div>
				<div className={container({})}>
					<div
						className={css({
							spaceY: "4",
							width: "100%",
							maxWidth: "800px",
							margin: "auto",
						})}
					>
						<h1
							className={css({
								fontSize: "46px",
								fontWeight: "bold",
								textAlign: "center",
							})}
						>
							The fastest way to {""}
							<span className={css({ color: "var(--accent-11)" })}>
								generate dynamic
							</span>{" "}
							opengraph images{" "}
						</h1>
						<p
							className={css({
								fontSize: "24px",
								textAlign: "center",
								color: "var(--gray-11)",
							})}
						>
							Generate dynamic opengraph images for your website, blog, or app
							with our simple editor and API.
						</p>
						<div>
							<Link to={"/signin"}>
								<Button size={"4"} variant="classic" radius="full">
									Get started
								</Button>
							</Link>
						</div>{" "}
					</div>
				</div>
			</div>
			<h1>Index 1</h1>
			<p>{m.hello_world()}</p>
			<p></p>
		</div>
	);
}

export function loader({ context: { user } }: LoaderFunctionArgs) {
	return {};
	throw redirect("/app");

	if (user) {
		throw redirect("/app");
	}

	return { ok: true };
}

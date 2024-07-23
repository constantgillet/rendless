import { Badge, Button, SegmentedControl } from "@radix-ui/themes";
import {
	type LoaderFunctionArgs,
	type MetaFunction,
	redirect,
} from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { css } from "styled-system/css";
import { container, grid, gridItem } from "styled-system/patterns";
import CookieBanner from "~/components/CookieBanner";
import { Footer } from "~/components/Footer";
import * as m from "~/paraglide/messages";

export const meta: MetaFunction = () => {
	return [
		{ title: "Generate dynamic opengraph images easily and fastly - Rendless" },
		{
			property: "og:title",
			content: "Generate dynamic opengraph images easily and fastly - Rendless",
		},
		{
			name: "description",
			content:
				"Generate dynamic opengraph images easily and fastly with Rendless. Make your website stand out on social media.",
		},
		//OG Image
		{
			property: "og:image",
			content: "https://rendless.com/images/og-image.png",
		},
	];
};

export default function Index() {
	return (
		<div>
			<Header />
			<div
				style={{
					backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0)'/><path d='M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z'  stroke-width='0.5' stroke='hsla(259, 1%, 57%, 0.1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`,
				}}
			>
				<HeroSection />
			</div>
			<FeaturesSection />
			<PricingSection />
			<BottomCTA />
			<Footer />
			<CookieBanner />
		</div>
	);
}

export function loader({ context: { user } }: LoaderFunctionArgs) {
	if (user) {
		throw redirect("/app");
	}

	return { ok: true };
}

const Header = () => {
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
				<Link to={"/register"}>
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
};

const HeroSection = () => {
	return (
		<section>
			<div className={container({})}>
				<div
					className={css({
						spaceY: "8",
						width: "100%",
						maxWidth: "800px",
						margin: "auto",
						py: "62px",
					})}
				>
					<h1
						className={css({
							fontSize: {
								base: "36px",
								md: "48px",
							},
							fontWeight: "bold",
							textAlign: "center",
						})}
					>
						The fastest way to {""}
						<span className={"text-gradient"}>generate dynamic</span> opengraph{" "}
						<span className={"text-gradient"}>images</span>{" "}
					</h1>
					<p
						className={css({
							fontSize: {
								base: "20px",
								md: "24px",
							},
							textAlign: "center",
							color: "var(--gray-11)",
						})}
					>
						Generate dynamic opengraph images for your website, blog, or app
						with our simple editor and API.
					</p>
					<div>
						<Link
							to={"/register"}
							className={css({
								w: "fit",
								mx: "auto",
								display: "block",
							})}
						>
							<Button size={"4"} variant="classic" radius="full">
								Get started
							</Button>
						</Link>
					</div>{" "}
				</div>
				<div>
					<img
						src="/images/hero-image.png"
						alt="Hero"
						width="100%"
						height="auto"
					/>
				</div>
			</div>
		</section>
	);
};

const FeaturesSection = () => {
	return (
		<section
			id="features"
			className={css({
				py: "48px",
				bg: "var(--gray-2)",
			})}
		>
			<div className={container()}>
				<div
					className={css({
						display: "flex",
						flexDirection: "column",
						spaceY: "8",
						mb: "48px",
					})}
				>
					<h2
						className={css({
							fontSize: "38px",
							fontWeight: "bold",
							textAlign: "center",
						})}
					>
						Features
					</h2>
					<p
						className={css({
							fontSize: "20px",
							textAlign: "center",
							color: "var(--gray-11)",
						})}
					>
						Everything you need to create dynamic opengraph images for your
						website.
					</p>
				</div>
				<div
					className={grid({
						columns: 12,
						gap: {
							base: 4,
							md: 12,
						},
					})}
				>
					<div
						className={gridItem({
							backgroundColor: "var(--gray-3)",
							borderRadius: "12px",
							display: "flex",
							border: "1px solid var(--gray-4)",
							overflow: "hidden",
							colSpan: 12,
							flexDirection: {
								base: "column",
								lg: "row",
							},
						})}
					>
						<div
							className={css({
								display: "flex",
								flexDirection: "column",
								w: {
									base: "100%",
									lg: "65%",
								},
								p: "32px",
								justifyContent: "center",
								alignItems: "center",
							})}
						>
							<h3
								className={css({
									fontSize: "34px",
									fontWeight: "bold",
									textAlign: "center",
									mb: "16px",
								})}
							>
								A <span className={"text-gradient"}>simple editor</span> to
								create dynamic images
							</h3>
							<p
								className={css({
									fontSize: "20px",
									textAlign: "center",
									color: "var(--gray-11)",
									px: {
										base: "0px",
										md: "32px",
									},
									pb: {
										base: "0px",
										md: "32px",
									},
								})}
							>
								Rendless provides a simple editor to create dynamic opengraph
								images for your website, blog, or app. You can customize the
								background, text, images, and more.
							</p>
						</div>
						<div
							className={css({
								pt: {
									base: "0px",
									md: "32px",
									lg: "86px",
								},
							})}
						>
							<img
								src="/images/illustration-1.png"
								alt="Illustration 1"
								width="100%"
								height="auto"
								className={css({
									borderTopLeftRadius: "12px",
									borderTop: "1px solid var(--gray-3)",
									borderLeft: "1px solid var(--gray-3)",
								})}
							/>
						</div>
					</div>
					<div
						className={gridItem({
							colSpan: {
								base: 12,
								lg: 6,
							},
							backgroundColor: "var(--gray-3)",
							border: "1px solid var(--gray-4)",
							borderRadius: "12px",
							p: "32px",
						})}
					>
						<h3
							className={css({
								fontSize: "34px",
								fontWeight: "bold",
								textAlign: "center",
								mb: "16px",
							})}
						>
							Ultra fast <span className={"text-gradient"}>API</span>
						</h3>
						<div
							className={css({
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								pb: "12px",
							})}
						>
							<Badge variant="outline" size="3" highContrast>
								180ms{" "}
							</Badge>
						</div>
						<div
							className={css({
								textAlign: "center",
							})}
						>
							<span className={"text-gradient"}>
								average initial image render time
							</span>
						</div>
						<p
							className={css({
								fontSize: "20px",
								textAlign: "center",
								color: "var(--gray-11)",
								px: {
									base: "0px",
									md: "32px",
								},

								pt: {
									base: "7px",
									md: "18px",
								},
							})}
						>
							Rendless provides an ultra fast API to generate dynamic opengraph
						</p>
					</div>
					<div
						className={gridItem({
							colSpan: {
								base: 12,
								lg: 6,
							},
							backgroundColor: "var(--gray-3)",
							border: "1px solid var(--gray-4)",
							borderRadius: "12px",
							p: "32px",
						})}
					>
						<h3
							className={css({
								fontSize: "34px",
								fontWeight: "bold",
								textAlign: "center",
								mb: "16px",
							})}
						>
							Integrated with{" "}
							<span className={"text-gradient"}>your tools</span>
						</h3>
						<p
							className={css({
								fontSize: "20px",
								textAlign: "center",
								color: "var(--gray-11)",
								px: {
									base: "0px",
									md: "32px",
								},
								pb: {
									base: "16px",
									md: "32px",
								},
							})}
						>
							Rendless integrates with your favorite tools, frameworks, and
							languages.
						</p>
						<div
							className={grid({
								columns: 6,
								gap: {
									base: 2,
									md: 4,
								},
							})}
						>
							<ToolItem image="/images/logos/wordpress.png" />
							<ToolItem image="/images/logos/webflow.svg" />
							<ToolItem image="/images/logos/php.webp" />
							<ToolItem image="/images/logos/symfony.webp" />
							<ToolItem image="/images/logos/shopify.webp" />
							<div
								className={css({
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									bg: "var(--gray-4)",
									p: "8px",
									rounded: "12px",
									textAlign: "center",
									fontSize: "14px",
								})}
							>
								And more...
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

type ToolItemProps = {
	image: string;
};

const ToolItem = ({ image }: ToolItemProps) => {
	return (
		<div
			className={css({
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				bg: "var(--gray-4)",
				p: "8px",
				rounded: "12px",
			})}
		>
			<img src={image} alt="" />
		</div>
	);
};

const PricingSection = () => {
	const [selectedPlan, setSelectedPlan] = useState<"yearly" | "monthly">(
		"yearly",
	);

	return (
		<section
			id="pricing"
			className={css({
				bg: "var(--gray-1)",
				py: "48px",
			})}
		>
			<div
				className={container({
					spaceY: "8",
				})}
			>
				<div
					className={css({
						spaceY: "6",
					})}
				>
					<h2
						className={css({
							fontSize: "38px",
							fontWeight: "bold",
							textAlign: "center",
						})}
					>
						Pricing <span className={"text-gradient"}>Plans</span>
					</h2>
					<div
						className={css({
							fontSize: "20px",
							textAlign: "center",
							color: "var(--gray-11)",
						})}
					>
						Upgrade to a pro plan and create unlimited dynamic opengraph images
					</div>
				</div>
				<div
					className={css({
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					})}
				>
					<SegmentedControl.Root
						defaultValue="yearly"
						radius="full"
						onValueChange={(value) => {
							setSelectedPlan(value as unknown as "yearly" | "monthly");
						}}
					>
						<SegmentedControl.Item value="monthly">
							Monthly
						</SegmentedControl.Item>
						<SegmentedControl.Item value="yearly">Yearly</SegmentedControl.Item>
					</SegmentedControl.Root>
				</div>
				<div
					className={grid({
						columns: 12,
						gap: {
							base: 4,
							md: 12,
						},
						w: "full",
						maxW: "900px",
						mx: "auto",
					})}
				>
					<div
						className={gridItem({
							colSpan: {
								base: 12,
								sm: 6,
							},
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
									Free Plan
								</h3>
							</div>
							<div>
								<div
									className={css({
										fontSize: "42px",
										fontWeight: "bold",
									})}
								>
									Free
								</div>
								<div>
									<span
										className={css({
											color: "var(--gray-11)",
										})}
									>
										Unlimited
									</span>
								</div>
							</div>
						</div>
						<div>
							<Button size={"4"} highContrast variant="outline">
								Get started
							</Button>
						</div>
						<div>Create up to 1 template</div>
					</div>
					<div
						className={gridItem({
							colSpan: {
								base: 12,
								sm: 6,
							},
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
								{selectedPlan === "yearly" && (
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
									{selectedPlan === "yearly" ? "$4.99" : "$9.99"}
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
								Get started
							</Button>
						</div>
						<div>Create unlimited dynamic opengraph images</div>
					</div>
				</div>
			</div>
		</section>
	);
};

const BottomCTA = () => {
	return (
		<section
			className={css({
				bg: "var(--gray-2)",
				py: "48px",
			})}
		>
			<div className={container()}>
				<div
					className={css({
						p: "24px",
						bg: "var(--accent-9)",
						rounded: "18px",
						spaceY: "6",
					})}
				>
					<h2
						className={css({
							fontSize: "38px",
							fontWeight: "bold",
							textAlign: "center",
						})}
					>
						Ready to get started?
					</h2>
					<p
						className={css({
							fontSize: "20px",
							textAlign: "center",
							color: "var(--gray-12)",
							w: "full",
							mx: "auto",
							maxWidth: "500px",
						})}
					>
						Create dynamic opengraph images for your website, blog, or app with
						Rendless.
					</p>
					<div>
						<Link
							to={"/register"}
							className={css({
								w: "fit",
								mx: "auto",
								display: "block",
							})}
						>
							<Button size={"4"} highContrast>
								Get started
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

import {
	Body,
	Button,
	Container,
	Column,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Text,
	Tailwind,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
	username?: string;
	link?: string;
}

const baseUrl = process.env.WEBSITE_URL
	? process.env.WEBSITE_URL
	: "http://localhost:3000";

export const WelcomedEmail = ({ username, link }: WelcomeEmailProps) => {
	const previewText = "Welcome to Rendless";

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans px-2">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
						<Section className="mt-[32px]">
							<Img
								src={`${baseUrl}/images/favicon-xl.png`}
								width="54"
								height="54"
								alt="Rendless"
								className="my-0 mx-auto"
							/>
						</Section>
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
							Welcome to Rendless
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">
							Hello {username},
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							You have successfully created your account on{" "}
							<strong>Rendless</strong> account. Click the button below to{" "}
							<strong>continue and start generating images</strong>.
						</Text>
						<Section className="text-center mt-[32px] mb-[32px]">
							<Button
								className="bg-[#3e63dd] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
								href={link}
							>
								Continue to Rendless
							</Button>
						</Section>
						<Text className="text-black text-[14px] leading-[24px]">
							or you can discover more about Rendless by visiting our
							documentation at{" "}
							<Link href="https://docs.rendless.com">
								https://docs.rendless
							</Link>
							.
						</Text>

						<Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
						<Text className="text-[#666666] text-[12px] leading-[24px]">
							This email was intended for {username}. If you were not expecting
							this email, you can ignore this email. If you are concerned about
							your account's safety, please reply to this email to get in touch
							with us.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

WelcomedEmail.PreviewProps = {
	username: "alanturing",
	link: "https://rendless.com",
} as WelcomeEmailProps;

export default WelcomedEmail;

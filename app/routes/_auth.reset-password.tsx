import {
	type ActionFunctionArgs,
	type MetaFunction,
	redirect,
} from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { css } from "styled-system/css";
import { z } from "zod";
import { FormInput, FormSubmitButton } from "~/components/Form";
import { prisma } from "~/libs/prisma";
import { Argon2id } from "~/libs/olso";

export const validator = withZod(
	z.object({
		token: z.string().min(1, { message: "Token is required" }),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters" }),
	}),
);

export default function LoginPage() {
	return (
		<div
			className={css({
				spaceY: "24px",
			})}
		>
			<div
				className={css({
					spaceY: "8px",
				})}
			>
				<h1
					className={css({
						fontSize: "3xl",
						fontWeight: "bold",
						marginBottom: "var(--space-1)",
						color: "var(--gray-12)",
					})}
				>
					Reset Password
				</h1>
			</div>
			<ValidatedForm
				validator={validator}
				method="post"
				className={css({ spaceY: "18px" })}
			>
				<div
					className={css({
						spaceY: "12px",
					})}
				>
					<input type="hidden" name="token" />
					<FormInput
						name="password"
						placeholder=" New password"
						size="3"
						variant="classic"
					/>
				</div>
				<div>
					<FormSubmitButton
						size="3"
						className={css({
							w: "full!important",
						})}
						variant="classic"
					>
						Reset Password
					</FormSubmitButton>
				</div>
			</ValidatedForm>
			{/* <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          })}
        >
          <Button color="gray" variant="classic" size={"3"}>
            Signin with Github
          </Button>
        </div> */}
		</div>
	);
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const result = await validator.validate(await request.formData());

	if (result.error) {
		// validationError comes from `remix-validated-form`
		return validationError(result.error);
	}

	const { token, password } = result.data;

	//Check if token is valid
	const resetToken = await prisma.resetPassword.findUnique({
		where: {
			token: token,
		},
	});

	if (!resetToken) {
		return {
			status: 403,
			message: "Invalid token",
		};
	}

	//Check if token is expired
	if (resetToken.expiresAt < new Date()) {
		return {
			status: 403,
			message: "Token expired",
		};
	}

	const hashedPassword = await new Argon2id().hash(password);

	await prisma.user.update({
		where: {
			id: resetToken.userId,
		},
		data: {
			hashedPassword: hashedPassword,
		},
	});

	await prisma.resetPassword.delete({
		where: {
			token: token,
		},
	});

	redirect("/login");
};

export const meta: MetaFunction = () => {
	return [{ title: "Reset password - Rendless" }];
};

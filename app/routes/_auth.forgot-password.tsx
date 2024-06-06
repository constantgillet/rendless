import {
  type ActionFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import {
  ValidatedForm,
  useFormContext,
  validationError,
} from "remix-validated-form";
import { css } from "styled-system/css";
import { z } from "zod";
import { FormInput, FormSubmitButton } from "~/components/Form";
import { prisma } from "~/libs/prisma";
import { Link, useActionData } from "@remix-run/react";
import { generateRandomString, alphabet } from "oslo/crypto";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { environment } from "~/libs/environment.server";
import { Resend } from "resend";
import ResetPasswordEmail from "~emails/reset-password";

export const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
  })
);

export default function ForgotPasswordPage() {
  const data = useActionData<typeof action>();
  const formContext = useFormContext("forgot-password");

  useEffect(() => {
    if (data?.success) {
      toast.success("Email sent, please check your inbox and spam folder");
      formContext.reset();
    }
  }, [data, formContext.reset]);

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
          Forgot Password
        </h1>
        <p
          className={css({
            color: "var(--gray-11)",
            fontSize: "md",
          })}
        >
          Remember your password?{" "}
          <Link
            to="/register"
            className={css({
              color: "var(--accent-a11)",
              _hover: {
                textDecoration: "underline",
              },
            })}
          >
            Login
          </Link>
          .
        </p>
      </div>
      <ValidatedForm
        id="forgot-password"
        validator={validator}
        method="post"
        className={css({ spaceY: "18px" })}
      >
        <div
          className={css({
            spaceY: "12px",
          })}
        >
          <FormInput
            name="email"
            placeholder="Email"
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
            Send Email
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
      <div
        className={css({
          fontSize: "sm",
          textAlign: "center",
        })}
      >
        We will send you a link to reset your password, please check your email
        and spam folder.
      </div>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    // validationError comes from `remix-validated-form`
    throw validationError(result.error);
  }

  const { email } = result.data;

  const findUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!findUserByEmail) {
    return json({
      success: true,
    });
  }

  // Get tokens for the user
  const tokensSaved = await prisma.resetPassword.findMany({
    where: {
      userId: findUserByEmail.id,
    },
  });

  //Check if one has been sent in the last minute and return an error rate limit
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

  const hasATokenGeneratedOneMinuteAgo = tokensSaved.some(
    (token) => token.createdAt > oneMinuteAgo
  );

  if (hasATokenGeneratedOneMinuteAgo) {
    return json({
      success: false,
      fieldErrors: {
        email: "Too many requests, please try again in a minute",
      },
    });
  }

  // Generate a token
  const tokenGenerated = generateRandomString(20, alphabet("a-z", "0-9"));

  // Delete all the tokens for the user
  await prisma.resetPassword.deleteMany({
    where: {
      userId: findUserByEmail.id,
    },
  });

  // Save the token to the user
  await prisma.resetPassword.create({
    data: {
      token: tokenGenerated,
      userId: findUserByEmail.id,
      //Expire in 1 hour
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const resend = new Resend(environment().RESEND_API_KEY);

  const reszetLink = `${
    environment().WEBSITE_URL
  }/reset-password?token=${tokenGenerated}`;

  await resend.emails.send({
    from: environment().EMAIL_FROM,
    to: email,
    subject: "Reset your password - Rendless",
    react: (
      <ResetPasswordEmail
        username={findUserByEmail.username}
        resetLink={reszetLink}
      />
    ),
  });

  return json({
    success: true,
  });
};

export const meta: MetaFunction = () => {
  return [{ title: "Forgot password - Rendless" }];
};

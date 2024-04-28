import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { css } from "styled-system/css";
import { z } from "zod";
import { FormInput, FormSubmitButton } from "~/components/Form";
import { lucia } from "~/libs/lucia";
import { prisma } from "~/libs/prisma";
import { Argon2id } from "~/libs/olso";
import * as m from "~/paraglide/messages";
import { Link } from "@remix-run/react";

export const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
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
          {m.login()}
        </h1>
        <p
          className={css({
            color: "var(--gray-11)",
            fontSize: "md",
          })}
        >
          {m.missing_account_text()}{" "}
          <Link
            to="/register"
            className={css({
              color: "var(--accent-a11)",
              _hover: {
                textDecoration: "underline",
              },
            })}
          >
            {m.register()}
          </Link>
          .
        </p>
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
          <FormInput
            name="email"
            placeholder="Email"
            size="3"
            variant="classic"
          />
          <FormInput
            name="password"
            placeholder={m.password()}
            type="password"
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
            {m.login()}
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
        By registering, you agree to our{" "}
        <Link
          to="/terms"
          className={css({
            color: "var(--accent-a11)",
            _hover: {
              textDecoration: "underline",
            },
          })}
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          className={css({
            color: "var(--accent-a11)",
            _hover: {
              textDecoration: "underline",
            },
          })}
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    // validationError comes from `remix-validated-form`
    return validationError(result.error);
  }

  const { email, password } = result.data;

  const findUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!findUserByEmail) {
    return validationError(
      {
        fieldErrors: {
          email: "Wrong email or password",
        },
      },
      result.data
    );
  }
  const validPassword = await new Argon2id().verify(
    findUserByEmail.hashedPassword,
    password
  );

  if (!validPassword) {
    return validationError(
      {
        fieldErrors: {
          email: "Wrong email or password",
        },
      },
      result.data
    );
  }

  const session = await lucia.createSession(findUserByEmail.id, {});

  const sessionCookie = lucia.createSessionCookie(session.id);

  return redirect("/app", {
    headers: { "Set-Cookie": sessionCookie.serialize() },
  });
};

export const meta: MetaFunction = () => {
  return [{ title: "Login - Rendless" }];
};

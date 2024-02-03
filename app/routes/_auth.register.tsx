import { Link } from "@radix-ui/themes";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { css } from "styled-system/css";
import { z } from "zod";
import { FormInput, FormSubmitButton } from "~/components/Form";

export const validator = withZod(
  z.object({
    username: z.string().min(1, { message: "First name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
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
          Register
        </h1>
        <p
          className={css({
            color: "var(--gray-11)",
            fontSize: "md",
          })}
        >
          Already have an account? <Link>Log in</Link>.
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
            name="username"
            placeholder="First Name"
            size="3"
            variant="classic"
          />
          <FormInput
            name="password"
            placeholder="Password"
            type="password"
            size="3"
            variant="classic"
          />
        </div>
        <div>
          <FormSubmitButton
            size="3"
            className={css({
              w: "full",
            })}
            variant="classic"
          >
            Register
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
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>
      </div>
    </div>
  );
}

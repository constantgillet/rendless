import { Button, Link, TextArea, TextFieldInput } from "@radix-ui/themes";
import { css } from "styled-system/css";

export default function LoginPage() {
  return (
    <div>
      <div>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          })}
        >
          <h1
            className={css({
              fontSize: "4xl",
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
              fontSize: "lg",
            })}
          >
            Register and create your first image template in few seconds
          </p>
        </div>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          })}
        >
          <TextFieldInput placeholder="Email" size={"3"} />
          <TextFieldInput placeholder="Username" size={"3"} />
          <TextFieldInput placeholder="Password" size={"3"} />
        </div>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          })}
        >
          <Button className={css({ w: "full" })} size={"3"} variant="classic">
            Register
          </Button>
          <Button color="gray" variant="classic" size={"3"}>
            Signin with Github
          </Button>
        </div>
      </div>
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

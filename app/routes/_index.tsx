import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import * as m from "~/paraglide/messages";

export default function Index() {
  return (
    <div>
      <h1>Index 1</h1>
      <p>{m.hello_world()}</p>
      <p></p>
    </div>
  );
}

export function loader({ context: { user } }: LoaderFunctionArgs) {
  if (user) {
    throw redirect("/app");
  }

  return { ok: true };
}

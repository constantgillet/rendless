import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export default function Index() {
  return (
    <div>
      <h1>Index 2</h1>
      <p>Welcome to your new Remix app!</p>
    </div>
  );
}

export function loader({ context: { user } }: LoaderFunctionArgs) {
  if (user) {
    throw redirect("/app");
  }

  return { ok: true };
}

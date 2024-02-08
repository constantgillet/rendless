import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { lucia } from "~/libs/lucia";

export async function action({ context }: ActionFunctionArgs) {
  if (!context.session || !context.session.id) {
    return json({ data: "unauthorized" }, { status: 401 });
  }

  const { session } = context;

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();

  return redirect("/login", {
    headers: { "Set-Cookie": sessionCookie.serialize() },
  });
}

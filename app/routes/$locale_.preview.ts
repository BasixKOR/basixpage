import { LoaderFunction, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/utils/sessions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const previewEnabled = session.get("preview");

  if (previewEnabled) session.unset("preview");
  else session.set("preview", true);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

import { LoaderFunction, redirect } from "remix";
import { commitSession, getSession } from "~/utils/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const previewEnabled = session.get("preview");

  if (previewEnabled) session.unset("preview");
  else session.set("preview", true);

  redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

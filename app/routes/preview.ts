import { createCookie, LoaderFunction, redirect } from "remix";
import { client } from "~/utils/prismic";

export const cookie = createCookie("basixpage_preview", {
  path: "/",
  httpOnly: true,
  sameSite: "strict",
  maxAge: 604_800
});

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const previewToken = params.get("sessionId") ?? '';
  const documentID = params.get("documentId") ?? '';

  const redirectURL = await client.resolvePreviewURL({ defaultURL: "/", previewToken, documentID });
  return redirect(redirectURL, {
    headers: {
      "Set-Cookie": await cookie.serialize(true),
    },
  });
};

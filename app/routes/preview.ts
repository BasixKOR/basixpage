import { createCookie, LoaderFunction, redirect } from "remix";
import qs from "qs";

export const cookie = createCookie("basixpage_preview", {
  path: "/",
  httpOnly: true,
  sameSite: "strict",
  maxAge: 604_800,
});

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).search;
  const { token, documentId } = qs.parse(params, { ignoreQueryPrefix: true });

  const redirectURL = await client.resolvePreviewURL({
    defaultURL: "/",
    previewToken: token?.toString() ?? "",
    documentID: documentId?.toString() ?? "",
  });

  return redirect(redirectURL, {
    headers: {
      "Set-Cookie": await cookie.serialize(token),
    },
  });
};

import { LoaderFunction, redirect } from "remix";
import { client } from "~/utils/prismic";

export const loader: LoaderFunction = async () => {
  const redirectURL = await client.resolvePreviewURL({ defaultURL: "/" });
  return redirect(redirectURL);
};

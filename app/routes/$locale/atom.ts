import { LoaderFunction } from "@remix-run/cloudflare";
import { getFeed } from "~/utils/feed";

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const { locale } = params;

  const feed = await getFeed(url, locale ?? "en-gb");

  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml",
    },
  });
};

import { LoaderFunction } from "@remix-run/cloudflare";
import { getFeed } from "~/utils/feed";

export const loader: LoaderFunction = async ({ params, request, context: { env } }) => {
  const url = new URL(request.url);
  const { locale } = params;

  const feed = await getFeed(url, locale ?? "en-gb", env);

  return new Response(feed.json1(), {
    headers: {
      "Content-Type": "application/feed+json",
    },
  });
};

import { LoaderFunction } from "@remix-run/node";
import { getFeed } from "~/utils/feed";

export const loader: LoaderFunction = async ({ params, request }) => {
	const url = new URL(request.url);
	const { locale } = params;

	const feed = await getFeed(url, locale ?? "en-gb");

	return new Response(feed.json1(), {
		headers: {
			"Content-Type": "application/feed+json",
		},
	});
};

import { Feed } from "feed";
import { client, Metadata, Post } from "./prismic";
import * as prismicH from '@prismicio/helpers'

export async function getFeed(url: URL, language: string): Promise<Feed> {
	const metadata = await client.getSingle<Metadata>("metadata", { lang: language });
	const feed = new Feed({
		title: metadata.data.title ?? "Basixpage",
		description: metadata.data.description ?? undefined,
		id: url.origin,
		link: url.origin,
		language, // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
		image: "http://example.com/image.png",
		favicon: "http://example.com/favicon.ico",
		copyright: "All rights reserved 2022, Basix",
		updated: new Date(2013, 6, 14), // optional, default = today
		feedLinks: {
			rss: `${url.origin}/${language}/rss`,
			json: `${url.origin}/${language}/json`,
			atom: `${url.origin}/${language}/atom`
		},
		author: {
			name: "Basix",
			link: url.origin
		}
	});

	const posts = await client.getAllByType<Post>("post", { lang: language });

  for (const post of posts) {
    feed.addItem({
			title: prismicH.asText(post.data.title) ?? '',
			id: post.url!,
			link: post.url!,
			description: post.data.description ?? '',
			content: prismicH.asText(post.data.content)?.slice(200) ?? '',
			date: new Date(post.first_publication_date)
		})
  }

	return feed;
}
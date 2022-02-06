import { Feed } from "feed";
import { FeedQuery } from "~/graphql/generated";
import { gql, load } from "./dato";
import { render } from "datocms-structured-text-to-plain-text";

export async function getFeed(url: URL, language: string): Promise<Feed> {
  const data = await load<FeedQuery>({
    query: gql`
      query Feed($locale: SiteLocale) {
        _site(locale: $locale) {
          globalSeo {
            siteName
          }
        }
        allArticles(locale: $locale) {
          title
          description
          content {
            value
          }
          slug
          createdAt
        }
      }
    `,
    variables: {
      locale: language,
    },
  });

  const feed = new Feed({
    title: data._site.globalSeo?.siteName ?? "Basixpage",
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
      atom: `${url.origin}/${language}/atom`,
    },
    author: {
      name: "Basix",
      link: url.origin,
    },
  });

  for (const post of data.allArticles) {
    feed.addItem({
      title: post.title ?? "",
      id: post.slug ?? "",
      link: `${url.origin}/${language}/posts/${post.slug}`,
      description: post.description ?? "",
      content: render(post.content?.value)?.slice(200),
      date: new Date(post.createdAt),
    });
  }

  return feed;
}

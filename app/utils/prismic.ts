import * as prismic from "@prismicio/client";
import * as prismicT from "@prismicio/types";
import qs from "qs";

// Fill in your repository name
export const repositoryName = "basixpage";
const endpoint = prismic.getEndpoint(repositoryName);

export const client = prismic.createClient(endpoint, {
  // If your repo is private, add an access token
  accessToken: "",

  // This defines how you will structure URL paths in your project.
  // Update the types to match the Custom Types in your project, and edit
  // the paths to match the routing in your project.
  //
  // If you are not using a router in your project, you can change this
  // to an empty array or remove the option entirely.
  routes: [
    {
      type: "post",
      path: "/:lang/posts/:uid",
    },
    {
      type: "home",
      path: "/:lang",
    },
    {
      type: "metadata",
      path: "/:lang/rss",
    },
  ],
});

/**
 * This parses the query string and cookies and returns a half-baked request object.
 *
 * @param request A fetch-compatible request object
 * @returns Express-like request object for Prismic client to consume
 */
export function makePrismicRequest(
  request: Request
): Parameters<typeof client.enableAutoPreviewsFromReq>[0] {
  const url = new URL(request.url);
  return {
    headers: {
      cookie: request.headers.get("Cookie") ?? undefined,
    },
    query: qs.parse(url.search),
  };
}

export type Post = prismicT.PrismicDocument<{
  title: prismicT.TitleField;
  description: prismicT.KeyTextField;
  content: prismicT.RichTextField;
}>;

export type Metadata = prismicT.PrismicDocument<{
  title: prismicT.KeyTextField;
  description: prismicT.KeyTextField;
}>;

export type GNB = prismicT.PrismicDocument<{
  title: prismicT.TitleField;
  menu_item: prismicT.GroupField<{
    item_title: prismicT.KeyTextField;
    url: prismicT.LinkField;
  }>;
}>;

export type Home = prismicT.PrismicDocument<{
  title: prismicT.TitleField;
  content: prismicT.RichTextField;
}>;

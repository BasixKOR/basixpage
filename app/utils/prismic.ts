import * as prismic from "@prismicio/client";
import * as prismicT from "@prismicio/types";

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
  ],
});

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

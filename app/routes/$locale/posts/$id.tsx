import { PrismicRichText } from "@prismicio/react";
import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { client, Post } from "~/utils/prismic";
import * as prismicH from "@prismicio/helpers";

export const loader = async ({ params }: Parameters<LoaderFunction>[0]) => {
  return await client.getByUID<Post>("post", params.id!, {
    lang: params.locale,
  });
};

export const meta: MetaFunction = ({ parentsData }) => {
  const post: Post = parentsData.root;

  return {
		title: prismicH.asText(post.data.title)!,
    "og:title": prismicH.asText(post.data.title)!,
    "og:type": "article",
    "og:url": post.url!,
  };
};

export default function Post() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <div className="container">
      <article>
        <PrismicRichText field={data.data.title} />
        <span>{data.data.description}</span>
        <hr />
        <PrismicRichText field={data.data.content} />
      </article>
    </div>
  );
}

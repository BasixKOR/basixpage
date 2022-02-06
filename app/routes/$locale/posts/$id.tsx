import { PrismicRichText } from "@prismicio/react";
import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { client, makePrismicRequest, Post } from "~/utils/prismic";
import * as prismicH from "@prismicio/helpers";
import { Giscus } from "@giscus/react";

export const loader = async ({ params, request }: Parameters<LoaderFunction>[0]) => {
  client.enableAutoPreviewsFromReq(makePrismicRequest(request));
  return await client.getByUID<Post>("post", params.id!, {
    lang: params.locale,
  });
};

export const meta: MetaFunction = ({ data: post }) => {
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
        <header>
          <hgroup>
            <PrismicRichText field={data.data.title} />
            <h3>{data.data.description}</h3>
          </hgroup>
        </header>
        <PrismicRichText field={data.data.content} />
      </article>
      <Giscus
        repo="BasixKOR/basixpage"
        repoId="R_kgDOGybrlw"
        category="Comments"
        category-id="DIC_kwDOGybrl84CBAPV"
        mapping="pathname"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="top"
        theme="preferred_color_scheme"
        lang={data.lang.slice(0, 2)}
      />
    </div>
  );
}

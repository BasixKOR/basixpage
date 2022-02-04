import { PrismicRichText } from "@prismicio/react";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { client, Post } from "~/utils/prismic";

export const loader = async ({ params }: Parameters<LoaderFunction>[0]) => {
  return await client.getAllByType<Post>("post", {
    lang: params.locale
  });
};

export default function Index() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <div className="container">
      {data.map((post) => (
        <article key={post.uid}>
          <Link to={post.url!}>
            <PrismicRichText field={post.data.title} />
          </Link>
          {post.data.description}
        </article>
      ))}
    </div>
  );
}

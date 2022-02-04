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
    <ul>
      {data.map((post) => (
        <li key={post.uid}>
          <Link to={post.url!}>
            {post.data.title[0]?.text}
          </Link>
        </li>
      ))}
    </ul>
  );
}

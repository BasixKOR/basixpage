import { Link, LoaderFunction, useLoaderData } from "remix";
import { client } from "~/prismic";

export const loader = async () => {
  return client.getAllByType("post", {
    orderings: {
      field: "my.post.created_at",
      direction: "desc"
    },
    pageSize: 10
  })
}

export default function Index() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return <ul>
    {data.map(post => <li key={post.uid}>
      <Link to={`/posts/${post.uid}`}>{post.data.}
      </li>)}
  </ul>;
}

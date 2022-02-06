import { formatRelative, parseISO } from "date-fns";
import { Calendar } from "react-feather";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { getDateFnsLocale } from "~/utils/i18n";

export const loader = async ({ params }: Parameters<LoaderFunction>[0]) => {
  return await client.getAllByType<Post>("post", {
    lang: params.locale,
  });
};

export default function Posts() {
  const data = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <div className="container">
      {data.map((post) => (
        <article key={post.uid}>
          <Link to={post.url!}>
            <PrismicRichText field={post.data.title} />
          </Link>
          <span>
            <Calendar />{" "}
            {post.first_publication_date && formatRelative(parseISO(post.first_publication_date), new Date(), {
              locale: getDateFnsLocale(post.lang),
            })}
          </span>
          <p>{post.data.description}</p>
        </article>
      ))}
    </div>
  );
}

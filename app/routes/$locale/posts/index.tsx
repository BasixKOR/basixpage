import { formatRelative, parseISO } from "date-fns";
import { useQuerySubscription } from "react-datocms";
import { Calendar } from "react-feather";
import { Link, LoaderFunction, useLoaderData, useOutletContext } from "remix";
import { GetPostsQuery } from "~/graphql/generated";
import { OutletData } from "~/root";
import { datoQuerySubscription, gql, QueryListenerOptions } from "~/utils/dato";
import { getDateFnsLocale } from "~/utils/i18n";

export const loader = async ({
  params,
  request,
}: Parameters<LoaderFunction>[0]) => {
  const a = await datoQuerySubscription({
    request,
    query: gql`
      query getPosts($locale: SiteLocale) {
        allArticles(locale: $locale) {
          createdAt
          id
          slug
          title
          description
        }
      }
    `,
    variables: {
      locale: params.locale,
    },
  });
  debugger;
  console.log("from loader:", a);
  return a;
};

export default function Posts() {
  debugger
  const query = useLoaderData<QueryListenerOptions<GetPostsQuery>>();
  const { data } = useQuerySubscription(query);
  const { locale } = useOutletContext<OutletData>();

  return (
    <div className="container">
      {data!.allArticles.map((post) => (
        <article key={post.slug}>
          <Link to={`/${locale}/${post.slug}`}>
            <h1>{post.title}</h1>
          </Link>
          <span>
            <Calendar />{" "}
            {post.createdAt &&
              formatRelative(parseISO(post.createdAt), new Date(), {
                locale: getDateFnsLocale(locale),
              })}
          </span>
          <p>{post.description}</p>
        </article>
      ))}
    </div>
  );
}

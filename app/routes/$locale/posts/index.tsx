import { useQuerySubscription } from "react-datocms";
import { LoaderFunction, useLoaderData, useOutletContext } from "remix";
import invariant from "tiny-invariant";
import ArticlesList, { itemFragment as articleFragment } from "~/components/ArticlesList";
import { GetPostsQuery } from "~/graphql/generated";
import { OutletData } from "~/root";
import { datoQuerySubscription, gql, QueryListenerOptions } from "~/utils/dato";

export const loader = async ({
  params,
  request,
}: Parameters<LoaderFunction>[0]) => {
  return datoQuerySubscription({
    request,
    query: gql`
      query getPosts($locale: SiteLocale) {
        allArticles(locale: $locale) {
          ...articleItem
        }
      }
      ${articleFragment}
    `,
    variables: {
      locale: params.locale,
    },
  });
};

export default function Posts() {
  const query = useLoaderData<QueryListenerOptions<GetPostsQuery>>();
  const { data } = useQuerySubscription(query);
  const { locale } = useOutletContext<OutletData>();

  invariant(data, "data is undefined");

  return (
    <div className="container">
      <ArticlesList data={data.allArticles} locale={locale} />
    </div>
  );
}

import { useQuerySubscription } from "react-datocms";
import { LoaderFunction, useLoaderData, useOutletContext } from "remix";
import invariant from "tiny-invariant";
import ArticlesList from "~/components/ArticlesList";
import { StructuredText } from "~/components/dato";
import { HomepageQuery } from "~/graphql/generated";
import { OutletData } from "~/root";
import { datoQuerySubscription, gql, QueryListenerOptions } from "~/utils/dato";
import { fragment as articlesListFragment } from "~/components/ArticlesList";
import { fragment as imageFragment } from "~/components/Image";

export const loader: LoaderFunction = ({ params, request }) => {
  return datoQuerySubscription({
    request,
    query: gql`
      query Homepage($locale: SiteLocale) {
        homePage(locale: $locale) {
          title
          note {
            value
            links {
              __typename
              ... on ArticleRecord {
                id
                slug
                title
              }
            }
            blocks {
              __typename
              ...Image
            }
          }
          content {
            __typename
            ...articlesListBlock
          }
        }
      }
      ${articlesListFragment}
      ${imageFragment}
    `,
    variables: {
      locale: params.locale,
    },
  });
};

export default function Index() {
  const query = useLoaderData<QueryListenerOptions<HomepageQuery>>();
  const { data } = useQuerySubscription(query);
  const { locale } = useOutletContext<OutletData>();

  invariant(data, "data is undefined");

  return (
    <div className="container">
      <article>
        {data.homePage?.title && data.homePage.note && (
          <header>
            <h1>{data.homePage.title}</h1>
            <StructuredText data={data.homePage.note} locale={locale} />
          </header>
        )}
      </article>
      {data.homePage?.content.map((item) => {
        switch (item.__typename) {
          case "ArticlesListRecord":
            return <ArticlesList data={item.articles} locale={locale} />;
          default:
            return <span>{item.__typename}</span>;
        }
      })}
    </div>
  );
}

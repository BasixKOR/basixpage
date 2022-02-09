import {
  LoaderFunction,
  MetaFunction,
  useLoaderData,
  useOutletContext,
} from "remix";
import { Giscus } from "@giscus/react";
import { datoQuerySubscription, gql, QueryListenerOptions } from "~/utils/dato";
import type { ArticlesListRecord, GetPostQuery } from "~/graphql/generated";
import { toRemixMeta, useQuerySubscription } from "react-datocms";
import { MetaTagsFragment } from "~/graphql/fragments";
import { OutletData } from "~/root";
import { StructuredText } from "~/components/dato";
import ArticlesList, {
  fragment as articlesListFragment,
} from "~/components/ArticlesList";
import { fragment as imageFragment } from "~/components/Image";
import { fragment as codeBlockFragment } from "~/components/CodeBlock";

export const loader = async ({
  params,
  request,
}: Parameters<LoaderFunction>[0]) => {
  return datoQuerySubscription<GetPostQuery>({
    request,
    query: gql`
      query getPost($locale: SiteLocale, $slug: String) {
        article(filter: { slug: { eq: $slug } }, locale: $locale) {
          title
          description
          content {
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
              ...articlesListBlock
              ...Image
              ...codeBlock
            }
          }
          comments
          seo: _seoMetaTags {
            ...metaTagsFragment
          }
        }
      }
      ${MetaTagsFragment}
      ${articlesListFragment}
      ${imageFragment}
      ${codeBlockFragment}
    `,
    variables: {
      locale: params.locale,
      slug: params.id,
    },
  });
};

export const meta: MetaFunction = ({
  data,
}: {
  data: QueryListenerOptions<GetPostQuery>;
}) => toRemixMeta(data.initialData?.article?.seo ?? null);

export default function Post() {
  const query = useLoaderData<QueryListenerOptions<GetPostQuery>>();
  const { data } = useQuerySubscription(query);
  const { locale } = useOutletContext<OutletData>();

  return (
    <div className="container">
      <article>
        <header>
          <hgroup>
            <h1>{data?.article?.title}</h1>
            <h3>{data?.article?.description}</h3>
          </hgroup>
        </header>
        <StructuredText
          data={data?.article?.content}
          locale={locale}
        />
      </article>
      {data?.article?.comments && (
        <Giscus
          repo="BasixKOR/basixpage"
          repoId="R_kgDOGybrlw"
          category="Comments"
          categoryId="DIC_kwDOGybrl84CBAPV"
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang={locale}
        />
      )}
    </div>
  );
}

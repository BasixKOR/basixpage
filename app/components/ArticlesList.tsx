import { Calendar } from "react-feather";
import { Link } from "remix";
import type { ArticleRecord, ArticlesListFragment } from "~/graphql/generated";
import { formatRelative, parseISO } from "date-fns";
import { getDateFnsLocale } from "~/utils/i18n";
import { gql } from "~/utils/dato";

export const fragment = gql`
  fragment articlesList on ArticleRecord {
    createdAt
    id
    slug
    title
    description
  }
`;

interface ArticlesListProps {
  data: ArticlesListFragment[];
  locale: string;
}

export default function ArticlesList({ data, locale }: ArticlesListProps) {
  return (
    <>
      {data.map((post) => (
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
    </>
  );
}

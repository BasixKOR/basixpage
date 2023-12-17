import { Calendar } from "react-feather";
import { Link } from "@remix-run/react";
import type { ArticleItemFragment } from "~/graphql/generated";
import { formatRelative, parseISO } from "date-fns";
import { getDateFnsLocale } from "~/utils/i18n";
import { gql } from "~/utils/dato";

export const itemFragment = gql`
  fragment articleItem on ArticleRecord {
    createdAt
    id
    slug
    title
    description
  }
`;

export const fragment = gql`
  fragment articlesListBlock on ArticlesListRecord {
    __typename
    id
    articles {
      ...articleItem
    }
  }
  ${itemFragment}
`;

interface ArticlesListProps {
	data: ArticleItemFragment[];
	locale: string;
}

export default function ArticlesList({ data, locale }: ArticlesListProps) {
	return (
		<>
			{data.map((post) => (
				<article key={post.id}>
					<Link to={`/${locale}/posts/${post.slug}`}>
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

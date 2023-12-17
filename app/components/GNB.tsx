import { Globe } from "react-feather";
import { Link } from "@remix-run/react";
import invariant from "tiny-invariant";
import { GnbFragmentFragment } from "~/graphql/generated";
import { gql } from "~/utils/dato";

interface GNBProps {
	data: GnbFragmentFragment | null;
	locale: string;
}

export const fragment = gql`
  fragment gnbFragment on GnbRecord {
    title
    items {
      ... on GnbItemRecord {
        title
        link {
          __typename
          ... on ArticleRecord {
            slug
          }
        }
      }
    }
  }
`;

function renderItem(
	{ link, title }: GnbFragmentFragment["items"][0],
	locale: string,
): React.ReactNode {
	switch (link?.__typename) {
		case "ArticleRecord":
			return <Link to={`/${locale}/${link.slug}`}>{title}</Link>;
		case "GnbRecord":
			return <Link to={`/${locale}`}>{title}</Link>;
		case "ResumeRecord":
			return <Link to={`/${locale}/resume`}>{title}</Link>;
		case "PostsPageRecord":
			return <Link to={`/${locale}/posts`}>{title}</Link>;
		case undefined:
			return <span>null</span>;
	}
}

export default function GNB({ data, locale }: GNBProps) {
	invariant(data, "GNB data not supplied.");

	return (
		<nav className="container">
			<ul>
				<li>
					<Link to={`/${locale}`}>
						<strong>{data.title}</strong>
					</Link>
				</li>
			</ul>
			<ul>
				{data.items.map((item) => (
					<li key={item.title}>{renderItem(item, locale)}</li>
				))}
				<li key="$lang">
					<Link to={locale === "ko" ? "/en" : "/ko"}>
						<Globe />
					</Link>
				</li>
			</ul>
		</nav>
	);
}

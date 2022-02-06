import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";

import css from "./theme.css";
import logo from "~/assets/basixlab.svg";

import GNB, { fragment as gnbFragment } from "./components/GNB";
import { datoQuerySubscription, gql, QueryListenerOptions } from "./utils/dato";
import { RootQuery } from "./graphql/generated";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import { MetaTagsFragment } from "./graphql/fragments";

export const meta: MetaFunction = () => {
  return { title: "Basixpage" };
};

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    crossOrigin: "anonymous",
    href: "https://unpkg.com/@picocss/pico@1.4.4/css/pico.min.css",
  },
  {
    rel: "stylesheet",
    href: css,
  },
  {
    rel: "icon",
    type: "image/svg+xml",
    href: logo,
  },
];

interface LoaderData {
  query: QueryListenerOptions<RootQuery>;
  locale: string;
}

export interface OutletData {
  locale: string;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  return {
    query: await datoQuerySubscription({
      request,
      query: gql`
        query Root($locale: SiteLocale) {
          _site {
            faviconMetaTags {
              ...metaTagsFragment
            }
          }
          gnb(locale: $locale) {
            ...gnbFragment
          }
        }
        ${MetaTagsFragment}
        ${gnbFragment}
      `,
      variables: {
        locale: params.locale,
      },
    }),
    locale: params.locale,
  };
};

export default function App() {
  const { query, locale } = useLoaderData<LoaderData>();
  const { data } = useQuerySubscription(query);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {renderMetaTags(data?._site.faviconMetaTags!)}
      </head>
      <body>
        <GNB data={data!.gnb} locale={locale} />
        <Outlet context={{ locale }} />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

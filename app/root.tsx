import type { MetaFunction } from "@remix-run/cloudflare";
import { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
} from "@remix-run/react";

import pico from "@picocss/pico/css/pico.min.css";
import pretendard from "pretendard/dist/web/static/pretendard-subset.css";
import css from "./theme.css";
import logo from "~/assets/basixlab.svg";

import GNB, { fragment as gnbFragment } from "./components/GNB";
import { datoQuerySubscription, gql, QueryListenerOptions } from "./utils/dato";
import { RootQuery } from "./graphql/generated";
import { renderMetaTags, useQuerySubscription } from "react-datocms";
import { MetaTagsFragment } from "./graphql/fragments";
import { getSession } from "./utils/sessions.server";
import { MetronomeLinks } from "@metronome-sh/react";

export const meta: MetaFunction = () => {
  return { title: "Basixpage" };
};

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: pico,
  },
  {
    rel: "stylesheet",
    href: pretendard,
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
  preview?: boolean;
  env: any;
}

export interface OutletData {
  locale: string;
}

export const loader: LoaderFunction = async ({
  params,
  request,
  context: { env },
}) => {
  return {
    query: await datoQuerySubscription({
      request,
      env,
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
    preview: (await getSession(request.headers.get("Cookie"))).get("preview"),
    env,
  };
};

export default function App() {
  const { query, preview, env } = useLoaderData<LoaderData>();
  const { data } = useQuerySubscription(query);
  const [
    {
      params: { locale },
    },
  ] = useMatches();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <MetronomeLinks />
        {renderMetaTags(data?._site.faviconMetaTags!)}
        <script
          defer
          data-domain="basix.tech"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </head>
      <body>
        <GNB data={data!.gnb} locale={locale!} />
        {preview && (
          <div className="container">You are looking at Preview!</div>
        )}
        <Outlet context={{ locale }} />
        <ScrollRestoration />
        <Scripts />
        {env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

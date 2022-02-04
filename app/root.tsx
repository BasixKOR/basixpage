import {
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

import { client, repositoryName, GNB as TGNB } from "./utils/prismic";
import { PrismicProvider, PrismicToolbar } from "@prismicio/react";
import GNB from "./components/GNB";

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
    href: logo
  }
];

export const loader = async ({ params }: Parameters<LoaderFunction>[0]) => {
  return await client.getSingle<TGNB>("gnb", { lang: params.locale });
};

export default function App() {
  const data = useLoaderData<TGNB>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <GNB data={data} />
        <PrismicProvider client={client}>
          <Outlet />
          <PrismicToolbar repositoryName={repositoryName} />
        </PrismicProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

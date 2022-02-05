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

import { client, repositoryName, GNB as TGNB } from "./utils/prismic";
import { PrismicProvider, PrismicToolbar } from "@prismicio/react";
import { cookie as previewCookie } from "./routes/preview";
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
    href: logo,
  },
];

interface LoaderData {
  gnb: TGNB;
  previewRef: string;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const gnb = await client.getSingle<TGNB>("gnb", { lang: params.locale });
  const previewRef = await previewCookie.parse(request.headers.get("Cookie"));

  return { gnb, previewRef };
};

export default function App() {
  const { gnb, previewRef } = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <GNB data={gnb} />
        <PrismicProvider
          client={client}
          internalLinkComponent={({ href, ...props }) => (
            <Link to={href} {...props} />
          )}
        >
          <Outlet />
          {previewRef && <PrismicToolbar repositoryName={repositoryName} />}
        </PrismicProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

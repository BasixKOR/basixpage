import { renderToString } from "react-dom/server";
import { createCookie, RemixServer } from "remix";
import type { EntryContext } from "remix";
import { gql, load } from "./utils/dato";
import { GetLocalesQuery } from "./graphql/generated";

import "dotenv/config"

let locales: string[];

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const url = new URL(request.url);
  const localeCookie = createCookie("basixpage_v2_locale", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
  });

  if (!locales) {
    const data: GetLocalesQuery = await load({
      query: gql`
        query getLocales {
          _site {
            locales
          }
        }
      `,
    });
    locales = data._site.locales;
  }

  if (!locales.some((l) => url.pathname.startsWith(`/${l}`))) {
    // checks if the URL doesn't contain a valid language
    const preferredLanguage = await localeCookie.parse(
      request.headers.get("Cookie")
    );
    const language = preferredLanguage || "en";
    return new Response(`/${language}${url.pathname}`, {
      status: 302,
      headers: {
        Location: `/${language}${url.pathname}`,
        "Set-Cookie": await localeCookie.serialize(language),
      },
    });
  }

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set(
    "Set-Cookie",
    await localeCookie.serialize(url.pathname.split("/")[1])
  );

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

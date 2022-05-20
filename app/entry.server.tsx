import { renderToReadableStream } from "react-dom/server";
import type { EntryContext } from "@remix-run/cloudflare";
import { createCookie } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { gql, load } from "./utils/dato";
import { GetLocalesQuery } from "./graphql/generated";

let locales: string[];
const NOT_LOCALIZED = ["_remix-crash"];

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

  if (
    !locales.concat(NOT_LOCALIZED).some((l) => url.pathname.startsWith(`/${l}`))
  ) {
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

  const stream = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  responseHeaders.set("Content-Type", "text/html");
  if (/\/\w{2}\//.test(url.pathname))
    responseHeaders.set(
      "Set-Cookie",
      await localeCookie.serialize(url.pathname.split("/")[1])
    );

  return new Response(stream, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

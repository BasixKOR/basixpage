import { renderToPipeableStream } from "react-dom/server";
import { createCookie, RemixServer } from "remix";
import type { EntryContext } from "remix";
import { load } from "./utils/dato";
import { GetLocalesQuery } from "./graphql/generated";
import { PassThrough } from "stream";
import { gql } from "@urql/core";

import "dotenv/config";
import invariant from "tiny-invariant";

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
    const { data } = await load<GetLocalesQuery>({
      query: gql`
        query getLocales {
          _site {
            locales
          }
        }
      `,
    });
    invariant(data, "data is undefined");
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

  const stream = new PassThrough({ encoding: "utf-8" });

  const { pipe, abort } = renderToPipeableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      onCompleteShell() {
        pipe(stream);
      },
      onError(error) {
        console.error(error);
        abort();
      },
    }
  );

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set(
    "Set-Cookie",
    await localeCookie.serialize(url.pathname.split("/")[1])
  );

  // @ts-ignore It is fine.
  return new Response(stream, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

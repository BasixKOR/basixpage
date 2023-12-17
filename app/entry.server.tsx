import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext } from "@remix-run/node";
import { createCookie, createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { gql, load } from "./utils/dato";
import { GetLocalesQuery } from "./graphql/generated";

let locales: string[];
const NOT_LOCALIZED = ["_remix-crash"];
const ABORT_DELAY = 5_000;

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

  if (/\/\w{2}\//.test(url.pathname))
    responseHeaders.set(
      "Set-Cookie",
      await localeCookie.serialize(url.pathname.split("/")[1])
    );

  return handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext);
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onShellReady() {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(
              createReadableStreamFromReadable(body),
              {
                headers: responseHeaders,
                status: responseStatusCode,
              }
            )
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          console.error(error);
          responseStatusCode = 500;
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

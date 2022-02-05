import { renderToString } from "react-dom/server";
import { createCookie, RemixServer } from "remix";
import type { EntryContext } from "remix";
import { client } from "./utils/prismic";
import { Repository } from "@prismicio/types";

let repository: Repository;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const url = new URL(request.url);
  const localeCookie = createCookie("basixpage_v1_locale", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
  });
  const isPreview = url.pathname.startsWith("/preview");

  if (!repository) repository = await client.getRepository(); // caches the repository
  if (
    !repository.languages.some((l) => url.pathname.startsWith(`/${l.id}`)) &&
    !isPreview
  ) {
    // checks if the URL doesn't contain a valid language
    const preferredLanguage = await localeCookie.parse(
      request.headers.get("Cookie")
    );
    const language = preferredLanguage || repository.languages[0].id;
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
  if (!isPreview)
    responseHeaders.set(
      "Set-Cookie",
      await localeCookie.serialize(url.pathname.split("/")[1])
    );

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

import dedent from "dedent";
import type { QueryListenerOptions as DatoQueryListenerOptions } from "react-datocms";
import { getSession } from "./sessions.server";

interface LoadOptions {
  query: string;
  variables?: { [key: string]: any };
  preview?: boolean;
}

export async function load<T>({
  query,
  variables,
  preview,
}: LoadOptions): Promise<T> {
  let endpoint = "https://graphql.datocms.com";

  if (process.env.DATOCMS_ENVIRONMENT)
    endpoint += `/environments/${process.env.DATOCMS_ENVIRONMENT}`;
  if (preview) endpoint += `/preview`;

  const headers = new Headers({
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_TOKEN}`,
  });

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    console.error("Ouch! The query has some errors!", JSON.stringify(json.errors, null, 2));
    throw json.errors ?? json;
  }

  return json.data;
}

function getEnvironment() {
  if (process.env.DATOCMS_ENVIRONMENT) return process.env.DATOCMS_ENVIRONMENT;
  else if (process.env.NODE_ENV === "development") return "development";
  else if (process.env.VERCEL_GIT_COMMIT_REF?.startsWith("env/")) return process.env.VERCEL_GIT_COMMIT_REF.slice(4);
}

interface QueryOptions extends LoadOptions {
  request: Request;
}

export async function datoQuerySubscription<T = any>({
  request,
  ...gqlRequest
}: QueryOptions): Promise<DatoQueryListenerOptions<T, Record<string, any>>> {
  const session = await getSession(request.headers.get("Cookie"));
  const previewEnabled = session.get("preview");

  return previewEnabled
    ? {
        ...gqlRequest,
        preview: true,
        initialData: await load<T>({ ...gqlRequest, preview: true }),
        token: process.env.DATOCMS_READONLY_TOKEN!,
        environment: getEnvironment(),
      }
    : {
        enabled: false,
        initialData: await load<T>(gqlRequest),
      };
}

export type QueryListenerOptions<T> = DatoQueryListenerOptions<T, Record<string, any>>;

// Trick for better editor support.
export const gql = dedent;

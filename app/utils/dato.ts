import dedent from "dedent";
import type { QueryListenerOptions as DatoQueryListenerOptions } from "react-datocms";
import invariant from "tiny-invariant";
import { getSession } from "./sessions.server";

interface GraphQLQuery {
  query: string;
  variables?: { [key: string]: any };
}

interface LoadOptions extends GraphQLQuery {
  preview?: boolean;
  environment?: string;
  token: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: any[];
}

export async function load<T>({
  query,
  variables,
  preview,
  environment,
  token,
}: LoadOptions): Promise<T> {
  let endpoint = "https://graphql.datocms.com";

  if (environment) endpoint += `/environments/${environment}`;
  if (preview) endpoint += `/preview`;

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json<GraphQLResponse<T>>();

  if (!res.ok || json.errors) {
    console.error(
      "Ouch! The query has some errors!",
      JSON.stringify(json.errors, null, 2)
    );
    throw json.errors ?? json;
  }

  return json.data!;
}

interface QueryOptions extends GraphQLQuery {
  request: Request;
  env: Record<
    "DATOCMS_READONLY_TOKEN" | "DATOCMS_ENVIRONMENT",
    string | undefined
  >;
}

export async function datoQuerySubscription<T = any>({
  request,
  env,
  ...gqlRequest
}: QueryOptions): Promise<DatoQueryListenerOptions<T, Record<string, any>>> {
  const session = await getSession(request.headers.get("Cookie"));
  const previewEnabled = session.get("preview");

  invariant(env.DATOCMS_READONLY_TOKEN, "Token missing!");

  return previewEnabled
    ? {
        ...gqlRequest,
        preview: true,
        environment: env.DATOCMS_ENVIRONMENT,
        token: env.DATOCMS_READONLY_TOKEN,
        initialData: await load<T>({
          ...gqlRequest,
          preview: true,
          environment: env.DATOCMS_ENVIRONMENT,
          token: env.DATOCMS_READONLY_TOKEN,
        }),
      }
    : {
        enabled: false,
        initialData: await load<T>({
          ...gqlRequest,
          environment: env.DATOCMS_ENVIRONMENT,
          token: env.DATOCMS_READONLY_TOKEN,
        }),
      };
}

export type QueryListenerOptions<T> = DatoQueryListenerOptions<
  T,
  Record<string, any>
>;

// Trick for better editor support.
export const gql = dedent;

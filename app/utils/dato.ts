import { OperationResult, TypedDocumentNode } from "@urql/core";
import { DocumentNode, print } from "graphql";
import type { QueryListenerOptions as DatoQueryListenerOptions } from "react-datocms";
import { defaultClient, ENDPOINT, getClient } from "./graphql";
import { getSession } from "./sessions.server";

interface LoadOptions<T, V extends object = Record<string, any>> {
  query: string | DocumentNode | TypedDocumentNode<T, V>;
  variables?: V;
  preview?: boolean;
}

export async function load<T, V extends object = Record<string, any>>({
  query,
  variables,
  preview,
}: LoadOptions<T, V>): Promise<OperationResult<T, {}>> {
  let endpoint = ENDPOINT;

  if (process.env.DATOCMS_ENVIRONMENT)
    endpoint += `/environments/${process.env.DATOCMS_ENVIRONMENT}`;
  if (preview) endpoint += `/preview`;

  const client = endpoint === ENDPOINT ? defaultClient : getClient(endpoint);

  return await client.query<T, V>(query, variables).toPromise();
}

function getEnvironment() {
  if (process.env.DATOCMS_ENVIRONMENT) return process.env.DATOCMS_ENVIRONMENT;
  else if (process.env.NODE_ENV === "development") return "development";
  else if (process.env.VERCEL_GIT_COMMIT_REF?.startsWith("env/"))
    return process.env.VERCEL_GIT_COMMIT_REF.slice(4);
}

interface QueryOptions<T, V extends object> extends LoadOptions<T, V> {
  request: Request;
}

export async function datoQuerySubscription<
  T = any,
  V extends object = Record<string, any>
>({
  request,
  query,
  ...gqlRequest
}: QueryOptions<T, V>): Promise<
  DatoQueryListenerOptions<T, V>
> {
  const session = await getSession(request.headers.get("Cookie"));
  const previewEnabled = session.get("preview");

  const { data, error } = await load<T>({
    ...gqlRequest,
    query,
    preview: Boolean(previewEnabled),
  });

  const stringQuery = typeof query !== 'string' ? print(query) : query;

  if (error) throw error;

  return previewEnabled
    ? {
        ...gqlRequest,
        query: stringQuery,
        preview: true,
        initialData: data,
        token: process.env.DATOCMS_READONLY_TOKEN!,
        environment: getEnvironment(),
      }
    : {
        enabled: false,
        initialData: data,
      };
}

export type QueryListenerOptions<T> = DatoQueryListenerOptions<
  T,
  Record<string, any>
>;

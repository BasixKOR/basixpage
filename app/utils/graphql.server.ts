import { createClient, ClientOptions } from "@urql/core";

const clientOptions: Omit<ClientOptions, "url"> = {
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${process.env.DATOCMS_READONLY_TOKEN}`,
    },
  },
};

export const ENDPOINT = "https://graphql.datocms.com";

export const defaultClient = createClient({
  url: ENDPOINT,
  ...clientOptions,
});

export function getClient(url: string) {
  return createClient({
    url,
    ...clientOptions,
  });
}

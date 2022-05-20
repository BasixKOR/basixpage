import { json, LoaderFunction } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async () => json({ timestamp: Date.now() });
import { json, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () =>
	json({ timestamp: Date.now() });

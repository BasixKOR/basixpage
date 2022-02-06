import { json, LoaderFunction } from "remix";

export const loader: LoaderFunction = async () => json({ timestamp: Date.now() });
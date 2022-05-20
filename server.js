import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import {
  combineGetLoadContexts,
  createMetronomeGetLoadContext,
  registerMetronome,
} from "@metronome-sh/cloudflare-pages";

const buildWithMetronome = registerMetronome(build);
const metronomeGetLoadContext =
  createMetronomeGetLoadContext(buildWithMetronome);

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: combineGetLoadContexts(
    ({ env }) => ({ env }),
    metronomeGetLoadContext
  ),
});

export function onRequest(context) {
  return handleRequest(context);
}

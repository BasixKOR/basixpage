import { createCookieSessionStorage } from "@remix-run/cloudflare";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "basixpage_session",
      maxAge: 604_800,
      path: '/',
    },
  });

export { getSession, commitSession, destroySession };
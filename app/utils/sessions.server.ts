import { createCookieSessionStorage } from "remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "basixpage_session",
      maxAge: 604_800,
      path: '/',
      secrets: [process.env.SESSION_SECRET!],
    }
  });

export { getSession, commitSession, destroySession };
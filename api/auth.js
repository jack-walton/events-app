import { isAuthConfigured } from "../lib/config.js";
import {
  consumeMagicLink,
  createMagicLink,
  ensureSchema,
  publicOrigin,
  readSession,
  redirectWithSession,
  sendMagicLinkEmail,
  signedOutResponse
} from "../lib/session.js";

export const config = {
  runtime: "nodejs"
};

function json(body, status = 200, headers) {
  return Response.json(body, { status, headers });
}

function pathOf(request) {
  return new URL(request.url).pathname.replace(/\/$/, "") || "/";
}

async function handle(request) {
  if (!isAuthConfigured()) {
    return json({ message: "Email sign-in is not configured yet." }, 503);
  }

  try {
    await ensureSchema();
    const path = pathOf(request);
    const url = new URL(request.url);

    if (request.method === "POST" && path.endsWith("/sign-in/magic-link")) {
      const body = await request.json().catch(() => ({}));
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return json({ message: "Enter an email address that includes @ and a domain." }, 400);
      }
      const link = await createMagicLink(email);
      await sendMagicLinkEmail(email, link);
      return json({ status: true });
    }

    if (request.method === "GET" && path.endsWith("/magic-link/verify")) {
      const token = url.searchParams.get("token") || "";
      const callbackURL = url.searchParams.get("callbackURL") || "/";
      const errorURL = `${publicOrigin()}/?authError=1`;
      const user = token ? await consumeMagicLink(token) : null;
      if (!user) {
        return new Response(null, { status: 302, headers: { Location: errorURL } });
      }
      const next = callbackURL.startsWith("/") ? `${publicOrigin()}${callbackURL}` : publicOrigin() + "/";
      return redirectWithSession(user, next);
    }

    if (request.method === "GET" && path.endsWith("/get-session")) {
      const session = readSession(request);
      return json(session ? { user: session, session: { userId: session.id } } : { user: null });
    }

    if (request.method === "POST" && path.endsWith("/sign-out")) {
      return signedOutResponse();
    }

    return json({ message: "Not found." }, 404);
  } catch (error) {
    console.error("VENU auth error", error);
    const detail = error instanceof Error ? error.message : "";
    const safe = Boolean(detail) && !/postgres|npg_|DATABASE|SECRET|Bearer/i.test(detail);
    return json(
      {
        message: safe
          ? detail
          : "We could not complete sign-in. Try again, or continue as guest."
      },
      503
    );
  }
}

export const GET = handle;
export const POST = handle;

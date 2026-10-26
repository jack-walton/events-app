import { createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { magicLinkEmail } from "./email.js";

const COOKIE = "venu_session";
const SESSION_DAYS = 30;
const LINK_MINUTES = 15;

let sql;
let schemaReady;

function getSql() {
  if (!sql) {
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

function secret() {
  return process.env.BETTER_AUTH_SECRET;
}

export function publicOrigin() {
  const configured = process.env.BETTER_AUTH_URL?.replace(/\/$/, "");
  if (configured) {
    return configured;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:8000";
}

function fromAddress() {
  const domain = process.env.RESEND_EMAIL_DOMAIN?.trim();
  const configuredFrom = process.env.RESEND_FROM?.trim();
  if (configuredFrom && !configuredFrom.includes("onboarding@resend.dev")) {
    return configuredFrom;
  }
  if (domain) {
    return `VENU <signin@${domain}>`;
  }
  return configuredFrom || "VENU <onboarding@resend.dev>";
}

function b64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(payload) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function nameFromEmail(email) {
  const local = email.split("@")[0] || "friend";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export async function ensureSchema() {
  if (schemaReady) {
    return schemaReady;
  }
  schemaReady = (async () => {
    const db = getSql();
    await db`CREATE TABLE IF NOT EXISTS venu_user (
      id text PRIMARY KEY,
      email text UNIQUE NOT NULL,
      name text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await db`CREATE TABLE IF NOT EXISTS venu_login_token (
      token_hash text PRIMARY KEY,
      email text NOT NULL,
      expires_at timestamptz NOT NULL,
      used_at timestamptz
    )`;
  })().catch((error) => {
    schemaReady = undefined;
    throw error;
  });
  return schemaReady;
}

export function readSession(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) {
    return null;
  }
  const raw = decodeURIComponent(match[1]);
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) {
    return null;
  }
  const expected = sign(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session?.id || !session?.email || session.exp < Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function sessionCookie(user) {
  const payload = b64url(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
    })
  );
  const value = `${payload}.${sign(payload)}`;
  const secure = publicOrigin().startsWith("https");
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 24 * 60 * 60}${secure ? "; Secure" : ""}`;
}

function clearCookie() {
  const secure = publicOrigin().startsWith("https");
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}

export async function createMagicLink(email) {
  const db = getSql();
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + LINK_MINUTES * 60 * 1000).toISOString();
  await db`INSERT INTO venu_login_token (token_hash, email, expires_at)
    VALUES (${tokenHash}, ${email}, ${expiresAt})`;
  return `${publicOrigin()}/api/auth/magic-link/verify?token=${token}&callbackURL=/`;
}

export async function sendMagicLinkEmail(email, url) {
  const message = magicLinkEmail(url);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: email,
      subject: message.subject,
      html: message.html,
      text: message.text
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const raw = payload.message || "Resend could not send the email.";
    if (/testing email|example\.com|not verified/i.test(raw)) {
      throw new Error(
        "Resend can only email your own address until a sending domain is verified. Use that inbox, or continue as guest."
      );
    }
    throw new Error(raw);
  }
}

export async function consumeMagicLink(token) {
  const db = getSql();
  const tokenHash = hashToken(token);
  const rows = await db`SELECT email, expires_at, used_at
    FROM venu_login_token
    WHERE token_hash = ${tokenHash}
    LIMIT 1`;
  const record = rows[0];
  if (!record || record.used_at || new Date(record.expires_at).getTime() < Date.now()) {
    return null;
  }
  await db`UPDATE venu_login_token SET used_at = now() WHERE token_hash = ${tokenHash}`;
  const email = String(record.email).trim().toLowerCase();
  const existing = await db`SELECT id, email, name FROM venu_user WHERE email = ${email} LIMIT 1`;
  if (existing[0]) {
    return existing[0];
  }
  const user = {
    id: randomBytes(16).toString("hex"),
    email,
    name: nameFromEmail(email)
  };
  await db`INSERT INTO venu_user (id, email, name)
    VALUES (${user.id}, ${user.email}, ${user.name})`;
  return user;
}

export function sessionResponse(user) {
  return Response.json(
    { user: { id: user.id, email: user.email, name: user.name }, session: { userId: user.id } },
    { headers: { "Set-Cookie": sessionCookie(user) } }
  );
}

export function signedOutResponse() {
  return Response.json({ ok: true }, { headers: { "Set-Cookie": clearCookie() } });
}

export function redirectWithSession(user, destination) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: destination,
      "Set-Cookie": sessionCookie(user)
    }
  });
}

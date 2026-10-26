import { AccountSession } from "./types";

type SessionResponse = {
  user?: {
    id?: string;
    email?: string;
    name?: string | null;
  } | null;
};

function apiMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const record = payload as { message?: unknown; error?: { message?: unknown } };
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
    if (typeof record.error?.message === "string" && record.error.message.trim()) {
      return record.error.message;
    }
  }
  return fallback;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchAccountSession(): Promise<AccountSession | null> {
  try {
    const response = await fetch("/api/auth/get-session", {
      method: "GET",
      credentials: "include"
    });
    if (!response.ok) {
      return null;
    }
    const payload = (await readJson(response)) as SessionResponse | null;
    const user = payload?.user;
    if (!user?.id || !user.email) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined
    };
  } catch {
    return null;
  }
}

export async function requestMagicLink(email: string): Promise<void> {
  const response = await fetch("/api/auth/sign-in/magic-link", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      callbackURL: "/",
      errorCallbackURL: "/?authError=1"
    })
  });
  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(
      apiMessage(payload, "We could not email a sign-in link. Try again, or continue as guest.")
    );
  }
}

export async function signOutAccount(): Promise<void> {
  try {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include"
    });
  } catch {
    // Local sign-out still proceeds if the API is unreachable.
  }
}

export function consumeAuthError(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (params.get("authError") !== "1") {
    return false;
  }
  params.delete("authError");
  const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", next);
  return true;
}

import { h } from "preact";
import { useState } from "preact/hooks";
import "oj-c/button";
import "oj-c/input-text";
import { requestMagicLink } from "../data/auth-client";
import { signInAsGuest } from "../data/store";
import { navigate } from "../data/router";

type Props = {
  authError?: string;
};

export function SignIn({ authError }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(authError || "");
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState("");

  function enterAsGuest() {
    signInAsGuest();
    navigate({ name: "discover" });
  }

  async function sendLink() {
    const nextEmail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(nextEmail)) {
      setError("Enter an email address that includes @ and a domain.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await requestMagicLink(nextEmail);
      setSentTo(nextEmail);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We could not email a sign-in link. Try again, or continue as guest."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div class="venu-signin">
      <section class="venu-signin-story">
        <div>
          <p class="venu-kicker">Events in New York</p>
          <h1>VENU</h1>
          <p>Hold your tickets. Pass them on when plans change.</p>
        </div>
        <p>
          Search events, claim guest-list tickets, and transfer them if you cannot attend.
        </p>
      </section>
      <section class="venu-signin-form">
        <h2>Sign in</h2>
        {sentTo ? (
          <div class="venu-form">
            <p class="venu-lede">
              We sent a sign-in link to <strong>{sentTo}</strong>. It expires in 15 minutes.
            </p>
            <p class="venu-meta">
              Use the same browser after you open the email. If nothing arrives, check spam
              or send the link again.
            </p>
            <oj-c-button
              label="Send a new link"
              chroming="callToAction"
              onojAction={() => {
                setSentTo("");
                setError("");
              }}
            ></oj-c-button>
            <oj-c-button
              label="Continue as guest"
              chroming="outlined"
              onojAction={enterAsGuest}
            ></oj-c-button>
          </div>
        ) : (
          <form
            class="venu-form"
            onSubmit={(event) => {
              event.preventDefault();
              void sendLink();
            }}
          >
            <p class="venu-lede">
              We email you a link. There is no password. Or continue as guest with sample tickets.
            </p>
            <oj-c-input-text
              id="email"
              labelHint="Email"
              value={email}
              autocomplete="username"
              onvalueChanged={(event: CustomEvent) => {
                setEmail(event.detail.value || "");
                setError("");
              }}
            ></oj-c-input-text>
            {error ? (
              <p class="venu-meta" role="alert">
                {error}
              </p>
            ) : (
              <p class="venu-meta">The link opens VENU and signs you in on this device.</p>
            )}
            <oj-c-button
              label={sending ? "Sending link…" : "Email me a link"}
              chroming="callToAction"
              disabled={sending}
              onojAction={() => void sendLink()}
            ></oj-c-button>
            <oj-c-button
              label="Continue as guest"
              chroming="outlined"
              disabled={sending}
              onojAction={enterAsGuest}
            ></oj-c-button>
          </form>
        )}
      </section>
    </div>
  );
}

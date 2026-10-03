import { h } from "preact";
import { useState } from "preact/hooks";
import "oj-c/button";
import "oj-c/input-text";
import "oj-c/input-password";
import { signIn } from "../data/store";
import { navigate } from "../data/router";

export function SignIn() {
  const [email, setEmail] = useState("alex.rivera@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function complete(nextEmail?: string) {
    if (nextEmail && !/^\S+@\S+\.\S+$/.test(nextEmail)) {
      setError("Enter an email address that includes @ and a domain.");
      return;
    }
    signIn(nextEmail);
    navigate({ name: "discover" });
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
        <p class="venu-lede" style="margin-bottom: 20px">
          Enter your email, or continue as Alex Rivera.
        </p>
        <form
          class="venu-form"
          onSubmit={(event) => {
            event.preventDefault();
            complete(email);
          }}
        >
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
          <oj-c-input-password
            id="password"
            labelHint="Password"
            value={password}
            maskIcon="visible"
            autocomplete="current-password"
            onvalueChanged={(event: CustomEvent) => {
              setPassword(event.detail.value || "");
            }}
          ></oj-c-input-password>
          {error ? (
            <p class="venu-meta" role="alert">
              {error}
            </p>
          ) : (
            <p class="venu-meta">Forgot password? Reset it from the email we have on file.</p>
          )}
          <oj-c-button
            label="Continue"
            chroming="callToAction"
            onojAction={() => complete(email)}
          ></oj-c-button>
          <oj-c-button
            label="Continue as Alex Rivera"
            chroming="outlined"
            onojAction={() => complete("alex.rivera@example.com")}
          ></oj-c-button>
        </form>
      </section>
    </div>
  );
}

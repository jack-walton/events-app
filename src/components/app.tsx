/**
 * VENU
 */
import { registerCustomElement } from "ojs/ojvcomponent";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import Context = require("ojs/ojcontext");
import { Header } from "./header";
import { pendingIncomingCount, SideNav } from "./nav";
import { SignIn } from "./sign-in";
import { DiscoverPage } from "./pages/discover";
import { EventDetailPage } from "./pages/event-detail";
import { NotificationsPage } from "./pages/notifications";
import { ProfilePage } from "./pages/profile";
import { TicketDetailPage } from "./pages/ticket-detail";
import { TransferWizardPage } from "./pages/transfer-wizard";
import { TransfersPage } from "./pages/transfers";
import { YourEventsPage } from "./pages/your-events";
import { consumeAuthError, fetchAccountSession } from "../data/auth-client";
import { navigate, useRoute } from "../data/router";
import { getEvent, signInWithAccount, signOutCurrent, useAppState } from "../data/store";
import { Route } from "../data/types";

export const App = registerCustomElement("app-root", () => {
  const state = useAppState();
  const route = useRoute();
  const [authReady, setAuthReady] = useState(state.signedIn);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (consumeAuthError()) {
      setAuthError("That sign-in link is expired or already used. Ask for a new one.");
    }
    fetchAccountSession()
      .then((session) => {
        if (!cancelled && session) {
          signInWithAccount(session);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setAuthReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }
    if (!state.signedIn && route.name !== "signin") {
      navigate({ name: "signin" });
    }
    if (state.signedIn && route.name === "signin") {
      navigate({ name: "discover" });
    }
  }, [authReady, state.signedIn, route.name]);

  if (!authReady && !state.signedIn) {
    return (
      <div id="appContainer" class="oj-web-applayout-page">
        <div class="venu-signin">
          <section class="venu-signin-story">
            <div>
              <p class="venu-kicker">Events in New York</p>
              <h1>VENU</h1>
              <p>Hold your tickets. Pass them on when plans change.</p>
            </div>
          </section>
          <section class="venu-signin-form">
            <h2>Opening VENU</h2>
            <p class="venu-lede">Checking whether you already have a session on this device.</p>
          </section>
        </div>
      </div>
    );
  }

  if (!state.signedIn) {
    return (
      <div id="appContainer" class="oj-web-applayout-page">
        <SignIn authError={authError} />
      </div>
    );
  }

  return (
    <div id="appContainer" class="oj-web-applayout-page venu-shell">
      <Header
        user={state.user}
        onSignOut={() => {
          void signOutCurrent().then(() => navigate({ name: "signin" }));
        }}
      />
      <div class="venu-body">
        <SideNav route={route} pendingIncoming={pendingIncomingCount(state.transfers)} />
        <main class="venu-main" role="main">
          {renderPage(route, state)}
        </main>
      </div>
    </div>
  );
});

function renderPage(route: Route, state: ReturnType<typeof useAppState>) {
  switch (route.name) {
    case "event":
      return <EventDetailPage event={getEvent(route.id)} />;
    case "events":
      return <YourEventsPage />;
    case "ticket":
      return (
        <TicketDetailPage
          ticket={state.tickets.find((ticket) => ticket.id === route.id)}
        />
      );
    case "transfers":
      return <TransfersPage />;
    case "transfer":
      return <TransferWizardPage presetIds={route.ticketIds} />;
    case "profile":
      return (
        <ProfilePage
          user={state.user}
          authMode={state.authMode}
          locationServices={state.locationServices}
          onSignOut={() => {
            void signOutCurrent().then(() => navigate({ name: "signin" }));
          }}
        />
      );
    case "notifications":
      return <NotificationsPage notifications={state.notifications} />;
    default:
      return <DiscoverPage events={state.events} location={state.user.location} />;
  }
}

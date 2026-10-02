/**
 * VENU
 */
import { registerCustomElement } from "ojs/ojvcomponent";
import { h } from "preact";
import { useEffect } from "preact/hooks";
import Context = require("ojs/ojcontext");
import { Footer } from "./footer";
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
import { navigate, useRoute } from "../data/router";
import { getEvent, signOut, useAppState } from "../data/store";
import { Route } from "../data/types";

export const App = registerCustomElement("app-root", () => {
  const state = useAppState();
  const route = useRoute();

  useEffect(() => {
    Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  }, []);

  useEffect(() => {
    if (!state.signedIn && route.name !== "signin") {
      navigate({ name: "signin" });
    }
    if (state.signedIn && route.name === "signin") {
      navigate({ name: "discover" });
    }
  }, [state.signedIn, route.name]);

  if (!state.signedIn) {
    return (
      <div id="appContainer" class="oj-web-applayout-page">
        <SignIn />
      </div>
    );
  }

  return (
    <div id="appContainer" class="oj-web-applayout-page venu-shell">
      <Header
        user={state.user}
        onSignOut={() => {
          signOut();
          navigate({ name: "signin" });
        }}
      />
      <div class="venu-body">
        <SideNav route={route} pendingIncoming={pendingIncomingCount(state.transfers)} />
        <main class="venu-main" role="main">
          {renderPage(route, state)}
        </main>
      </div>
      <Footer />
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
          locationServices={state.locationServices}
          onSignOut={() => {
            signOut();
            navigate({ name: "signin" });
          }}
        />
      );
    case "notifications":
      return <NotificationsPage notifications={state.notifications} />;
    default:
      return <DiscoverPage events={state.events} location={state.user.location} />;
  }
}

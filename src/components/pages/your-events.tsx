import { h } from "preact";
import { useState } from "preact/hooks";
import "oj-c/button";
import { EventItem, Ticket } from "../../data/types";
import { getEvent, getVisibleTickets } from "../../data/store";
import { hrefFor, navigate } from "../../data/router";
import { PageHeader } from "../page-header";
import { TicketCard } from "../ticket-card";

type Tab = "upcoming" | "transferred" | "past";

const copy: Record<Tab, { emptyTitle: string; emptyBody: string }> = {
  upcoming: {
    emptyTitle: "No upcoming tickets",
    emptyBody:
      "Search for something this week, or accept a transfer waiting for you. Claimed tickets stay here until the event starts."
  },
  transferred: {
    emptyTitle: "No transferred tickets",
    emptyBody:
      "When you cannot attend, transfer a ticket so it does not go unused. Accepted transfers stay on this tab."
  },
  past: {
    emptyTitle: "No past events yet",
    emptyBody: "Events appear here after the doors have closed."
  }
};

export function YourEventsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const tickets = getVisibleTickets().filter((ticket) => ticket.status === tab);

  return (
    <div>
      <PageHeader
        title="Your events"
        description="Tickets you hold, tickets you sent, and events that have already happened."
      >
        <oj-c-button
          label="Find events"
          chroming="outlined"
          onojAction={() => navigate({ name: "discover" })}
        ></oj-c-button>
      </PageHeader>
      <div class="venu-tabs" role="tablist" aria-label="Ticket status">
        {(["upcoming", "transferred", "past"] as Tab[]).map((item) => (
          <button
            class={`venu-tab${tab === item ? " is-selected" : ""}`}
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
          >
            {item === "upcoming" ? "Upcoming" : item === "transferred" ? "Transferred" : "Past"}
          </button>
        ))}
      </div>
      {tickets.length ? (
        <div class="venu-list">
          {tickets.map((ticket) => (
            <TicketCard
              ticket={ticket}
              event={getEvent(ticket.eventId)}
              actionLabel="View ticket"
              secondaryLabel={tab === "upcoming" ? "Transfer" : undefined}
              secondaryHref={
                tab === "upcoming" ? hrefFor({ name: "transfer", ticketIds: [ticket.id] }) : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div class="venu-panel venu-empty">
          <h2>{copy[tab].emptyTitle}</h2>
          <p class="venu-lede">{copy[tab].emptyBody}</p>
          {tab === "upcoming" ? (
            <div class="venu-actions" style="margin-top: 12px">
              <oj-c-button label="Find events" onojAction={() => navigate({ name: "discover" })}></oj-c-button>
              <oj-c-button
                label="Review transfers"
                chroming="outlined"
                onojAction={() => navigate({ name: "transfers" })}
              ></oj-c-button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function eventForTicket(ticket: Ticket): EventItem | undefined {
  return getEvent(ticket.eventId);
}

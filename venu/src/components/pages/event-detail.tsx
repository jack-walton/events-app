import { h } from "preact";
import { useState } from "preact/hooks";
import "oj-c/button";
import "oj-c/input-number";
import { EventItem, Ticket } from "../../data/types";
import { claimTickets, formatDateTime, getVisibleTickets } from "../../data/store";
import { hrefFor, navigate } from "../../data/router";
import { Banner } from "../banner";
import { PageHeader } from "../page-header";

type Props = {
  event?: EventItem;
};

export function EventDetailPage({ event }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  if (!event) {
    return (
      <div class="venu-panel venu-empty">
        <h2>Event not found</h2>
        <p class="venu-lede">It may have been removed from the list.</p>
        <oj-c-button label="Back to Discover" onojAction={() => navigate({ name: "discover" })}></oj-c-button>
      </div>
    );
  }

  const existing = getVisibleTickets().find(
    (ticket) => ticket.eventId === event.id && ticket.status === "upcoming"
  );
  const past = new Date(event.start).getTime() < Date.now();

  function claim() {
    const ticket = claimTickets(event!.id, quantity);
    if (ticket) {
      setMessage("Tickets added to Your events. You can transfer them if you cannot attend.");
      navigate({ name: "ticket", id: ticket.id });
    }
  }

  return (
    <div>
      <PageHeader
        title={event.name}
        description={`${formatDateTime(event.start)} · ${event.venue}, ${event.neighborhood}`}
      >
        <oj-c-button
          label="Back to Discover"
          chroming="ghost"
          onojAction={() => navigate({ name: "discover" })}
        ></oj-c-button>
      </PageHeader>
      {message ? <Banner title="Tickets added" body={message} tone="confirmation" /> : null}
      <div class="venu-detail">
        <article class="venu-panel">
          <div class={`venu-hero is-${event.genre.toLowerCase()} venu-poster`}>
            <span class="venu-kicker">{event.genre}</span>
            <strong>{event.artist}</strong>
          </div>
          <div class="venu-panel-body">
            <p>{event.description}</p>
            <p class="venu-meta" style="margin-top: 12px">
              Doors {formatDateTime(event.doors)}. {event.ageNote}
            </p>
          </div>
        </article>
        <aside class="venu-panel">
          <div class="venu-panel-body venu-form">
            <h2>Claim tickets</h2>
            <p class="venu-lede">
              VENU holds a guest list for this event. Claim only what you will use, then
              transfer the rest.
            </p>
            {past ? (
              <p class="venu-meta">This event has already happened. Tickets cannot be claimed.</p>
            ) : existing ? (
              <ExistingTicket ticket={existing} />
            ) : (
              <div class="venu-form">
                <oj-c-input-number
                  labelHint="Quantity"
                  value={quantity}
                  min={1}
                  max={event.claimLimit}
                  onvalueChanged={(eventValue: CustomEvent) =>
                    setQuantity(Number(eventValue.detail.value || 1))
                  }
                ></oj-c-input-number>
                <p class="venu-meta">Up to {event.claimLimit} tickets. Delivery is mobile only.</p>
                <oj-c-button
                  label={quantity === 1 ? "Claim 1 ticket" : `Claim ${quantity} tickets`}
                  chroming="callToAction"
                  onojAction={claim}
                ></oj-c-button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ExistingTicket({ ticket }: { ticket: Ticket }) {
  return (
    <div class="venu-form">
      <p class="venu-meta">These tickets are already in Your events.</p>
      <oj-c-button
        label="View ticket"
        chroming="outlined"
        onojAction={() => navigate({ name: "ticket", id: ticket.id })}
      ></oj-c-button>
      <a href={hrefFor({ name: "transfer", ticketIds: [ticket.id] })}>Transfer these tickets</a>
    </div>
  );
}

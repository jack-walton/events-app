import { h } from "preact";
import "oj-c/button";
import { Ticket } from "../../data/types";
import { formatDateTime, getEvent, seatsLabel } from "../../data/store";
import { hrefFor, navigate } from "../../data/router";
import { PageHeader } from "../page-header";
import { QrMark } from "../qr";

type Props = {
  ticket?: Ticket;
};

export function TicketDetailPage({ ticket }: Props) {
  if (!ticket) {
    return (
      <div class="venu-panel venu-empty">
        <h2>Ticket not found</h2>
        <p class="venu-lede">It may have been transferred or removed from your account.</p>
        <oj-c-button label="Your events" onojAction={() => navigate({ name: "events" })}></oj-c-button>
      </div>
    );
  }

  const event = getEvent(ticket.eventId);
  const transferable = ticket.status === "upcoming";

  return (
    <div>
      <PageHeader
        title={event?.name || "Ticket"}
        description={
          event
            ? `${formatDateTime(event.start)} · ${event.venue}`
            : "Mobile ticket"
        }
      >
        <oj-c-button
          label="Your events"
          chroming="ghost"
          onojAction={() => navigate({ name: "events" })}
        ></oj-c-button>
        {transferable ? (
          <oj-c-button
            label="Transfer"
            chroming="outlined"
            onojAction={() => navigate({ name: "transfer", ticketIds: [ticket.id] })}
          ></oj-c-button>
        ) : null}
      </PageHeader>
      <div class="venu-detail">
        <article class="venu-panel">
          <div class="venu-panel-body">
            <p class="venu-kicker" style="color: var(--oj-core-text-color-secondary)">
              Present at the door
            </p>
            <h2>Scan this ticket</h2>
            <p class="venu-lede" style="margin: 8px 0 16px">
              Show this code and your VENU Mobile ID. Do not screenshot a transfer in progress —
              the receiving account holds the live ticket after they accept.
            </p>
            <QrMark value={ticket.id} label={`Ticket barcode for ${event?.name || ticket.id}`} />
            <p class="venu-meta" style="margin-top: 12px">
              {seatsLabel(ticket.seats)}
              <br />
              Delivery: Mobile · Ticket {ticket.id.toUpperCase()}
            </p>
          </div>
        </article>
        <aside class="venu-panel">
          <div class="venu-panel-body">
            <h2>If you cannot attend</h2>
            <p class="venu-lede">
              Transfer the ticket to someone who can. It stays in your account until they
              accept. You can cancel until then.
            </p>
            {transferable ? (
              <div style="margin-top: 16px">
                <oj-c-button
                  label="Start a transfer"
                  chroming="callToAction"
                  onojAction={() => navigate({ name: "transfer", ticketIds: [ticket.id] })}
                ></oj-c-button>
              </div>
            ) : (
              <p class="venu-meta" style="margin-top: 12px">
                {ticket.status === "transferred"
                  ? "This ticket has been transferred. Open Transfers to see who holds it."
                  : "This event has already happened."}
              </p>
            )}
            {ticket.status === "transferred" ? (
              <p style="margin-top: 12px">
                <a href={hrefFor({ name: "transfers" })}>Open Transfers</a>
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

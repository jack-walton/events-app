import { h } from "preact";
import "oj-c/button";
import { EventItem, Ticket } from "../data/types";
import { formatDateTime, seatsLabel } from "../data/store";
import { hrefFor } from "../data/router";

type Props = {
  ticket: Ticket;
  event?: EventItem;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function TicketCard({
  ticket,
  event,
  actionLabel = "View ticket",
  actionHref,
  secondaryLabel,
  secondaryHref
}: Props) {
  const primary = actionHref || hrefFor({ name: "ticket", id: ticket.id });
  return (
    <article class="venu-panel venu-ticket">
      <div class="venu-row">
        <div>
          <p class="venu-kicker" style="color: var(--oj-core-text-color-secondary, #5f5a55)">
            {event?.genre || "Event"}
          </p>
          <h3>{event?.name || "Event"}</h3>
          <p class="venu-meta">
            {event ? formatDateTime(event.start) : ""}
            {event ? ` · ${event.venue}` : ""}
            <br />
            {seatsLabel(ticket.seats)}
          </p>
        </div>
        <div class="venu-actions">
          <oj-c-button
            label={actionLabel}
            chroming="outlined"
            size="sm"
            onojAction={() => {
              window.location.hash = primary.replace(/^#/, "");
            }}
          ></oj-c-button>
          {secondaryLabel && secondaryHref ? (
            <oj-c-button
              label={secondaryLabel}
              chroming="ghost"
              size="sm"
              onojAction={() => {
                window.location.hash = secondaryHref.replace(/^#/, "");
              }}
            ></oj-c-button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

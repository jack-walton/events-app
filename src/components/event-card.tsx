import { h } from "preact";
import { EventItem } from "../data/types";
import { formatDateTime } from "../data/store";
import { hrefFor } from "../data/router";

type Props = {
  event: EventItem;
};

export function EventCard({ event }: Props) {
  return (
    <a class="venu-card" href={hrefFor({ name: "event", id: event.id })}>
      <div class={`venu-poster is-${event.genre.toLowerCase()}`}>
        <span class="venu-kicker">{event.genre}</span>
        <strong>{event.neighborhood}</strong>
      </div>
      <div class="venu-card-body">
        <h3>{event.name}</h3>
        <p class="venu-meta">
          {formatDateTime(event.start)}
          <br />
          {event.venue}
        </p>
      </div>
    </a>
  );
}

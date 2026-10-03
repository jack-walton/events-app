import { h } from "preact";
import { useMemo, useState } from "preact/hooks";
import "oj-c/input-text";
import { DiscoverFilter, EventItem } from "../../data/types";
import { isSameDay, isThisWeekend } from "../../data/store";
import { EventCard } from "../event-card";
import { PageHeader } from "../page-header";

type Props = {
  events: EventItem[];
  location: string;
};

const filters: Array<{ id: DiscoverFilter; label: string }> = [
  { id: "all", label: "All events" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "weekend", label: "This weekend" },
  { id: "announced", label: "Recently announced" }
];

const genres = ["Music", "Sports", "Comedy", "Theater", "Arts", "Family"] as const;

export function DiscoverPage({ events, location }: Props) {
  const [query, setQuery] = useState("");
  const [when, setWhen] = useState<DiscoverFilter>("all");
  const [genre, setGenre] = useState<string>("");
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((event) => event.id !== "evt-vampire")
      .filter((event) => {
        if (!q) return true;
        return [event.name, event.artist, event.venue, event.neighborhood, event.genre]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .filter((event) => {
        if (when === "today") return isSameDay(event.start, now);
        if (when === "tomorrow") return isSameDay(event.start, tomorrow);
        if (when === "weekend") return isThisWeekend(event.start, now);
        if (when === "announced") return event.recentlyAnnounced;
        return true;
      })
      .filter((event) => (genre ? event.genre === genre : true))
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [events, query, when, genre]);

  const featured = events.filter((event) => event.featured && event.id !== "evt-vampire");

  return (
    <div>
      <PageHeader
        title="Discover"
        description={`Events near ${location}. Search by name, artist, or venue, or narrow the list by when it happens.`}
      />
      <div class="venu-search">
        <oj-c-input-text
          labelHint="Search events"
          placeholder="Event, artist, or venue"
          clearIcon="conditional"
          value={query}
          onvalueChanged={(event: CustomEvent) => setQuery(event.detail.value || "")}
        ></oj-c-input-text>
      </div>
      <div class="venu-filter-field">
        <p class="venu-filter-label" id="discover-when-label">
          When
        </p>
        <div class="venu-filters" role="group" aria-labelledby="discover-when-label">
          {filters.map((filter) => (
            <button
              class={`venu-chip${when === filter.id ? " is-selected" : ""}`}
              onClick={() => setWhen(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div class="venu-filter-field">
        <p class="venu-filter-label" id="discover-genre-label">
          Genre
        </p>
        <div class="venu-filters" role="group" aria-labelledby="discover-genre-label">
          <button class={`venu-chip${genre === "" ? " is-selected" : ""}`} onClick={() => setGenre("")}>
            All genres
          </button>
          {genres.map((item) => (
            <button
              class={`venu-chip${genre === item ? " is-selected" : ""}`}
              onClick={() => setGenre(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {when === "all" && !query && !genre ? (
        <section style="margin-bottom: 24px">
          <h2 class="venu-section-title">Featured in your area</h2>
          <p class="venu-lede" style="margin-bottom: 12px">
            A short list of shows we would not let sit empty.
          </p>
          <div class="venu-grid">
            {featured.map((event) => (
              <EventCard event={event} />
            ))}
          </div>
        </section>
      ) : null}
      <section>
        <h2 class="venu-section-title">
          {filtered.length === 1 ? "1 event" : `${filtered.length} events`}
        </h2>
        {filtered.length ? (
          <div class="venu-grid" style="margin-top: 12px">
            {filtered.map((event) => (
              <EventCard event={event} />
            ))}
          </div>
        ) : (
          <div class="venu-panel venu-empty">
            <h2>Nothing matches that search</h2>
            <p class="venu-lede">
              Try a different artist, clear the date filter, or browse All events. Guest-list
              tickets are still available on several shows this month.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

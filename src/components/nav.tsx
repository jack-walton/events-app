import { h } from "preact";
import { hrefFor } from "../data/router";
import { Route, Transfer } from "../data/types";

type Props = {
  route: Route;
  pendingIncoming: number;
};

const items: Array<{
  id: "discover" | "events" | "transfers";
  label: string;
  href: string;
  note?: (count: number) => number | undefined;
}> = [
  { id: "discover", label: "Discover", href: hrefFor({ name: "discover" }) },
  { id: "events", label: "Your events", href: hrefFor({ name: "events" }) },
  {
    id: "transfers",
    label: "Transfers",
    href: hrefFor({ name: "transfers" }),
    note: (count) => (count ? count : undefined)
  }
];

export function SideNav({ route, pendingIncoming }: Props) {
  const current =
    route.name === "event" || route.name === "discover"
      ? "discover"
      : route.name === "ticket" || route.name === "events"
        ? "events"
        : route.name === "transfer" || route.name === "transfers"
          ? "transfers"
          : undefined;

  return (
    <nav class="venu-nav" aria-label="Application">
      <div class="venu-nav-card">
        {items.map((item) => {
          const selected = current === item.id;
          const waiting = item.note?.(pendingIncoming);
          return (
            <a
              class={`venu-nav-button${selected ? " is-selected" : ""}`}
              href={item.href}
              aria-current={selected ? "page" : undefined}
            >
              <span class="venu-nav-label">{item.label}</span>
              {waiting ? (
                <span class="venu-nav-meta">
                  <span class="venu-nav-meta-count">{waiting}</span>
                  <span class="venu-nav-meta-label"> waiting</span>
                </span>
              ) : null}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export function pendingIncomingCount(transfers: Transfer[]): number {
  return transfers.filter(
    (transfer) => transfer.direction === "incoming" && transfer.status === "pending"
  ).length;
}

import { useEffect, useState } from "preact/hooks";
import { Route } from "./types";

const listeners = new Set<(route: Route) => void>();

function emit(route: Route) {
  listeners.forEach((listener) => listener(route));
}

export function parseHash(hash = window.location.hash): Route {
  const path = hash.replace(/^#\/?/, "");
  const [name, param] = path.split("/");
  switch (name) {
    case "event":
      return param ? { name: "event", id: param } : { name: "discover" };
    case "ticket":
      return param ? { name: "ticket", id: param } : { name: "events" };
    case "events":
      return { name: "events" };
    case "transfers":
      return { name: "transfers" };
    case "transfer":
      return {
        name: "transfer",
        ticketIds: param ? param.split(",") : undefined
      };
    case "profile":
      return { name: "profile" };
    case "notifications":
      return { name: "notifications" };
    case "signin":
      return { name: "signin" };
    default:
      return { name: "discover" };
  }
}

export function hrefFor(route: Route): string {
  switch (route.name) {
    case "event":
      return `#/event/${route.id}`;
    case "ticket":
      return `#/ticket/${route.id}`;
    case "transfer":
      return route.ticketIds?.length
        ? `#/transfer/${route.ticketIds.join(",")}`
        : "#/transfer";
    case "signin":
      return "#/signin";
    case "events":
      return "#/events";
    case "transfers":
      return "#/transfers";
    case "profile":
      return "#/profile";
    case "notifications":
      return "#/notifications";
    default:
      return "#/discover";
  }
}

export function navigate(route: Route) {
  const next = hrefFor(route);
  if (window.location.hash !== next) {
    window.location.hash = next.replace(/^#/, "");
  }
  emit(route);
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash());
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    const onNavigate = (next: Route) => setRoute(next);
    listeners.add(onNavigate);
    window.addEventListener("hashchange", onChange);
    return () => {
      listeners.delete(onNavigate);
      window.removeEventListener("hashchange", onChange);
    };
  }, []);
  return route;
}

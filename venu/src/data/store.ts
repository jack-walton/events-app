import { useEffect, useState } from "preact/hooks";
import { createSeedState, PAST_EVENT } from "./seed";
import {
  AppState,
  EventItem,
  NotificationItem,
  Seat,
  Ticket,
  Transfer
} from "./types";

const STORAGE_KEY = "venu-redwood-state-v1";

let state: AppState = loadState();
const listeners = new Set<() => void>();

function loadState(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return hydrate(createSeedState());
    }
    const parsed = JSON.parse(raw) as AppState;
    return hydrate({ ...createSeedState(), ...parsed, events: createSeedState().events });
  } catch {
    return hydrate(createSeedState());
  }
}

function hydrate(next: AppState): AppState {
  const events = next.events.some((event) => event.id === PAST_EVENT.id)
    ? next.events
    : [...next.events, PAST_EVENT];
  return { ...next, events };
}

function persist() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener());
}

function update(mutator: (current: AppState) => AppState) {
  state = mutator(state);
  persist();
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getState(): AppState {
  return state;
}

export function useAppState(): AppState {
  const [snapshot, setSnapshot] = useState(state);
  useEffect(() => {
    const listener = () => setSnapshot(getState());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return snapshot;
}

export function signIn(email?: string) {
  update((current) => ({
    ...current,
    signedIn: true,
    user: {
      ...current.user,
      email: email?.trim() || current.user.email
    }
  }));
}

export function signOut() {
  update((current) => ({ ...current, signedIn: false }));
}

export function resetAccount() {
  state = hydrate(createSeedState());
  state = { ...state, signedIn: true };
  persist();
}

export function getEvent(id: string): EventItem | undefined {
  return state.events.find((event) => event.id === id);
}

export function isIncomingHold(ticketId: string): boolean {
  return state.transfers.some(
    (transfer) =>
      transfer.ticketId === ticketId &&
      transfer.direction === "incoming" &&
      transfer.status === "pending"
  );
}

export function getVisibleTickets(): Ticket[] {
  return state.tickets.filter((ticket) => !isIncomingHold(ticket.id));
}

export function formatDate(iso: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...options
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(iso: string, date: Date): boolean {
  const value = startOfDay(new Date(iso)).getTime();
  return value === startOfDay(date).getTime();
}

export function isThisWeekend(iso: string, now = new Date()): boolean {
  const eventDay = startOfDay(new Date(iso));
  const day = now.getDay();
  const saturday = startOfDay(new Date(now));
  saturday.setDate(now.getDate() + ((6 - day + 7) % 7));
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  const time = eventDay.getTime();
  return time === saturday.getTime() || time === sunday.getTime();
}

export function seatsLabel(seats: Seat[]): string {
  if (seats.length === 1) {
    const [seat] = seats;
    if (seat.seat === "GA") {
      return seat.section;
    }
    return `Section ${seat.section} · Row ${seat.row} · Seat ${seat.seat}`;
  }
  const [first] = seats;
  const last = seats[seats.length - 1];
  return `Section ${first.section} · Row ${first.row} · Seats ${first.seat}–${last.seat}`;
}

export function claimTickets(eventId: string, quantity: number): Ticket | null {
  const event = getEvent(eventId);
  if (!event) {
    return null;
  }
  const existing = state.tickets.find(
    (ticket) => ticket.eventId === eventId && ticket.status === "upcoming" && !isIncomingHold(ticket.id)
  );
  if (existing) {
    return existing;
  }
  const seats: Seat[] = Array.from({ length: quantity }, (_, index) => ({
    section: event.genre === "Music" ? "GA Floor" : "A",
    row: event.genre === "Music" ? "—" : "4",
    seat: event.genre === "Music" ? "GA" : String(12 + index)
  }));
  const ticket: Ticket = {
    id: uid("tkt"),
    eventId,
    seats,
    delivery: "Mobile",
    status: "upcoming",
    claimedAt: new Date().toISOString()
  };
  const notification: NotificationItem = {
    id: uid("ntf"),
    title: "Tickets added to Your events",
    body: `${event.name} is on your list. Transfer the tickets if you cannot attend.`,
    createdAt: new Date().toISOString(),
    read: false,
    route: { name: "ticket", id: ticket.id }
  };
  update((current) => ({
    ...current,
    tickets: [ticket, ...current.tickets],
    notifications: [notification, ...current.notifications]
  }));
  return ticket;
}

export function startTransfer(
  ticketIds: string[],
  recipientName: string,
  recipientEmail: string,
  message: string
): Transfer[] {
  const created: Transfer[] = [];
  ticketIds.forEach((ticketId) => {
    const ticket = state.tickets.find((item) => item.id === ticketId);
    if (!ticket || ticket.status !== "upcoming" || isIncomingHold(ticket.id)) {
      return;
    }
    const transfer: Transfer = {
      id: uid("tr"),
      ticketId,
      direction: "outgoing",
      status: "pending",
      recipientName,
      recipientEmail,
      senderName: `${state.user.firstName} ${state.user.lastName}`,
      senderEmail: state.user.email,
      message,
      createdAt: new Date().toISOString()
    };
    created.push(transfer);
  });
  if (!created.length) {
    return [];
  }
  update((current) => ({
    ...current,
    tickets: current.tickets.map((ticket) =>
      created.some((transfer) => transfer.ticketId === ticket.id)
        ? { ...ticket, status: "transferred" as const }
        : ticket
    ),
    transfers: [...created, ...current.transfers],
    notifications: [
      {
        id: uid("ntf"),
        title: created.length === 1 ? "Transfer sent" : "Transfers sent",
        body: `${recipientName} has ${created.length === 1 ? "the ticket" : "the tickets"} until they accept. You can cancel from Transfers.`,
        createdAt: new Date().toISOString(),
        read: false,
        route: { name: "transfers" }
      },
      ...current.notifications
    ]
  }));
  return created;
}

export function cancelTransfer(transferId: string) {
  const transfer = state.transfers.find((item) => item.id === transferId);
  if (!transfer || transfer.status !== "pending" || transfer.direction !== "outgoing") {
    return;
  }
  update((current) => ({
    ...current,
    tickets: current.tickets.map((ticket) =>
      ticket.id === transfer.ticketId ? { ...ticket, status: "upcoming" as const } : ticket
    ),
    transfers: current.transfers.map((item) =>
      item.id === transferId
        ? { ...item, status: "canceled" as const, resolvedAt: new Date().toISOString() }
        : item
    ),
    notifications: [
      {
        id: uid("ntf"),
        title: "Transfer canceled",
        body: "The tickets are in Your events again.",
        createdAt: new Date().toISOString(),
        read: false,
        route: { name: "events" }
      },
      ...current.notifications
    ]
  }));
}

export function acceptTransfer(transferId: string) {
  const transfer = state.transfers.find((item) => item.id === transferId);
  if (!transfer || transfer.status !== "pending" || transfer.direction !== "incoming") {
    return;
  }
  update((current) => ({
    ...current,
    transfers: current.transfers.map((item) =>
      item.id === transferId
        ? { ...item, status: "accepted" as const, resolvedAt: new Date().toISOString() }
        : item
    ),
    notifications: [
      {
        id: uid("ntf"),
        title: "Tickets added",
        body: "These tickets are now in Your events. Show your VENU Mobile ID at the door.",
        createdAt: new Date().toISOString(),
        read: false,
        route: { name: "events" }
      },
      ...current.notifications
    ]
  }));
}

export function declineTransfer(transferId: string) {
  const transfer = state.transfers.find((item) => item.id === transferId);
  if (!transfer || transfer.status !== "pending" || transfer.direction !== "incoming") {
    return;
  }
  update((current) => ({
    ...current,
    tickets: current.tickets.filter((ticket) => ticket.id !== transfer.ticketId),
    transfers: current.transfers.map((item) =>
      item.id === transferId
        ? { ...item, status: "declined" as const, resolvedAt: new Date().toISOString() }
        : item
    ),
    notifications: [
      {
        id: uid("ntf"),
        title: "Transfer declined",
        body: "The tickets stay with the person who sent them.",
        createdAt: new Date().toISOString(),
        read: false,
        route: { name: "transfers" }
      },
      ...current.notifications
    ]
  }));
}

export function markNotificationsRead() {
  update((current) => ({
    ...current,
    notifications: current.notifications.map((item) => ({ ...item, read: true }))
  }));
}

export function setLocationServices(enabled: boolean) {
  update((current) => ({ ...current, locationServices: enabled }));
}

export function unreadCount(): number {
  return state.notifications.filter((item) => !item.read).length;
}

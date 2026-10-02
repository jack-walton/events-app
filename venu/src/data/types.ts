export type Genre = "Music" | "Sports" | "Comedy" | "Theater" | "Arts" | "Family";

export type DiscoverFilter = "all" | "today" | "tomorrow" | "weekend" | "announced";

export type TicketStatus = "upcoming" | "transferred" | "past";

export type TransferStatus = "pending" | "accepted" | "declined" | "canceled";

export type TransferDirection = "outgoing" | "incoming";

export type RouteName =
  | "signin"
  | "discover"
  | "event"
  | "events"
  | "ticket"
  | "transfers"
  | "transfer"
  | "profile"
  | "notifications";

export type Route =
  | { name: "signin" }
  | { name: "discover" }
  | { name: "event"; id: string }
  | { name: "events" }
  | { name: "ticket"; id: string }
  | { name: "transfers" }
  | { name: "transfer"; ticketIds?: string[] }
  | { name: "profile" }
  | { name: "notifications" };

export interface EventItem {
  id: string;
  name: string;
  artist: string;
  venue: string;
  neighborhood: string;
  start: string;
  doors: string;
  genre: Genre;
  featured: boolean;
  recentlyAnnounced: boolean;
  description: string;
  ageNote: string;
  claimLimit: number;
}

export interface Seat {
  section: string;
  row: string;
  seat: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  seats: Seat[];
  delivery: "Mobile";
  status: TicketStatus;
  claimedAt: string;
}

export interface Transfer {
  id: string;
  ticketId: string;
  direction: TransferDirection;
  status: TransferStatus;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  route?: Route;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  mobileId: string;
}

export interface AppState {
  signedIn: boolean;
  user: UserProfile;
  events: EventItem[];
  tickets: Ticket[];
  transfers: Transfer[];
  notifications: NotificationItem[];
  locationServices: boolean;
  appearance: "redwood";
}

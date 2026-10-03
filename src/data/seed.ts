import { AppState } from "./types";

export function createSeedState(): AppState {
  return {
    signedIn: false,
    user: {
      firstName: "Alex",
      lastName: "Rivera",
      email: "alex.rivera@example.com",
      phone: "(347) 555-0148",
      location: "Brooklyn, NY",
      mobileId: "VNU-AR-184029"
    },
    locationServices: true,
    appearance: "redwood",
    events: [
      {
        id: "evt-winery",
        name: "Late Set at City Winery",
        artist: "City Winery House Band",
        venue: "City Winery",
        neighborhood: "Hudson Square",
        start: "2026-10-02T20:00:00",
        doors: "2026-10-02T19:00:00",
        genre: "Music",
        featured: false,
        recentlyAnnounced: false,
        description: "A standing-room late set. Tickets are held on a guest list — claim what you can use, then transfer the rest before doors.",
        ageNote: "21 and over. Bring a valid photo ID.",
        claimLimit: 2
      },
      {
        id: "evt-cellar",
        name: "Comedy Cellar Late Show",
        artist: "Rotating lineup",
        venue: "Comedy Cellar",
        neighborhood: "Greenwich Village",
        start: "2026-10-03T22:30:00",
        doors: "2026-10-03T21:45:00",
        genre: "Comedy",
        featured: true,
        recentlyAnnounced: false,
        description: "A late lineup announced the day of the show. Seats are assigned at the door from your VENU Mobile ID.",
        ageNote: "18 and over.",
        claimLimit: 2
      },
      {
        id: "evt-bam",
        name: "Family Saturday at BAM",
        artist: "Brooklyn Academy of Music",
        venue: "BAM Fisher",
        neighborhood: "Fort Greene",
        start: "2026-10-03T11:00:00",
        doors: "2026-10-03T10:30:00",
        genre: "Family",
        featured: false,
        recentlyAnnounced: false,
        description: "A morning workshop and a short performance. Each ticket admits one adult or one child.",
        ageNote: "All ages. Children under 12 must attend with an adult.",
        claimLimit: 4
      },
      {
        id: "evt-jazz",
        name: "Jazz at Lincoln Center",
        artist: "The Jazz at Lincoln Center Orchestra",
        venue: "Rose Theater",
        neighborhood: "Columbus Circle",
        start: "2026-10-04T19:30:00",
        doors: "2026-10-04T18:30:00",
        genre: "Arts",
        featured: false,
        recentlyAnnounced: false,
        description: "A program of new commissions and standards. Late seating is at the discretion of the house.",
        ageNote: "All ages.",
        claimLimit: 2
      },
      {
        id: "evt-nets",
        name: "Brooklyn Nets vs. New York Knicks",
        artist: "Brooklyn Nets",
        venue: "Barclays Center",
        neighborhood: "Prospect Heights",
        start: "2026-10-11T19:30:00",
        doors: "2026-10-11T18:00:00",
        genre: "Sports",
        featured: true,
        recentlyAnnounced: false,
        description: "A regular-season meeting. Mobile tickets are scanned at the arena gates. Transfer unused seats before tip-off.",
        ageNote: "All ages.",
        claimLimit: 4
      },
      {
        id: "evt-breakfast",
        name: "Japanese Breakfast",
        artist: "Japanese Breakfast",
        venue: "Brooklyn Steel",
        neighborhood: "East Williamsburg",
        start: "2026-10-18T20:00:00",
        doors: "2026-10-18T19:00:00",
        genre: "Music",
        featured: true,
        recentlyAnnounced: false,
        description: "General admission on the floor. Arrive early if you want a rail spot. You can transfer a ticket until the show is underway.",
        ageNote: "16 and over. Guests 16–17 must attend with an adult.",
        claimLimit: 2
      },
      {
        id: "evt-nycfc",
        name: "New York City FC vs. Inter Miami CF",
        artist: "New York City FC",
        venue: "Yankee Stadium",
        neighborhood: "Concourse",
        start: "2026-10-19T16:00:00",
        doors: "2026-10-19T14:30:00",
        genre: "Sports",
        featured: false,
        recentlyAnnounced: false,
        description: "Supporters’ section tickets are standing only. Transfers must be accepted before first whistle.",
        ageNote: "All ages.",
        claimLimit: 2
      },
      {
        id: "evt-national",
        name: "The National",
        artist: "The National",
        venue: "Forest Hills Stadium",
        neighborhood: "Forest Hills",
        start: "2026-10-24T18:30:00",
        doors: "2026-10-24T16:30:00",
        genre: "Music",
        featured: true,
        recentlyAnnounced: false,
        description: "An outdoor reserved-seat show. Weather does not cancel the event. Transfer seats you cannot use so they are not empty.",
        ageNote: "All ages.",
        claimLimit: 4
      },
      {
        id: "evt-gadsby",
        name: "Hannah Gadsby: Something Special",
        artist: "Hannah Gadsby",
        venue: "Beacon Theatre",
        neighborhood: "Upper West Side",
        start: "2026-10-30T20:00:00",
        doors: "2026-10-30T19:00:00",
        genre: "Comedy",
        featured: false,
        recentlyAnnounced: false,
        description: "A single performance. Late arrivals are seated between bits. Phones stay away during the set.",
        ageNote: "17 and over.",
        claimLimit: 2
      },
      {
        id: "evt-hadestown",
        name: "Hadestown",
        artist: "Hadestown",
        venue: "Walter Kerr Theatre",
        neighborhood: "Theater District",
        start: "2026-11-08T14:00:00",
        doors: "2026-11-08T13:15:00",
        genre: "Theater",
        featured: false,
        recentlyAnnounced: false,
        description: "A Sunday matinee. The house opens 45 minutes before curtain. Transferred tickets must be accepted before 12:00 p.m. on the day of the show.",
        ageNote: "All ages. The production includes haze and loud sound.",
        claimLimit: 2
      },
      {
        id: "evt-phil",
        name: "New York Philharmonic",
        artist: "New York Philharmonic",
        venue: "David Geffen Hall",
        neighborhood: "Lincoln Center",
        start: "2026-11-14T19:30:00",
        doors: "2026-11-14T18:30:00",
        genre: "Arts",
        featured: false,
        recentlyAnnounced: false,
        description: "An evening program of new work and a symphony. Coats can be checked in the lobby. Transfers are allowed until the concert begins.",
        ageNote: "All ages.",
        claimLimit: 2
      },
      {
        id: "evt-vampire",
        name: "Vampire Weekend",
        artist: "Vampire Weekend",
        venue: "Prospect Park Bandshell",
        neighborhood: "Park Slope",
        start: "2026-09-12T18:00:00",
        doors: "2026-09-12T16:30:00",
        genre: "Music",
        featured: false,
        recentlyAnnounced: false,
        description: "An outdoor summer show. This event has already happened.",
        ageNote: "All ages.",
        claimLimit: 2
      },
      {
        id: "evt-boygenius",
        name: "boygenius",
        artist: "boygenius",
        venue: "Madison Square Garden",
        neighborhood: "Midtown",
        start: "2026-12-05T20:00:00",
        doors: "2026-12-05T18:30:00",
        genre: "Music",
        featured: true,
        recentlyAnnounced: true,
        description: "Just announced. Claim guest-list tickets while they remain, then transfer any you cannot use.",
        ageNote: "All ages.",
        claimLimit: 2
      }
    ],
    tickets: [
      {
        id: "tkt-nets-1",
        eventId: "evt-nets",
        seats: [
          { section: "118", row: "12", seat: "5" },
          { section: "118", row: "12", seat: "6" }
        ],
        delivery: "Mobile",
        status: "upcoming",
        claimedAt: "2026-09-14T09:12:00"
      },
      {
        id: "tkt-breakfast-1",
        eventId: "evt-breakfast",
        seats: [{ section: "GA Floor", row: "—", seat: "GA" }],
        delivery: "Mobile",
        status: "upcoming",
        claimedAt: "2026-09-20T16:40:00"
      },
      {
        id: "tkt-hadestown-1",
        eventId: "evt-hadestown",
        seats: [{ section: "Orchestra C", row: "F", seat: "8" }],
        delivery: "Mobile",
        status: "transferred",
        claimedAt: "2026-08-02T11:05:00"
      },
      {
        id: "tkt-vampire",
        eventId: "evt-vampire",
        seats: [{ section: "Lawn", row: "—", seat: "GA" }],
        delivery: "Mobile",
        status: "past",
        claimedAt: "2026-07-18T10:22:00"
      },
      {
        id: "tkt-national-in",
        eventId: "evt-national",
        seats: [
          { section: "202", row: "H", seat: "11" },
          { section: "202", row: "H", seat: "12" }
        ],
        delivery: "Mobile",
        status: "upcoming",
        claimedAt: "2026-09-28T19:03:00"
      }
    ],
    transfers: [
      {
        id: "tr-hadestown",
        ticketId: "tkt-hadestown-1",
        direction: "outgoing",
        status: "accepted",
        recipientName: "Sam Okonkwo",
        recipientEmail: "sam.okonkwo@example.com",
        senderName: "Alex Rivera",
        senderEmail: "alex.rivera@example.com",
        message: "Cannot make the matinee — these are yours.",
        createdAt: "2026-09-30T08:15:00",
        resolvedAt: "2026-09-30T12:41:00"
      },
      {
        id: "tr-national-in",
        ticketId: "tkt-national-in",
        direction: "incoming",
        status: "pending",
        recipientName: "Alex Rivera",
        recipientEmail: "alex.rivera@example.com",
        senderName: "Jordan Hale",
        senderEmail: "jordan.hale@example.com",
        message: "Two seats if you can get to Forest Hills.",
        createdAt: "2026-10-01T21:10:00"
      }
    ],
    notifications: [
      {
        id: "ntf-1",
        title: "Tickets waiting for you",
        body: "Jordan Hale sent you two tickets to The National. Accept them from Transfers, or they stay with Jordan.",
        createdAt: "2026-10-01T21:10:00",
        read: false,
        route: { name: "transfers" }
      },
      {
        id: "ntf-2",
        title: "Sam accepted Hadestown",
        body: "The Orchestra C ticket is no longer in your account. It will show under Transferred.",
        createdAt: "2026-09-30T12:41:00",
        read: true,
        route: { name: "events" }
      }
    ]
  };
}

export const PAST_EVENT = {
  id: "evt-vampire",
  name: "Vampire Weekend",
  artist: "Vampire Weekend",
  venue: "Prospect Park Bandshell",
  neighborhood: "Park Slope",
  start: "2026-09-12T18:00:00",
  doors: "2026-09-12T16:30:00",
  genre: "Music" as const,
  featured: false,
  recentlyAnnounced: false,
  description: "An outdoor summer show. This event has already happened.",
  ageNote: "All ages.",
  claimLimit: 2
};

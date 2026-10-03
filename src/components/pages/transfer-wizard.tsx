import { h } from "preact";
import { useMemo, useState } from "preact/hooks";
import "oj-c/button";
import "oj-c/input-text";
import "oj-c/text-area";
import { Ticket } from "../../data/types";
import {
  formatDateTime,
  getEvent,
  getVisibleTickets,
  seatsLabel,
  startTransfer
} from "../../data/store";
import { navigate } from "../../data/router";
import { Banner } from "../banner";
import { PageHeader } from "../page-header";

type Props = {
  presetIds?: string[];
};

export function TransferWizardPage({ presetIds }: Props) {
  const upcoming = getVisibleTickets().filter((ticket) => ticket.status === "upcoming");
  const [selected, setSelected] = useState<string[]>(
    presetIds?.filter((id) => upcoming.some((ticket) => ticket.id === id)) ||
      (upcoming[0] ? [upcoming[0].id] : [])
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const chosen = useMemo(
    () => upcoming.filter((ticket) => selected.includes(ticket.id)),
    [upcoming, selected]
  );

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function send() {
    if (!chosen.length) {
      setError("Select at least one upcoming ticket.");
      return;
    }
    if (!name.trim()) {
      setError("Enter the recipient’s name so they know the tickets are for them.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter an email address that includes @ and a domain.");
      return;
    }
    if (!confirmed) {
      setError("Confirm that you understand the tickets stay with you until they accept.");
      return;
    }
    startTransfer(chosen.map((ticket) => ticket.id), name.trim(), email.trim(), message.trim());
    setSent(true);
  }

  if (sent) {
    return (
      <div>
        <PageHeader title="Transfer sent" />
        <Banner
          title={chosen.length === 1 ? "The ticket is waiting" : "The tickets are waiting"}
          body={`${name} will see this in Transfers. You can cancel until they accept.`}
          tone="confirmation"
        >
          <oj-c-button label="Go to Transfers" onojAction={() => navigate({ name: "transfers" })}></oj-c-button>
        </Banner>
      </div>
    );
  }

  if (!upcoming.length) {
    return (
      <div>
        <PageHeader
          title="Transfer tickets"
          description="You do not have any upcoming tickets to send."
        />
        <div class="venu-panel venu-empty">
          <h2>Nothing to transfer</h2>
          <p class="venu-lede">
            Claim tickets from Discover, or accept a transfer waiting for you. Only upcoming
            tickets can be sent.
          </p>
          <div class="venu-actions" style="margin-top: 12px">
            <oj-c-button label="Find events" onojAction={() => navigate({ name: "discover" })}></oj-c-button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Transfer tickets"
        description="Choose tickets, name the recipient, and send. Nothing is final until they accept."
      />
      {error ? <Banner title="Check this before you send" body={error} tone="warning" /> : null}
      <div class="venu-detail">
        <section class="venu-panel">
          <div class="venu-panel-body venu-form">
            <h2>1. Tickets</h2>
            {upcoming.map((ticket) => (
              <TicketChoice
                key={ticket.id}
                ticket={ticket}
                checked={selected.includes(ticket.id)}
                onToggle={() => toggle(ticket.id)}
              />
            ))}
            <h2>2. Recipient</h2>
            <oj-c-input-text
              labelHint="Name"
              value={name}
              onvalueChanged={(event: CustomEvent) => setName(event.detail.value || "")}
            ></oj-c-input-text>
            <oj-c-input-text
              labelHint="Email"
              value={email}
              onvalueChanged={(event: CustomEvent) => setEmail(event.detail.value || "")}
            ></oj-c-input-text>
            <oj-c-text-area
              labelHint="Message (optional)"
              value={message}
              rows={3}
              onvalueChanged={(event: CustomEvent) => setMessage(event.detail.value || "")}
            ></oj-c-text-area>
          </div>
        </section>
        <aside class="venu-panel">
          <div class="venu-panel-body venu-form">
            <h2>3. Review</h2>
            {chosen.length ? (
              <ul class="venu-inline-list">
                {chosen.map((ticket) => {
                  const event = getEvent(ticket.eventId);
                  return (
                    <li>
                      {event?.name} — {seatsLabel(ticket.seats)}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p class="venu-meta">Select a ticket to review the transfer.</p>
            )}
            <label class="venu-settings-item" style="cursor:pointer;align-items:flex-start">
              <span class="venu-lede">
                I understand these tickets stay in my account until {name || "the recipient"} accepts.
              </span>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed((event.target as HTMLInputElement).checked)}
              />
            </label>
            <oj-c-button label="Send transfer" chroming="callToAction" onojAction={send}></oj-c-button>
            <oj-c-button
              label="Cancel"
              chroming="ghost"
              onojAction={() => navigate({ name: "events" })}
            ></oj-c-button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function TicketChoice({
  ticket,
  checked,
  onToggle
}: {
  ticket: Ticket;
  checked: boolean;
  onToggle: () => void;
}) {
  const event = getEvent(ticket.eventId);
  return (
    <label class="venu-settings-item" style="cursor:pointer">
      <div>
        <strong>{event?.name}</strong>
        <p class="venu-meta">
          {event ? formatDateTime(event.start) : ""} · {seatsLabel(ticket.seats)}
        </p>
      </div>
      <input type="checkbox" checked={checked} onChange={onToggle} />
    </label>
  );
}

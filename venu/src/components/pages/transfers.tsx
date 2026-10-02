import { h } from "preact";
import { useState } from "preact/hooks";
import "oj-c/button";
import { Transfer } from "../../data/types";
import {
  acceptTransfer,
  cancelTransfer,
  declineTransfer,
  formatDateTime,
  getEvent,
  getState
} from "../../data/store";
import { navigate } from "../../data/router";
import { Banner } from "../banner";
import { PageHeader } from "../page-header";

type Tab = "incoming" | "outgoing" | "resolved";

export function TransfersPage() {
  const [tab, setTab] = useState<Tab>("incoming");
  const [flash, setFlash] = useState("");
  const transfers = getState().transfers;
  const incoming = transfers.filter((item) => item.direction === "incoming" && item.status === "pending");
  const outgoing = transfers.filter((item) => item.direction === "outgoing" && item.status === "pending");
  const resolved = transfers.filter((item) => item.status !== "pending");

  const rows = tab === "incoming" ? incoming : tab === "outgoing" ? outgoing : resolved;

  return (
    <div>
      <PageHeader
        title="Transfers"
        description="Tickets sent to you, tickets you sent, and transfers that are already complete."
      >
        <oj-c-button
          label="Transfer a ticket"
          chroming="outlined"
          onojAction={() => navigate({ name: "transfer" })}
        ></oj-c-button>
      </PageHeader>
      {flash ? <Banner title={flash} tone="confirmation" /> : null}
      <div class="venu-tabs" role="tablist" aria-label="Transfer status">
        <TabButton id="incoming" tab={tab} setTab={setTab} label={`Incoming (${incoming.length})`} />
        <TabButton id="outgoing" tab={tab} setTab={setTab} label={`Sent (${outgoing.length})`} />
        <TabButton id="resolved" tab={tab} setTab={setTab} label="Completed" />
      </div>
      {tab === "incoming" && !incoming.length ? (
        <Empty
          title="No tickets waiting for you"
          body="When someone transfers tickets to this account, they appear here until you accept or decline them."
        />
      ) : null}
      {tab === "outgoing" && !outgoing.length ? (
        <Empty
          title="No transfers in progress"
          body="Start from one of your upcoming tickets. The tickets stay in your account until the other person accepts."
        />
      ) : null}
      {tab === "resolved" && !resolved.length ? (
        <Empty
          title="No completed transfers"
          body="Accepted, declined, and canceled transfers are listed here so you can see what changed."
        />
      ) : null}
      <div class="venu-list">
        {rows.map((transfer) => (
          <TransferCard
            transfer={transfer}
            onAccept={() => {
              acceptTransfer(transfer.id);
              setFlash("Tickets added. They are in Your events.");
            }}
            onDecline={() => {
              declineTransfer(transfer.id);
              setFlash("Transfer declined. The tickets stay with the sender.");
            }}
            onCancel={() => {
              cancelTransfer(transfer.id);
              setFlash("Transfer canceled. The tickets are in Your events again.");
            }}
          />
        ))}
      </div>
      <section class="venu-panel" style="margin-top: 20px">
        <div class="venu-panel-body">
          <h2>How transfers work</h2>
          <ol class="venu-help-list">
            <li>Choose tickets from Your events and enter the recipient’s name and email.</li>
            <li>The tickets stay in your account until they accept.</li>
            <li>You can cancel a transfer that is still waiting.</li>
            <li>After they accept, the tickets move to Transferred and leave your door code.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}

function TabButton({
  id,
  tab,
  setTab,
  label
}: {
  id: Tab;
  tab: Tab;
  setTab: (value: Tab) => void;
  label: string;
}) {
  return (
    <button
      class={`venu-tab${tab === id ? " is-selected" : ""}`}
      role="tab"
      aria-selected={tab === id}
      onClick={() => setTab(id)}
    >
      {label}
    </button>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div class="venu-panel venu-empty" style="margin-bottom: 12px">
      <h2>{title}</h2>
      <p class="venu-lede">{body}</p>
    </div>
  );
}

function TransferCard({
  transfer,
  onAccept,
  onDecline,
  onCancel
}: {
  transfer: Transfer;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
}) {
  const ticket = getState().tickets.find((item) => item.id === transfer.ticketId);
  const event = ticket ? getEvent(ticket.eventId) : undefined;
  const pending = transfer.status === "pending";

  return (
    <article class="venu-panel venu-ticket">
      <p class="venu-kicker" style="color: var(--oj-core-text-color-secondary)">
        {transfer.direction === "incoming" ? "From" : "To"}{" "}
        {transfer.direction === "incoming" ? transfer.senderName : transfer.recipientName}
        {" · "}
        {transfer.status}
      </p>
      <h3>{event?.name || "Tickets"}</h3>
      <p class="venu-meta">
        {event ? formatDateTime(event.start) : ""}
        {transfer.message ? ` · “${transfer.message}”` : ""}
        <br />
        Sent {formatDateTime(transfer.createdAt)}
        {transfer.resolvedAt ? ` · Closed ${formatDateTime(transfer.resolvedAt)}` : ""}
      </p>
      {pending && transfer.direction === "incoming" ? (
        <div class="venu-actions" style="margin-top: 12px">
          <oj-c-button label="Accept tickets" chroming="callToAction" onojAction={onAccept}></oj-c-button>
          <oj-c-button label="Decline" chroming="outlined" onojAction={onDecline}></oj-c-button>
        </div>
      ) : null}
      {pending && transfer.direction === "outgoing" ? (
        <div class="venu-actions" style="margin-top: 12px">
          <oj-c-button label="Cancel transfer" chroming="outlined" onojAction={onCancel}></oj-c-button>
        </div>
      ) : null}
    </article>
  );
}

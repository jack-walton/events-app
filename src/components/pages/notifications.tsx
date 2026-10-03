import { h } from "preact";
import { useEffect } from "preact/hooks";
import "oj-c/button";
import { NotificationItem } from "../../data/types";
import { formatDateTime, markNotificationsRead } from "../../data/store";
import { hrefFor, navigate } from "../../data/router";
import { PageHeader } from "../page-header";

type Props = {
  notifications: NotificationItem[];
};

export function NotificationsPage({ notifications }: Props) {
  useEffect(() => {
    markNotificationsRead();
  }, []);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Transfers, claimed tickets, and changes to tickets you sent."
      />
      {notifications.length ? (
        <div class="venu-list">
          {notifications.map((item) => (
            <article class="venu-panel venu-ticket">
              <h3>{item.title}</h3>
              <p class="venu-lede">{item.body}</p>
              <p class="venu-meta" style="margin-top: 8px">
                {formatDateTime(item.createdAt)}
              </p>
              {item.route ? (
                <p style="margin-top: 10px">
                  <a href={hrefFor(item.route)}>Open</a>
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div class="venu-panel venu-empty">
          <h2>You are caught up</h2>
          <p class="venu-lede">New transfer activity will appear here.</p>
          <oj-c-button
            label="Your events"
            chroming="outlined"
            onojAction={() => navigate({ name: "events" })}
          ></oj-c-button>
        </div>
      )}
    </div>
  );
}

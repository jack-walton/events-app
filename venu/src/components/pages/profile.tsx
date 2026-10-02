import { h } from "preact";
import "oj-c/button";
import "oj-c/switch";
import { UserProfile } from "../../data/types";
import { resetAccount, setLocationServices } from "../../data/store";
import { hrefFor, navigate } from "../../data/router";
import { GUIDE_URL, RELEASE_NOTES_URL } from "../../data/links";
import { PageHeader } from "../page-header";
import { QrMark } from "../qr";

type Props = {
  user: UserProfile;
  locationServices: boolean;
  onSignOut: () => void;
};

export function ProfilePage({ user, locationServices, onSignOut }: Props) {
  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your VENU Mobile ID, account details, and settings."
      />
      <div class="venu-detail">
        <section class="venu-panel">
          <div class="venu-panel-body">
            <p class="venu-kicker" style="color: var(--oj-core-text-color-secondary)">
              Identity at the door
            </p>
            <h2>VENU Mobile ID</h2>
            <p class="venu-lede" style="margin: 8px 0 16px">
              Show this code at the venue entrance for identity verification. Do not share it.
              Staff may also ask for a photo ID.
            </p>
            <QrMark
              value={user.mobileId}
              label={`VENU Mobile ID for ${user.firstName} ${user.lastName}`}
            />
            <p class="venu-meta" style="margin-top: 12px">
              {user.firstName} {user.lastName}
              <br />
              {user.mobileId}
            </p>
          </div>
        </section>
        <aside class="venu-list">
          <section class="venu-panel">
            <div class="venu-panel-body">
              <h2>Quick access</h2>
              <p>
                <a href={hrefFor({ name: "notifications" })}>Notifications</a>
              </p>
              <p>
                <a href={hrefFor({ name: "events" })}>Your events</a>
              </p>
            </div>
          </section>
          <section class="venu-panel">
            <div class="venu-panel-body">
              <h2>Account</h2>
              <div class="venu-settings-item">
                <div>
                  <strong>Email</strong>
                  <p class="venu-meta">{user.email}</p>
                </div>
              </div>
              <div class="venu-settings-item">
                <div>
                  <strong>Phone</strong>
                  <p class="venu-meta">{user.phone}</p>
                </div>
              </div>
              <div class="venu-settings-item">
                <div>
                  <strong>Home location</strong>
                  <p class="venu-meta">{user.location}</p>
                </div>
              </div>
              <div class="venu-settings-item">
                <div>
                  <strong>Location services</strong>
                  <p class="venu-meta">
                    Used to show events near {user.location}.
                  </p>
                </div>
                <oj-c-switch
                  value={locationServices}
                  onvalueChanged={(event: CustomEvent) =>
                    setLocationServices(Boolean(event.detail.value))
                  }
                ></oj-c-switch>
              </div>
            </div>
          </section>
          <section class="venu-panel">
            <div class="venu-panel-body">
              <h2>Help and more</h2>
              <p>
                <a href={GUIDE_URL} target="_blank" rel="noreferrer">
                  User guide
                </a>
              </p>
              <p>
                <a href={RELEASE_NOTES_URL} target="_blank" rel="noreferrer">
                  Release notes
                </a>
              </p>
              <p class="venu-lede" style="margin-top: 12px">
                Start over to restore the tickets you began with.
              </p>
              <div class="venu-actions" style="margin-top: 16px">
                <oj-c-button
                  label="Start over"
                  chroming="outlined"
                  onojAction={() => {
                    resetAccount();
                    navigate({ name: "discover" });
                  }}
                ></oj-c-button>
                <oj-c-button label="Sign out" chroming="ghost" onojAction={onSignOut}></oj-c-button>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

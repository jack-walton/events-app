import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";
import "ojs/ojtoolbar";
import "ojs/ojmenu";
import "ojs/ojbutton";
import { hrefFor, navigate } from "../data/router";
import { unreadCount } from "../data/store";
import { GUIDE_URL, RELEASE_NOTES_URL } from "../data/links";
import { UserProfile } from "../data/types";

type Props = {
  user: UserProfile;
  onSignOut: () => void;
};

export function Header({ user, onSignOut }: Props) {
  const mediaQueryRef = useRef<MediaQueryList>(
    window.matchMedia(ResponsiveUtils.getFrameworkQuery("sm-only")!)
  );
  const [isSmallWidth, setIsSmallWidth] = useState(mediaQueryRef.current.matches);
  const unread = unreadCount();

  useEffect(() => {
    const media = mediaQueryRef.current;
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsSmallWidth(event.matches);
    };
    media.addEventListener("change", handleMediaQueryChange);
    return () => media.removeEventListener("change", handleMediaQueryChange);
  }, []);

  return (
    <header role="banner" class="oj-web-applayout-header venu-header">
      <div class="oj-web-applayout-max-width oj-flex-bar oj-sm-align-items-center venu-header-inner">
        <div class="oj-flex-bar-start oj-sm-align-items-center">
          <a href={hrefFor({ name: "discover" })} class="venu-product">
            <span class="venu-product-name">VENU</span>
          </a>
        </div>
        <div class="oj-flex-bar-end oj-sm-align-items-center">
          <oj-toolbar>
            <span class="venu-notify">
              <oj-button
                id="notifyBtn"
                display="icons"
                chroming="borderless"
                title={unread ? `Notifications (${unread} unread)` : "Notifications"}
                onojAction={() => navigate({ name: "notifications" })}
              >
                <span slot="startIcon" class="oj-ux-ico-notification"></span>
                Notifications{unread ? ` (${unread} unread)` : ""}
              </oj-button>
              {unread ? (
                <span class="venu-notify-badge" aria-hidden="true">
                  {unread}
                </span>
              ) : null}
            </span>
            <oj-menu-button
              id="userMenu"
              display={isSmallWidth ? "icons" : "all"}
              chroming="borderless"
            >
              <span class="venu-userchip">
                {user.firstName} {user.lastName}
              </span>
              <span
                slot="endIcon"
                class={
                  isSmallWidth
                    ? "oj-icon venu-avatar"
                    : "oj-component-icon oj-button-menu-dropdown-icon"
                }
              ></span>
              <oj-menu
                id="menu1"
                slot="menu"
                onojMenuAction={(event) => {
                  const value = event.detail.selectedValue;
                  if (value === "profile") navigate({ name: "profile" });
                  if (value === "guide") window.open(GUIDE_URL, "_blank", "noopener");
                  if (value === "notes") window.open(RELEASE_NOTES_URL, "_blank", "noopener");
                  if (value === "out") onSignOut();
                }}
              >
                <oj-option id="profile" value="profile">
                  Profile
                </oj-option>
                <oj-option id="guide" value="guide">
                  User guide
                </oj-option>
                <oj-option id="notes" value="notes">
                  Release notes
                </oj-option>
                <oj-option id="out" value="out">
                  Sign out
                </oj-option>
              </oj-menu>
            </oj-menu-button>
          </oj-toolbar>
        </div>
      </div>
    </header>
  );
}

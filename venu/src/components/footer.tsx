import { h } from "preact";
import { CASE_STUDY_URL, GUIDE_URL, RELEASE_NOTES_URL, SOCIAL_LINKS } from "../data/links";

const links = [
  { name: "User guide", href: GUIDE_URL },
  { name: "Release notes", href: RELEASE_NOTES_URL },
  { name: "Case study", href: CASE_STUDY_URL },
  ...SOCIAL_LINKS
];

export function Footer() {
  return (
    <footer class="oj-web-applayout-footer venu-footer" role="contentinfo">
      <div class="oj-web-applayout-footer-item oj-web-applayout-max-width">
        <ul>
          {links.map((item) => (
            <li>
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

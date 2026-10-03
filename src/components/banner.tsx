import { ComponentChildren, h } from "preact";

type Props = {
  title: string;
  body?: string;
  tone?: "info" | "confirmation" | "warning";
  children?: ComponentChildren;
};

export function Banner({ title, body, tone = "info", children }: Props) {
  return (
    <div class={`venu-banner is-${tone}`} role="status">
      <div>
        <h2>{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
      {children}
    </div>
  );
}

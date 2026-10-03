import { ComponentChildren, h } from "preact";

type Props = {
  title: string;
  description?: string;
  children?: ComponentChildren;
};

export function PageHeader({ title, description, children }: Props) {
  return (
    <div class="venu-pagehead">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {children ? <div class="venu-actions">{children}</div> : null}
    </div>
  );
}

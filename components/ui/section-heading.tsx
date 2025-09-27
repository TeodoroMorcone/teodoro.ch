import type {ReactNode} from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  id?: string;
};

export function SectionHeading({eyebrow, title, description, id}: SectionHeadingProps) {
  return (
    <header className="flex flex-col gap-3" id={id}>
      {eyebrow ? (
        <span className="inline-flex w-fit items-center rounded-full bg-accent/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary dark:bg-accent/50">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-2xl font-semibold leading-tight text-primary lg:text-3xl dark:text-surface">{title}</h2>
      {description ? (
        <div className="max-w-3xl text-secondary dark:text-surface/75">{description}</div>
      ) : null}
    </header>
  );
}
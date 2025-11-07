import type {ReactNode} from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  id?: string;
};

export function SectionHeading({eyebrow, title, description, id}: SectionHeadingProps) {
  return (
    <header className="flex flex-col gap-3 rounded-3xl border border-secondary/30 bg-secondary/20 p-6 text-accent-foreground shadow-[0_22px_55px_-45px_rgba(0,133,133,0.55)] backdrop-blur-sm dark:border-primary/40 dark:bg-primary/60" id={id}>
      {eyebrow ? (
        <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent-foreground shadow-sm shadow-accent/40">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-2xl font-semibold leading-tight text-accent-foreground drop-shadow-sm lg:text-3xl">{title}</h2>
      {description ? (
        <div className="max-w-3xl text-sm text-accent-foreground/85">{description}</div>
      ) : null}
    </header>
  );
}
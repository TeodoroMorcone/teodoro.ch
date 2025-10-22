import {ZOOM_LINKS, type ZoomLink} from "@/config/zoom";
import {cn} from "@/lib/utils/cn";

import {CTAButton} from "@/components/ui/cta-button";

export type ZoomLaunchLabels = {
  consultation: string;
  lesson: string;
  fallback: string;
  helper: string;
  passcode: string;
};

type ZoomQuickLaunchProps = {
  labels: ZoomLaunchLabels;
  helperText?: string | undefined;
  includeLesson?: boolean;
  variant?: "inline" | "card";
  className?: string;
};

const buildAriaLabel = (label: string, requiresPasscode: boolean, passcode: string) =>
  requiresPasscode ? `${label} (${passcode})` : label;

const renderActionRow = (action: "consultation" | "lesson", labels: ZoomLaunchLabels, link: ZoomLink) => {
  const hasPrimary = Boolean(link.deepLink);
  const hasFallback = Boolean(link.fallback);

  if (!hasPrimary && !hasFallback) {
    return null;
  }

  const actionLabel = labels[action];
  const fallbackLabel = `${labels.fallback} – ${actionLabel}`;

  return (
    <div className="flex flex-wrap gap-3">
      {hasPrimary ? (
        <CTAButton
          href={link.deepLink!}
          aria-label={buildAriaLabel(actionLabel, link.requiresPasscode, labels.passcode)}
        >
          {actionLabel}
        </CTAButton>
      ) : null}
      {hasFallback ? (
        <CTAButton
          href={link.fallback!}
          aria-label={buildAriaLabel(fallbackLabel, link.requiresPasscode, labels.passcode)}
          variant="secondary"
          className="border-secondary text-secondary hover:border-accent hover:text-accent dark:text-surface"
        >
          {labels.fallback}
        </CTAButton>
      ) : null}
    </div>
  );
};

export function ZoomQuickLaunch({
  labels,
  helperText,
  includeLesson = true,
  variant = "card",
  className,
}: ZoomQuickLaunchProps) {
  const consultationLink = ZOOM_LINKS.consultation;
  const lessonLink = ZOOM_LINKS.lesson;

  const hasConsultation = Boolean(consultationLink.deepLink || consultationLink.fallback);
  const hasLesson = includeLesson && Boolean(lessonLink.deepLink || lessonLink.fallback);

  if (!hasConsultation && !hasLesson) {
    return null;
  }

  const note = helperText ?? labels.helper;

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {hasConsultation ? renderActionRow("consultation", labels, consultationLink) : null}
        {hasLesson ? renderActionRow("lesson", labels, lessonLink) : null}
        <span className="text-xs text-secondary dark:text-surface/70">{note}</span>
      </div>
    );
  }

  const badgeLabel = hasConsultation ? labels.consultation : labels.lesson;

  return (
    <div
      className={cn(
        "rounded-3xl border border-secondary/20 bg-surface p-6 shadow-sm dark:border-surface/20 dark:bg-primary/40",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:bg-primary dark:text-surface">
          {badgeLabel}
        </span>
        <span className="text-xs text-secondary dark:text-surface/70">{note}</span>
      </div>
      <div className="mt-4 flex flex-col gap-6">
        {hasConsultation ? renderActionRow("consultation", labels, consultationLink) : null}
        {hasLesson ? renderActionRow("lesson", labels, lessonLink) : null}
      </div>
    </div>
  );
}
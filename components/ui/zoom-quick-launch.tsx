import {ZOOM_LINKS} from "@/config/zoom";
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

const renderActionRow = (
  action: "consultation" | "lesson",
  labels: ZoomLaunchLabels,
  requirePasscode: boolean,
) => {
  const actionLabel = labels[action];
  const fallbackLabel = `${labels.fallback} – ${actionLabel}`;

  return (
    <div className="flex flex-wrap gap-3">
      <CTAButton
        href={ZOOM_LINKS[action].deepLink}
        aria-label={buildAriaLabel(actionLabel, requirePasscode, labels.passcode)}
      >
        {actionLabel}
      </CTAButton>
      <CTAButton
        href={ZOOM_LINKS[action].fallback}
        aria-label={buildAriaLabel(fallbackLabel, requirePasscode, labels.passcode)}
        variant="secondary"
        className="border-secondary text-secondary hover:border-accent hover:text-accent dark:text-surface"
      >
        {labels.fallback}
      </CTAButton>
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
  const consultationRequiresPasscode = ZOOM_LINKS.consultation.requiresPasscode;
  const lessonRequiresPasscode = ZOOM_LINKS.lesson.requiresPasscode;
  const note = helperText ?? labels.helper;

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {renderActionRow("consultation", labels, consultationRequiresPasscode)}
        <span className="text-xs text-secondary dark:text-surface/70">{note}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-3xl border border-secondary/20 bg-surface p-6 shadow-sm dark:border-surface/20 dark:bg-primary/40",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary dark:bg-primary dark:text-surface">
          {labels.consultation}
        </span>
        <span className="text-xs text-secondary dark:text-surface/70">{note}</span>
      </div>
      <div className="mt-4 flex flex-col gap-6">
        {renderActionRow("consultation", labels, consultationRequiresPasscode)}
        {includeLesson ? renderActionRow("lesson", labels, lessonRequiresPasscode) : null}
      </div>
    </div>
  );
}
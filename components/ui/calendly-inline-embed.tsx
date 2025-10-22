"use client";

import {useCallback, useState} from "react";
import {CalendarDays} from "lucide-react";

import {cn} from "@/lib/utils/cn";

const DEFAULT_EMBED_DOMAIN = "teodoro.ch";
const BASE_SHELL_CLASSES =
  "rounded-3xl border border-secondary/20 bg-surface shadow-sm dark:border-surface/30 dark:bg-primary/30";

type CalendlyInlineEmbedProps = {
  eventUrl: string;
  buttonLabel: string;
  loadingLabel: string;
  title: string;
  className?: string;
  iframeClassName?: string;
  height?: number;
};

export function CalendlyInlineEmbed({
  eventUrl,
  buttonLabel,
  loadingLabel,
  title,
  className,
  iframeClassName,
  placeholderLabel,
  height = 700,
}: CalendlyInlineEmbedProps) {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleActivate = useCallback(() => {
    if (iframeUrl) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const host = window.location.hostname || DEFAULT_EMBED_DOMAIN;
    const url = new URL(eventUrl);

    url.searchParams.set("embed_domain", host);
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("hide_event_type_details", "1");
    url.searchParams.set("hide_gdpr_banner", "1");

    setIsLoaded(false);
    setIframeUrl(url.toString());
  }, [eventUrl, iframeUrl]);

  const statusMessage =
    iframeUrl && !isLoaded ? loadingLabel : iframeUrl ? `${title} ready` : "";

  return (
    <div className={className}>
      {iframeUrl ? (
        <div
          className={cn(BASE_SHELL_CLASSES, "relative overflow-hidden")}
          style={{minHeight: height}}
        >
          <iframe
            src={iframeUrl}
            title={title}
            className={cn("h-full w-full border-0", iframeClassName)}
            loading="lazy"
            style={{minHeight: height}}
            onLoad={() => setIsLoaded(true)}
          />
          {!isLoaded ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-surface/85 text-sm text-secondary backdrop-blur-sm dark:bg-primary/60 dark:text-surface/80">
              {loadingLabel}
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className={cn(
            BASE_SHELL_CLASSES,
            "flex flex-col items-center justify-center gap-6 p-10 text-center",
          )}
          style={{minHeight: height}}
        >
          <CalendarDays
            aria-hidden="true"
            className="h-24 w-24 text-primary/80 transition-colors duration-200 dark:text-surface/80"
          />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-surface transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-accent hover:text-primary"
            onClick={handleActivate}
          >
            {buttonLabel}
          </button>
        </div>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}
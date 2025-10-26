"use client";

import {useState} from "react";
import type {ComponentPropsWithoutRef} from "react";
import {CalendarDays} from "lucide-react";

import {cn} from "@/lib/utils/cn";

export const DEFAULT_CALENDESK_EMBED_URL = "https://lhctbmf6wa.calendesk.net/";
const DEFAULT_DESKTOP_HEIGHT = 900;
const DEFAULT_MOBILE_HEIGHT = 1440;
const FRAME_WRAPPER_BASE_CLASSES =
  "rounded-3xl border border-secondary/20 bg-surface shadow-sm dark:border-surface/30 dark:bg-primary/30";

export type CalendeskEmbedProps = {
  title: string;
  activationLabel?: string;
  loadingLabel?: string;
  src?: string;
  desktopHeight?: number;
  mobileHeight?: number;
  className?: string;
  iframeClassName?: string;
  scrolling?: "auto" | "yes" | "no";
} & Omit<ComponentPropsWithoutRef<"iframe">, "title" | "src" | "className" | "ref">;

export function CalendeskEmbed({
  title,
  activationLabel = "Load booking calendar",
  loadingLabel = "Calendesk availability is loading…",
  src = DEFAULT_CALENDESK_EMBED_URL,
  desktopHeight = DEFAULT_DESKTOP_HEIGHT,
  mobileHeight = DEFAULT_MOBILE_HEIGHT,
  className,
  iframeClassName,
  scrolling = "yes",
  ...iframeProps
}: CalendeskEmbedProps) {
  const [isActivated, setIsActivated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const statusMessage = !isActivated ? "" : isLoaded ? `${title} ready` : loadingLabel;

  return (
    <div className={cn("w-full", className)}>
      {isActivated ? (
        <div className={cn(FRAME_WRAPPER_BASE_CLASSES, "calendesk-shell relative overflow-hidden")}>
          <iframe
            title={title}
            src={src}
            className={cn("calendesk-frame bg-surface", iframeClassName)}
            scrolling={scrolling}
            frameBorder="0"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            {...iframeProps}
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
            FRAME_WRAPPER_BASE_CLASSES,
            "calendesk-shell flex flex-col items-center justify-center gap-6 text-center",
          )}
        >
          <CalendarDays
            aria-hidden="true"
            className="h-28 w-28 text-primary/80 transition-colors duration-200 dark:text-surface/80"
          />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-4 text-sm font-semibold text-surface transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent hover:bg-accent hover:text-primary"
            onClick={() => {
              if (isActivated) {
                return;
              }
              setIsActivated(true);
              setIsLoaded(false);
            }}
          >
            {activationLabel}
          </button>
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </p>

      <style jsx>{`
        .calendesk-shell {
          min-height: ${desktopHeight}px;
        }

        .calendesk-frame {
          width: 100%;
          display: block;
          border: none;
          max-width: 1280px;
          margin: 0 auto;
        }

        @media (max-width: 600px) {
          .calendesk-shell {
            min-height: ${mobileHeight}px;
          }

          .calendesk-frame {
            height: ${mobileHeight}px;
          }
        }

        @media (min-width: 600px) {
          .calendesk-frame {
            height: ${desktopHeight}px;
          }
        }
      `}</style>
    </div>
  );
}
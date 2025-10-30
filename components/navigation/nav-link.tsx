"use client";

import Link from "next/link";
import {useCallback, type MouseEvent as ReactMouseEvent} from "react";

import {cn} from "@/lib/utils/cn";

import {useActiveSection} from "./active-section-provider";

type NavLinkProps = {
  href: string;
  label: string;
  targetId?: string;
  onNavigate?: () => void;
  emoji?: string;
};

export function NavLink({href, label, targetId, onNavigate, emoji}: NavLinkProps) {
  const {activeId} = useActiveSection();
  const isActive = targetId ? activeId === targetId : false;

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      if (href.startsWith("#") && targetId) {
        const element = document.getElementById(targetId);

        if (element) {
          event.preventDefault();
          const topOffset = 96;
          const elementTop = element.getBoundingClientRect().top + window.scrollY;
          const offsetTop = elementTop - topOffset;

          window.scrollTo({top: offsetTop, behavior: "smooth"});
          window.history.replaceState(null, "", href);
        }
      }

      onNavigate?.();
    },
    [href, onNavigate, targetId],
  );

  return (
    <li>
      <Link
        href={href}
        scroll={false}
        onClick={handleClick}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center justify-between rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          isActive
            ? "bg-primary text-surface shadow-sidebar"
            : "text-primary hover:bg-accent/20 hover:text-primary dark:text-surface dark:hover:bg-accent/30",
        )}
        prefetch={false}
      >
        <span>{label}</span>
        {emoji ? (
          <span
            aria-hidden="true"
            className={cn(
              "ml-3 text-lg leading-none transition-transform duration-200 ease-soft-sine",
              isActive ? "scale-110 opacity-100" : "opacity-60",
            )}
          >
            {emoji}
          </span>
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "ml-3 h-2 w-2 rounded-full transition-colors duration-200 ease-soft-sine",
              isActive ? "bg-surface" : "bg-secondary/30 dark:bg-surface/40",
            )}
          />
        )}
      </Link>
    </li>
  );
}
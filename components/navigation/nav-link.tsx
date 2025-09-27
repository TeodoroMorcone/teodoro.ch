"use client";

import Link from "next/link";
import {useCallback} from "react";

import {cn} from "@/lib/utils/cn";

import {useActiveSection} from "./active-section-provider";

type NavLinkProps = {
  href: `#${string}` | string;
  label: string;
  targetId: string;
  onNavigate?: () => void;
};

export function NavLink({href, label, targetId, onNavigate}: NavLinkProps) {
  const {activeId} = useActiveSection();
  const isActive = activeId === targetId;

  const handleClick = useCallback(() => {
    onNavigate?.();
  }, [onNavigate]);

  return (
    <li>
      <Link
        href={href}
        scroll
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
        <span
          aria-hidden="true"
          className={cn(
            "ml-3 h-2 w-2 rounded-full transition-colors duration-200 ease-soft-sine",
            isActive ? "bg-surface" : "bg-secondary/30 dark:bg-surface/40",
          )}
        />
      </Link>
    </li>
  );
}
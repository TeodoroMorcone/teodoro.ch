import Link from "next/link";
import type {ComponentPropsWithoutRef, ReactNode} from "react";

import {cn} from "@/lib/utils/cn";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

export function CTAButton({href, children, variant = "primary", className, ...rest}: CTAButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const variantClasses =
    variant === "primary"
      ? "bg-primary text-surface hover:bg-accent hover:text-primary"
      : "border border-secondary text-primary hover:border-accent hover:text-accent dark:text-surface";

  return (
    <Link href={href} className={cn(baseClasses, variantClasses, className)} {...rest}>
      {children}
    </Link>
  );
}
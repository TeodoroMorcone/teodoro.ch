import Link from "next/link";
import {useId, type ComponentPropsWithoutRef, type ReactNode} from "react";

import {cn} from "@/lib/utils/cn";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "whatsapp";
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

const WHATSAPP_CIRCLE_TEXT = `${Array(6).fill("Whatsapp Teodoro now").join(" • ")} •`;

export function CTAButton({href, children, variant = "primary", className, ...rest}: CTAButtonProps) {
  const isWhatsapp = variant === "whatsapp";
  const whatsappPathId = useId();

  const baseClasses =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const variantClasses = isWhatsapp
    ? "relative isolate overflow-visible bg-[#25D366] text-white hover:bg-[#1ebe57]"
    : variant === "primary"
      ? "bg-primary text-surface hover:bg-accent hover:text-primary"
      : "border border-secondary text-primary hover:border-accent hover:text-accent dark:text-surface";

  return (
    <Link href={href} className={cn(baseClasses, variantClasses, className)} {...rest}>
      {isWhatsapp ? (
        <>
          <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[calc(100%+3.5rem)] w-[calc(100%+3.5rem)] -translate-x-1/2 -translate-y-1/2 text-white/70"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            <defs>
              <path id={whatsappPathId} d="M100 10a90 90 0 1 1 0 180a90 90 0 1 1 0-180" />
            </defs>
            <text className="fill-current text-[12px] font-semibold uppercase tracking-[0.35em]">
              <textPath xlinkHref={`#${whatsappPathId}`} startOffset="0%">
                {WHATSAPP_CIRCLE_TEXT}
              </textPath>
            </text>
          </svg>
        </>
      ) : (
        children
      )}
    </Link>
  );
}
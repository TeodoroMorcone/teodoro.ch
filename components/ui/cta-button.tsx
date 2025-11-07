import Link from "next/link";
import type {ComponentPropsWithoutRef, ReactNode} from "react";

import {cn} from "@/lib/utils/cn";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "whatsapp" | "outlineLight";
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

export function CTAButton({href, children, variant = "primary", className, ...rest}: CTAButtonProps) {
  const isWhatsapp = variant === "whatsapp";
  const isOutline = isWhatsapp || variant === "outlineLight";

  const baseClasses = cn(
    "inline-flex w-full max-w-[22rem] items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ease-soft-sine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    isOutline ? "px-6 py-2.5 sm:px-7 sm:py-3" : "px-6 py-3 sm:px-8 sm:py-3",
    className
  );

  const paletteClasses = isOutline
    ? "border border-accent-foreground/65 bg-transparent text-accent-foreground hover:bg-accent-foreground/10"
    : variant === "primary"
      ? "bg-primary text-accent-foreground hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
      : variant === "secondary"
        ? "border border-secondary/35 bg-surface text-primary hover:border-accent hover:bg-accent-muted hover:text-primary focus-visible:border-accent focus-visible:bg-accent-muted focus-visible:text-primary"
        : "border border-secondary/40 bg-surface/90 text-primary hover:border-accent hover:bg-accent-muted/80 hover:text-primary focus-visible:border-accent focus-visible:bg-accent-muted/80 focus-visible:text-primary";

  const outlineContent = (
      <span
        className="flex w-full items-center justify-center gap-3 leading-tight"
        style={{height: "1rem"}}
      >
      {isWhatsapp ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          role="img"
          aria-hidden="true"
          className="h-9 w-9 sm:h-10 sm:w-10"
          style={{transform: "scale(2)", transformOrigin: "center"}}
        >
          <g transform="translate(60 60)">
            <g transform="translate(-16 -16)">
              <path
                d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
                fill="#FFFFFF"
              />
              <path
                d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 10.4576 4.15385 17C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
                fill="#1ebe57"
              />
              <path
                d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
                fill="#FFFFFF"
              />
            </g>
          </g>
        </svg>
      ) : null}
      <span className="leading-tight">{children}</span>
    </span>
  );

  return (
    <Link href={href} className={cn(baseClasses, paletteClasses)} {...rest}>
      {isOutline ? outlineContent : children}
    </Link>
  );
}
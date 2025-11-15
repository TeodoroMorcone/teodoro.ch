'use client';

import Link from "next/link";
import {useEffect, useState} from "react";

type FloatingContact = {
  href: string;
  label: string;
  ariaLabel: string;
};

type FloatingActionsProps = {
  calendeskContact: FloatingContact;
  whatsappContact: FloatingContact;
};

const HERO_SECTION_ID = "hero";

export function FloatingActions({calendeskContact, whatsappContact}: FloatingActionsProps) {
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsHeroVisible(false);
      return;
    }

    const heroElement = document.getElementById(HERO_SECTION_ID);

    if (!heroElement) {
      setIsHeroVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry) {
          setIsHeroVisible(entry.isIntersecting);
        }
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(heroElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  const visibilityClass = isHeroVisible
    ? "pointer-events-none opacity-0 scale-90 translate-y-6"
    : "pointer-events-auto opacity-100 scale-100 translate-y-0";

  return (
    <>
      <div
        id="floating-calendesk"
        className={`fixed bottom-6 left-5 z-50 sm:bottom-8 sm:left-8 lg:left-[calc(20rem+2rem)] transform-gpu transition-all duration-500 ease-soft-sine ${visibilityClass}`}
        style={{transitionDelay: isHeroVisible ? "0ms" : "120ms"}}
      >
        <Link
          id="floating-calendesk-link"
          href={calendeskContact.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={calendeskContact.ariaLabel}
          className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-primary text-surface shadow-lg transition duration-200 ease-soft-sine hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-surface dark:text-primary md:h-[112px] md:w-[112px]"
        >
          <span className="sr-only">{calendeskContact.label}</span>
          <span aria-hidden="true" className="transform scale-[3] leading-none">
            🗓️
          </span>
        </Link>
      </div>

      <div
        id="floating-whatsapp"
        className={`fixed bottom-6 right-5 z-50 sm:bottom-8 sm:right-8 transform-gpu transition-all duration-500 ease-soft-sine ${visibilityClass}`}
        style={{transitionDelay: isHeroVisible ? "0ms" : "220ms"}}
      >
        <Link
          id="floating-whatsapp-link"
          href={whatsappContact.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsappContact.ariaLabel}
          className="relative flex h-[104px] w-[104px] items-center justify-center rounded-full !bg-[#FFF1D6] text-[#25D366] shadow-lg transition duration-200 ease-soft-sine hover:scale-105 hover:!bg-[#FFF1D6] focus:!bg-[#FFF1D6] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 md:h-[112px] md:w-[112px]"
        >
          <span className="sr-only">{whatsappContact.label}</span>
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none text-[#25D366]/70"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <defs>
              <path id="whatsapp-teodoro-arc" d="M60 12a48 48 0 1 1 0 96a48 48 0 1 1 0-96" />
            </defs>
            <text
              className="text-[12px] uppercase tracking-[0.22em] md:text-[13px] animate-counter-spin"
              fill="#000000"
              stroke="#000000"
              strokeWidth="0.6"
            >
              <textPath id="innerTextWhatsapp" href="#whatsapp-teodoro-arc" startOffset="0%">
                Whatsapp your tutor Teodoro • •
              </textPath>
            </text>
          </svg>
          <span
            aria-hidden="true"
            className="pointer-events-none relative z-10 flex h-12 w-12 items-center justify-center md:h-14 md:w-14"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
                fill="#BFC8D0"
              />
              <path
                d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4.296 18.5589 4.296 16C4.296 9.37258 9.66858 4 16.296 4C22.9234 4 28 9.37258 28 16Z"
                fill="url(#paint0_linear_87_7264)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
                fill="#FFFFFF"
              />
              <path
                d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
                fill="#FFFFFF"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_87_7264"
                  x1="26.5"
                  y1="7"
                  x2="4"
                  y2="28"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5BD066" />
                  <stop offset="1" stopColor="#27B43E" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </Link>
      </div>
    </>
  );
}
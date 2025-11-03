import {Suspense, type ReactNode} from "react";
import {notFound} from "next/navigation";
import Link from "next/link";
import {NextIntlClientProvider} from "next-intl";
import {getTranslations, unstable_setRequestLocale} from "next-intl/server";
import "@/app/globals.css";

import {CookieBanner} from "@/components/consent/cookie-banner";
import {ConsentPreferences} from "@/components/consent/consent-preferences";
import {ActiveSectionProvider} from "@/components/navigation/active-section-provider";
import {LanguageSwitcher} from "@/components/navigation/language-switcher";
import {ThemeToggle} from "@/components/navigation/theme-toggle";
import {MobileNav} from "@/components/layout/mobile-nav";
import {Sidebar} from "@/components/layout/sidebar";
import {NAV_EMOJIS, SECTION_LINKS} from "@/config/navigation";
import {getMessages} from "@/lib/i18n/get-messages";
import {LOCALES, type Locale, isLocale} from "@/lib/i18n/locales";

type LocaleLayoutProps = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
  const localeParam = params.locale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  unstable_setRequestLocale(locale);

  const messages = await getMessages(locale);
  const tCommon = await getTranslations({locale, namespace: "common"});

  const filteredSectionLinks = SECTION_LINKS.filter((link) => link.id !== "glossary");

  const navItems = filteredSectionLinks.map((link) => ({
    id: link.id,
    href: link.href,
    label: tCommon(`nav.${link.navKey}`),
    targetId: link.targetId,
    emoji: NAV_EMOJIS[link.navKey],
  }));

  console.log("[LocaleLayout] nav item configuration", {
    totalItems: navItems.length,
    navKeys: navItems.map((item) => item.id),
  });


  const ctas = {
    primary: {
      label: tCommon("cta.primary"),
      href: SECTION_LINKS.find((link) => link.id === "contact")?.href ?? "#contact",
    },
    secondary: {
      label: tCommon("cta.secondary"),
      href: SECTION_LINKS.find((link) => link.id === "services")?.href ?? "#services",
    },
  };

  const whatsappContact = {
    href: "https://wa.me/41762440259",
    label: tCommon("cta.whatsapp"),
    ariaLabel: tCommon("cta.whatsappAria"),
  };

  const sidebarLabels = {
    navigation: tCommon("accessibility.navigationTitle"),
    home: tCommon("accessibility.homeLink"),
    language: tCommon("localeSwitcher.label"),
    theme: tCommon("themeToggle.label"),
    cookies: tCommon("footer.cookies"),
    cookiesAction: tCommon("footer.cookiesAction"),
  };

  const mobileLabels = {
    navigation: tCommon("accessibility.navigationTitle"),
    home: tCommon("accessibility.homeLink"),
    open: tCommon("accessibility.openNavigation"),
    close: tCommon("accessibility.closeNavigation"),
    language: tCommon("localeSwitcher.label"),
    theme: tCommon("themeToggle.label"),
    cookies: tCommon("footer.cookies"),
  };

  const activeLocaleName = tCommon(`localeNames.${locale}`);
  const themeSystemLabel = tCommon("themeToggle.system");
  const sectionIds = SECTION_LINKS.map((link) => link.targetId);
  const skipToContent = tCommon("accessibility.skipToContent");

  const sidebarLanguageSwitcher = (
    <Suspense fallback={null}>
      <LanguageSwitcher currentLocale={locale} label={sidebarLabels.language} />
    </Suspense>
  );
  const mobileLanguageSwitcher = (
    <Suspense fallback={null}>
      <LanguageSwitcher currentLocale={locale} label={mobileLabels.language} />
    </Suspense>
  );
  const sidebarThemeToggle = <ThemeToggle label={sidebarLabels.theme} />;
  const mobileThemeToggle = <ThemeToggle label={mobileLabels.theme} />;

  console.log("[LocaleLayout] render diagnostics", {
    locale,
    navItemsCount: navItems.length,
    hasWhatsappHref: Boolean(whatsappContact.href),
  });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <a
        href="#main-content"
        className="sr-only absolute left-6 top-4 z-50 inline-flex -translate-y-full items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-surface outline-none transition-transform duration-200 focus-visible:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {skipToContent}
      </a>
      <ActiveSectionProvider sectionIds={sectionIds} topOffset={144}>
        <div className="relative flex min-h-screen min-h-dvh flex-col bg-surface text-primary dark:bg-primary dark:text-surface lg:flex-row">
          <Sidebar
            locale={locale}
            navItems={navItems}
            ctas={ctas}
            labels={sidebarLabels}
            activeLocaleName={activeLocaleName}
            themeSystemLabel={themeSystemLabel}
            languageSwitcher={sidebarLanguageSwitcher}
            themeToggle={sidebarThemeToggle}
          />
          <div className="flex min-h-screen flex-1 flex-col">
            <MobileNav
              locale={locale}
              navItems={navItems}
              ctas={ctas}
              labels={mobileLabels}
              activeLocaleName={activeLocaleName}
              themeSystemLabel={themeSystemLabel}
              languageSwitcher={mobileLanguageSwitcher}
              themeToggle={mobileThemeToggle}
            />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </ActiveSectionProvider>
      <div className="fixed bottom-6 right-5 z-50 sm:bottom-8 sm:right-8">
        <Link
          href={whatsappContact.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={whatsappContact.ariaLabel}
          className="relative flex h-[104px] w-[104px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition duration-200 ease-soft-sine hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 md:h-[112px] md:w-[112px]"
        >
          <span className="sr-only">Whatsapp Teodoro</span>
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none text-white/70"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <defs>
              <path
                id="whatsapp-teodoro-arc"
                d="M60 12a48 48 0 1 1 0 96a48 48 0 1 1 0-96"
              />
            </defs>
            <text
              className="text-[12px] uppercase tracking-[0.22em] md:text-[13px] animate-counter-spin"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            >
              <textPath href="#whatsapp-teodoro-arc" startOffset="0%">
                 Whatsapp your tutor Teodoro •
              </textPath>
            </text>
          </svg>
          <span
            aria-hidden="true"
            className="pointer-events-none relative z-10 flex h-12 w-12 items-center justify-center md:h-14 md:w-14"
          >
            <svg
              aria-hidden="true"
              fill="#ffffff"
              viewBox="0 0 32 32"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#ffffff"
              className="h-full w-full"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <title>whatsapp</title>
                <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
              </g>
            </svg>
          </span>
        </Link>
      </div>
      <CookieBanner />
      <ConsentPreferences />
    </NextIntlClientProvider>
  );
}
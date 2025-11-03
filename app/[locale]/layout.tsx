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
          className="relative flex h-[104px] w-[104px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition duration-200 ease-soft-sine hover:scale-105 hover:bg-[#1ebe5b] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 md:h-[112px] md:w-[112px]"
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
            <text className="fill-current text-[12px] uppercase tracking-[0.22em] md:text-[13px] animate-counter-spin">
              <textPath href="#whatsapp-teodoro-arc" startOffset="0%">
                Whatsapp your tutor Teodoro! 
              </textPath>
            </text>
          </svg>
          <span
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <span className="relative z-10 flex h-12 w-12 items-center justify-center md:h-14 md:w-14">
              <svg
                aria-hidden="true"
                className="h-9 w-9 md:h-10 md:w-10"
                viewBox="0 0 32 32"
                fill="currentColor"
              >
                <path d="M16 2C8.832 2 3 7.832 3 15c0 2.663.803 5.129 2.219 7.196L4 30l7.993-2.1A12.87 12.87 0 0 0 16 28c7.168 0 13-5.832 13-13S23.168 2 16 2zm.008 23.602a11.3 11.3 0 0 1-5.754-1.56l-.413-.245-4.747 1.248 1.27-4.63-.27-.425A11.26 11.26 0 0 1 4.7 15C4.7 8.863 9.871 3.7 16 3.7c6.139 0 11.3 5.163 11.3 11.3 0 6.139-5.161 11.302-11.292 11.302zm6.182-8.478c-.339-.17-2.006-.988-2.316-1.101-.311-.113-.537-.17-.763.17-.226.339-.876 1.101-1.074 1.33-.198.226-.396.255-.735.085-.339-.17-1.43-.525-2.725-1.675-1.007-.898-1.685-2.007-1.883-2.346-.198-.339-.021-.522.15-.692.153-.152.339-.396.509-.595.17-.198.226-.339.339-.567.113-.226.057-.425-.028-.595-.085-.17-.763-1.854-1.046-2.543-.276-.664-.557-.573-.763-.582-.197-.008-.425-.01-.654-.01-.226 0-.595.085-.907.425-.311.339-1.191 1.162-1.191 2.833s1.219 3.287 1.387 3.512c.17.226 2.399 3.663 5.815 5.135.812.35 1.445.558 1.939.715.813.259 1.553.223 2.141.135.653-.098 2.006-.819 2.289-1.609.283-.79.283-1.468.198-1.609-.085-.141-.311-.226-.65-.396z" />
              </svg>
            </span>
          </span>
        </Link>
      </div>
      <CookieBanner />
      <ConsentPreferences />
    </NextIntlClientProvider>
  );
}
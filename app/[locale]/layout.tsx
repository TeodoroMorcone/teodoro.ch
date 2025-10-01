import type {ReactNode} from "react";
import {notFound} from "next/navigation";
import {NextIntlClientProvider} from "next-intl";
import {getTranslations, unstable_setRequestLocale} from "next-intl/server";
import "@/app/globals.css";

import {ActiveSectionProvider} from "@/components/navigation/active-section-provider";
import {LanguageSwitcher} from "@/components/navigation/language-switcher";
import {ThemeToggle} from "@/components/navigation/theme-toggle";
import {MobileNav} from "@/components/layout/mobile-nav";
import {Sidebar} from "@/components/layout/sidebar";
import {AppProviders} from "@/components/providers/app-providers";
import {SECTION_LINKS, LEGAL_LINK} from "@/config/navigation";
import {ZOOM_LINKS} from "@/config/zoom";
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

  const navItems = SECTION_LINKS.map((link) => ({
    id: link.id,
    href: link.href,
    label: tCommon(`nav.${link.navKey}`),
    targetId: link.targetId,
  }));

  const legalLink = {
    label: tCommon("nav.legal"),
    href: LEGAL_LINK.href(locale),
  };

  const privacyLink = {
    label: tCommon("footer.privacy"),
    href: `/${locale}/legal/privacy`,
  };

  const ctas = {
    primary: {
      label: tCommon("cta.primary"),
      href: SECTION_LINKS.find((link) => link.id === "contact")?.href ?? "#contact",
    },
    secondary: {
      label: tCommon("cta.secondary"),
      href: SECTION_LINKS.find((link) => link.id === "services")?.href ?? "#services",
    },
    tertiary: {
      label: tCommon("cta.tertiary"),
      helper: tCommon("cta.tertiaryHelper"),
      href: ZOOM_LINKS.consultation.deepLink,
    },
  };

  const sidebarLabels = {
    navigation: tCommon("accessibility.navigationTitle"),
    home: tCommon("accessibility.homeLink"),
    language: tCommon("localeSwitcher.label"),
    theme: tCommon("themeToggle.label"),
    cookies: tCommon("footer.cookies"),
    privacy: tCommon("footer.privacy"),
  };

  const mobileLabels = {
    navigation: tCommon("accessibility.navigationTitle"),
    home: tCommon("accessibility.homeLink"),
    open: tCommon("accessibility.openNavigation"),
    close: tCommon("accessibility.closeNavigation"),
    language: tCommon("localeSwitcher.label"),
    theme: tCommon("themeToggle.label"),
    cookies: tCommon("footer.cookies"),
    privacy: tCommon("footer.privacy"),
  };

  const activeLocaleName = tCommon(`localeNames.${locale}`);
  const themeSystemLabel = tCommon("themeToggle.system");
  const sectionIds = SECTION_LINKS.map((link) => link.targetId);
  const skipToContent = tCommon("accessibility.skipToContent");

  const sidebarLanguageSwitcher = (
    <LanguageSwitcher currentLocale={locale} label={sidebarLabels.language} />
  );
  const mobileLanguageSwitcher = (
    <LanguageSwitcher currentLocale={locale} label={mobileLabels.language} />
  );
  const sidebarThemeToggle = <ThemeToggle label={sidebarLabels.theme} />;
  const mobileThemeToggle = <ThemeToggle label={mobileLabels.theme} />;


  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProviders>
        <a
          href="#main-content"
          className="sr-only absolute left-6 top-4 z-50 inline-flex -translate-y-full items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-surface outline-none transition-transform duration-200 focus-visible:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {skipToContent}
        </a>
        <ActiveSectionProvider sectionIds={sectionIds} topOffset={144}>
          <div className="relative flex min-h-[100svh] flex-col bg-surface text-primary dark:bg-primary dark:text-surface lg:flex-row">
            <Sidebar
              locale={locale}
              navItems={navItems}
              legalLink={legalLink}
              privacyLink={privacyLink}
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
                legalLink={legalLink}
                privacyLink={privacyLink}
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
      </AppProviders>
    </NextIntlClientProvider>
  );
}
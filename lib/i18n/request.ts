import createMiddleware from "next-intl/middleware";
import {getRequestConfig} from "next-intl/server";

import {DEFAULT_LOCALE, LOCALES, type Locale, isLocale} from "./locales";
import {getMessages} from "./get-messages";

const DIAGNOSTICS_LABEL = "[IntlDiagnostics] getRequestConfig";

type RequestLocaleModule = {
  requestLocale?: () => Promise<string>;
};

async function tryRequestLocale(): Promise<string | undefined> {
  if (process.env.NODE_ENV !== "development") {
    return undefined;
  }

  try {
    const serverModule = (await import("next-intl/server")) as RequestLocaleModule;

    if (typeof serverModule.requestLocale === "function") {
      return await serverModule.requestLocale();
    }
  } catch (error) {
    console.warn(`${DIAGNOSTICS_LABEL} requestLocale dynamic import threw`, error);
  }

  return undefined;
}

export default getRequestConfig(async ({locale}) => {
  const localeFromRequestLocale = await tryRequestLocale();

  const resolvedLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const messages = await getMessages(resolvedLocale);

  if (process.env.NODE_ENV === "development") {
    console.log(`${DIAGNOSTICS_LABEL} locale diagnostics`, {
      localeParam: locale,
      localeFromRequestLocale,
      resolvedLocale,
      requestLocaleAvailable: typeof localeFromRequestLocale === "string",
      usedFallback: !isLocale(locale),
    });
  }

  return {
    messages,
  };
});

export const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeDetection: true,
});

export function getLocaleFromRequest(request: Request): Locale {
  const url = new URL(request.url);
  const [maybeLocale] = url.pathname.split("/").filter(Boolean);

  if (isLocale(maybeLocale)) {
    return maybeLocale;
  }

  return DEFAULT_LOCALE;
}
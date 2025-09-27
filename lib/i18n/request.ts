import createMiddleware from "next-intl/middleware";
import {getRequestConfig} from "next-intl/server";

import {DEFAULT_LOCALE, LOCALES, type Locale, isLocale} from "./locales";
import {getMessages} from "./get-messages";

export default getRequestConfig(async ({locale}) => {
  const resolvedLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const messages = await getMessages(resolvedLocale);

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
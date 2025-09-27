import type {AbstractIntlMessages} from "next-intl";
import type {Locale} from "./locales";

const NAMESPACES = ["common", "landing", "legal", "cookie"] as const;

type Namespace = (typeof NAMESPACES)[number];

async function importNamespace(
  locale: Locale,
  namespace: Namespace,
): Promise<AbstractIntlMessages> {
  const mod = await import(`@/content/i18n/${locale}/${namespace}.json`);
  return mod.default as AbstractIntlMessages;
}

export async function getMessages(locale: Locale): Promise<AbstractIntlMessages> {
  const entries = await Promise.all(
    NAMESPACES.map(async (namespace) => {
      const messages = await importNamespace(locale, namespace);

      if (namespace === "landing") {
        const landingKeys = Object.keys(messages ?? {});
        const hasContact = typeof (messages as Record<string, unknown>)?.contact !== "undefined";
        console.log("[getMessages] landing namespace", {locale, landingKeys, hasContact});
      }

      return {
        namespace,
        messages,
      };
    }),
  );

  return entries.reduce<Record<string, AbstractIntlMessages>>((acc, entry) => {
    acc[entry.namespace] = entry.messages;
    return acc;
  }, {}) as AbstractIntlMessages;
}
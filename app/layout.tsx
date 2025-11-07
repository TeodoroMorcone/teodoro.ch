import Script from "next/script";
import type {Metadata} from "next";
import type {ReactNode} from "react";
import {AppProviders} from "@/components/providers/app-providers";
import GA4 from "@/components/GA4";
import MetaPixel from "@/components/MetaPixel";
import {DEFAULT_CONSENT} from "@/config/analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teodoro Morcone Nachhilfe",
  description:
    "Professionelle Mathematik-Nachhilfe für Gymiprüfung, BMS/HMS/FMS und laufende Betreuung.",
  icons: {
    icon: "/images/64x64.png",
    apple: "/images/64x64.png",
    shortcut: "/images/64x64.png",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({children}: RootLayoutProps) {
  const consentInitScript = `
    (function () {
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      window.gtag = window.gtag || gtag;
      window.gtag('consent', 'default', ${JSON.stringify(DEFAULT_CONSENT)});
      window.gtag('set', 'ads_data_redaction', true);
    })();
  `.trim();

  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link href="https://media.calendesk.com/external/widget/v3/widget.css" rel="stylesheet" />
        <Script
          id="calendesk-widget"
          src="https://media.calendesk.com/external/widget/v3/widget.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-secondary text-accent-foreground antialiased transition-colors duration-200 ease-soft-sine dark:bg-primary dark:text-surface">
        <Script
          id="ga-consent-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{__html: consentInitScript}}
        />
        <AppProviders>
          <>
            {children}
            <GA4 />
            <MetaPixel />
          </>
        </AppProviders>
      </body>
    </html>
  );
}

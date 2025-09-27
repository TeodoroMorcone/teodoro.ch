"use client";

import type {ReactNode} from "react";

import {CookieBanner} from "../consent/cookie-banner";
import {ConsentPreferences} from "../consent/consent-preferences";
import {ConsentProvider} from "../consent/consent-context";
import {ThemeProvider} from "@/components/providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({children}: AppProvidersProps) {
  return (
    <ConsentProvider>
      <ThemeProvider>
        {children}
        <CookieBanner />
        <ConsentPreferences />
      </ThemeProvider>
    </ConsentProvider>
  );
}
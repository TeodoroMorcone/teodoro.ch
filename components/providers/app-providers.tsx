"use client";

import type {ReactNode} from "react";

import {ConsentProvider} from "../consent/consent-context";
import {ThemeProvider} from "@/components/providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({children}: AppProvidersProps) {
  return (
    <ConsentProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ConsentProvider>
  );
}
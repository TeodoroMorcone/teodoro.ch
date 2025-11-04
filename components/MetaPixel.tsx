"use client";

import {useEffect, useRef} from "react";

import type {Consent} from "@/lib/consent";
import {getConsent, onConsentChange} from "@/lib/consent";

const META_PIXEL_ID = "1199814365344218";

type FbqFunction = {
  (...args: unknown[]): void;
  queue?: unknown[];
  push?: FbqFunction;
  loaded?: boolean;
  version?: string;
  callMethod?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

function ensureFbq(): FbqFunction {
  if (typeof window === "undefined") {
    throw new Error("ensureFbq called on server");
  }

  if (typeof window.fbq === "function") {
    return window.fbq;
  }

  const fbq: FbqFunction = function fbqShim(this: FbqFunction, ...args: unknown[]) {
    const shim = fbqShim as unknown as FbqFunction;
    if (typeof shim.callMethod === "function") {
      shim.callMethod.apply(shim, args);
      return;
    }
    (shim.queue ?? (shim.queue = [])).push(args);
  } as unknown as FbqFunction;

  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.callMethod = function fbqCallMethod(this: FbqFunction, ...args: unknown[]) {
    (this.queue ?? (this.queue = [])).push(args);
  };

  window.fbq = fbq;
  window._fbq = fbq;

  return fbq;
}

function appendMetaPixelScript(): HTMLScriptElement | null {
  if (typeof document === "undefined") {
    return null;
  }

  const existing = document.querySelector<HTMLScriptElement>('script[data-source="meta-pixel"]');
  if (existing) {
    return existing;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.dataset.source = "meta-pixel";

  document.head.appendChild(script);

  return script;
}

function isMarketingGranted(consent: Consent | null): boolean {
  return Boolean(consent?.marketing);
}

const MetaPixel = (): null => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!META_PIXEL_ID) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[marketing] NEXT_PUBLIC_META_PIXEL_ID missing; Meta Pixel loader inactive.");
      }
      return;
    }

    const grantConsent = () => {
      try {
        const fbq = ensureFbq();
        appendMetaPixelScript();

        if (!initializedRef.current) {
          fbq("init", META_PIXEL_ID);
          initializedRef.current = true;
        }

        fbq("consent", "grant");
        fbq("track", "PageView");
      } catch (error) {
        console.warn("[marketing] Failed to initialize Meta Pixel", error);
      }
    };

    const revokeConsent = () => {
      const fbq = window.fbq;
      if (typeof fbq === "function") {
        fbq("consent", "revoke");
      }
    };

    const applyConsent = (consent: Consent | null) => {
      if (isMarketingGranted(consent)) {
        grantConsent();
      } else {
        revokeConsent();
      }
    };

    applyConsent(getConsent());

    const unsubscribe = onConsentChange((consent) => {
      applyConsent(consent);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default MetaPixel;
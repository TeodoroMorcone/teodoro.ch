"use client";

import {assertMeasurementId} from "@/config/analytics";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

type EventQueueItem = {
  name: string;
  params?: Record<string, unknown>;
};

let gaReady = false;
let scriptLoaded = false;
const eventQueue: EventQueueItem[] = [];

function ensureDataLayer() {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
  }
}

export function loadGaScript() {
  if (typeof window === "undefined") {
    return;
  }

  if (scriptLoaded) {
    return;
  }

  const measurementId = assertMeasurementId();
  ensureDataLayer();

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.onload = () => {
    gaReady = true;
    flushQueue();
  };
  script.onerror = () => {
    console.warn("[analytics] Failed to load GA4 script");
  };

  document.head.appendChild(script);
  scriptLoaded = true;

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

export function isGaReady() {
  return gaReady;
}

export function setGaReady(value: boolean) {
  gaReady = value;
  if (gaReady) {
    flushQueue();
  }
}

function flushQueue() {
  while (eventQueue.length > 0) {
    const item = eventQueue.shift();
    if (!item) {
      continue;
    }
    window.gtag("event", item.name, item.params ?? {});
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  if (!gaReady) {
    const item: EventQueueItem = params ? {name, params} : {name};
    eventQueue.push(item);
    return;
  }

  window.gtag("event", name, params ?? {});
}
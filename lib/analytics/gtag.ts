"use client";

import {DEFAULT_CONSENT, GRANTED_CONSENT, assertMeasurementId, getMeasurementId} from "@/config/analytics";

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
let scriptElement: HTMLScriptElement | null = null;
const eventQueue: EventQueueItem[] = [];

function clearEventQueue() {
  eventQueue.length = 0;
}

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

type ConsentUpdate = typeof DEFAULT_CONSENT;

function setAnalyticsDisabledFlag(measurementId: string, disabled: boolean) {
  const flagKey = `ga-disable-${measurementId}`;
  (window as typeof window & Record<string, boolean>)[flagKey] = disabled;
}

function updateGaConsent(consent: ConsentUpdate) {
  ensureDataLayer();
  window.gtag("consent", "update", consent);
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
  scriptElement = script;
  script.onload = () => {
    gaReady = true;
    flushQueue();
  };
  script.onerror = () => {
    console.warn("[analytics] Failed to load GA4 script");
    scriptLoaded = false;
    scriptElement = null;
    setGaReady(false);
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

export function unloadGaScript() {
  if (typeof window === "undefined") {
    return;
  }

  if (!scriptLoaded) {
    return;
  }

  if (scriptElement?.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement);
  }

  scriptElement = null;
  scriptLoaded = false;
  gaReady = false;
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

export function enableAnalyticsTracking(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const measurementId = getMeasurementId();
  if (!measurementId) {
    return false;
  }

  setAnalyticsDisabledFlag(measurementId, false);
  updateGaConsent(GRANTED_CONSENT);
  loadGaScript();

  return true;
}

export function disableAnalyticsTracking(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const measurementId = getMeasurementId();
  if (!measurementId) {
    return false;
  }

  updateGaConsent(DEFAULT_CONSENT);
  setAnalyticsDisabledFlag(measurementId, true);
  clearEventQueue();
  unloadGaScript();

  return true;
}

export function applyAnalyticsConsent(consented: boolean): boolean {
  return consented ? enableAnalyticsTracking() : disableAnalyticsTracking();
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
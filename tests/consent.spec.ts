import {expect, test, type BrowserContext, type Page, type Route} from "@playwright/test";

type StoredConsent = {
  essential?: boolean;
  analytics?: boolean;
  marketing?: boolean;
  ts?: number;
};

type NetworkTracking = {
  gtmRequests: string[];
  gaRequests: string[];
  metaRequests: string[];
  getFbqQueue: () => Promise<unknown[]>;
};

const HOME_PATH = "/en";
const GA_COLLECT_PATTERN = /https:\/\/www\.google-analytics\.com\/g\/collect/;
const META_SCRIPT_PATTERN = /connect\.facebook\.net\/.*\/fbevents\.js/;

async function setupNetworkTracking(page: Page): Promise<NetworkTracking> {
  const gtmRequests: string[] = [];
  const gaRequests: string[] = [];
  const metaRequests: string[] = [];

  await page.route("https://www.googletagmanager.com/**", async (route: Route) => {
    gtmRequests.push(route.request().url());
    await route.continue();
  });

  await page.route("https://www.google-analytics.com/**", async (route: Route) => {
    gaRequests.push(route.request().url());
    await route.fulfill({status: 204, body: ""});
  });

  await page.route("https://connect.facebook.net/**", async (route: Route) => {
    const url = route.request().url();
    metaRequests.push(url);

    if (META_SCRIPT_PATTERN.test(url)) {
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `
          (function() {
            if (!window.fbq) {
              const shim = function() {
                (shim.queue = shim.queue || []).push(arguments);
              };
              shim.queue = [];
              shim.push = shim;
              shim.loaded = true;
              shim.version = "2.0";
              window.fbq = shim;
            } else {
              window.fbq.queue = window.fbq.queue || [];
              window.fbq.loaded = true;
              window.fbq.version = window.fbq.version || "2.0";
              window.fbq.push = window.fbq;
            }
          })();
        `,
      });
    } else {
      await route.fulfill({status: 204, body: ""});
    }
  });

  return {
    gtmRequests,
    gaRequests,
    metaRequests,
    getFbqQueue: async () =>
      (await page.evaluate(() => {
        return window.fbq?.queue ?? [];
      })) as unknown[],
  };
}

async function readStoredConsent(page: Page): Promise<StoredConsent | null> {
  return (await page.evaluate(() => {
    const raw = window.localStorage.getItem("consent.v1");
    return raw ? (JSON.parse(raw) as StoredConsent) : null;
  })) as StoredConsent | null;
}

async function expectBannerVisible(page: Page) {
  await expect(page.locator("[data-cookie-banner]")).toBeVisible();
}

async function expectBannerHidden(page: Page) {
  await expect(page.locator("[data-cookie-banner]")).toBeHidden();
}

async function acceptAllCookies(page: Page) {
  const banner = page.locator("[data-cookie-banner]");
  await expect(banner).toBeVisible();
  await page.getByRole("button", {name: /Accept all/i}).click();
  await expect(banner).toBeHidden();
}

async function rejectAllCookies(page: Page) {
  const banner = page.locator("[data-cookie-banner]");
  await expect(banner).toBeVisible();
  await page.getByRole("button", {name: /Essential only/i}).click();
  await expect(banner).toBeHidden();
}

function gaCollectCount(gaRequests: string[]) {
  return gaRequests.filter((url) => GA_COLLECT_PATTERN.test(url)).length;
}

function metaScriptCount(metaRequests: string[]) {
  return metaRequests.filter((url) => META_SCRIPT_PATTERN.test(url)).length;
}

test.describe("Consent banner FDPIC compliance", () => {
  test.beforeEach(async ({context}: {context: BrowserContext}) => {
    await context.clearCookies();
    await context.clearPermissions();
  });

  test("blocks analytics and marketing requests until consent is given", async ({page}: {page: Page}) => {
    const trackers = await setupNetworkTracking(page);

    await page.goto(HOME_PATH);
    await expectBannerVisible(page);

    await expect.poll(() => trackers.gtmRequests.length).toBe(0);
    await expect.poll(() => trackers.gaRequests.length).toBe(0);
    await expect.poll(() => trackers.metaRequests.length).toBe(0);

    const storedConsent = await readStoredConsent(page);
    expect(storedConsent).toBeNull();
  });

  test("grants full consent and loads GA4 + Meta Pixel exactly once", async ({page}: {page: Page}) => {
    const trackers = await setupNetworkTracking(page);

    await page.goto(HOME_PATH);
    await acceptAllCookies(page);

    await expect.poll(() => gaCollectCount(trackers.gaRequests)).toBe(1);
    await expect.poll(() => metaScriptCount(trackers.metaRequests)).toBe(1);

    const storedConsent = await readStoredConsent(page);
    expect(storedConsent?.analytics).toBe(true);
    expect(storedConsent?.marketing).toBe(true);

    await expect.poll(async () => {
      const queue = await trackers.getFbqQueue();
      return queue.some(
        (entry) =>
          Array.isArray(entry) &&
          entry.length >= 2 &&
          entry[0] === "track" &&
          entry[1] === "PageView",
      );
    }).toBeTruthy();

    await expect.poll(async () => {
      const dataLayer = (await page.evaluate(() => window.dataLayer ?? [])) as unknown[];
      return dataLayer.some(
        (entry) =>
          Array.isArray(entry) &&
          entry.length >= 2 &&
          entry[0] === "event" &&
          entry[1] === "page_view",
      );
    }).toBeTruthy();
  });

  test("rejects all optional cookies and prevents trackers", async ({page}: {page: Page}) => {
    const trackers = await setupNetworkTracking(page);

    await page.goto(HOME_PATH);
    await rejectAllCookies(page);

    await expect.poll(() => trackers.gtmRequests.length).toBe(0);
    await expect.poll(() => trackers.gaRequests.length).toBe(0);
    await expect.poll(() => trackers.metaRequests.length).toBe(0);

    const storedConsent = await readStoredConsent(page);
    expect(storedConsent?.analytics).toBe(false);
    expect(storedConsent?.marketing).toBe(false);
  });

  test("allows consent withdrawal via footer and revokes analytics/marketing", async ({
    page,
  }: {
    page: Page;
  }) => {
    const trackers = await setupNetworkTracking(page);

    await page.goto(HOME_PATH);
    await acceptAllCookies(page);

    const analyticsBefore = gaCollectCount(trackers.gaRequests);
    const marketingBefore = trackers.metaRequests.length;

    await page.getByRole("button", {name: /Cookie settings/i}).click();

    const preferencesPanel = page.locator("[data-cookie-preferences]");
    await expect(preferencesPanel).toBeVisible();

    await page.getByLabel(/Analytics \(Google Analytics 4\)/i).setChecked(false);
    await page.getByLabel(/Marketing \(Meta Pixel\)/i).setChecked(false);

    await page.getByRole("button", {name: /Save settings/i}).click();
    await expect(preferencesPanel).toBeHidden();

    await expect.poll(async () => {
      const queue = await trackers.getFbqQueue();
      return queue.some(
        (entry) =>
          Array.isArray(entry) &&
          entry.length >= 2 &&
          entry[0] === "consent" &&
          entry[1] === "revoke",
      );
    }).toBeTruthy();

    const storedConsent = await readStoredConsent(page);
    expect(storedConsent?.analytics).toBe(false);
    expect(storedConsent?.marketing).toBe(false);

    await page.reload();
    await expectBannerHidden(page);

    await expect.poll(() => gaCollectCount(trackers.gaRequests)).toBe(analyticsBefore);
    await expect.poll(() => trackers.metaRequests.length).toBe(marketingBefore);
  });
});
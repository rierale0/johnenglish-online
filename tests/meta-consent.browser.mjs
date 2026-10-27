// Local integration test. The real Meta script/network is always intercepted.
// Start the app with FB_PIXEL_ID set to the public dataset ID and NO CAPI token.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.META_QA_URL || "http://127.0.0.1:3011";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "this test must never run against production");
const output = process.env.META_QA_OUTPUT || join(tmpdir(), "meta-consent-qa");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const stub = `window.__metaCalls = window.fbq.queue.slice(); window.fbq.queue.length = 0; window.fbq.callMethod = (...args) => window.__metaCalls.push(args);`;

async function setup(width = 430, delayed = false) {
  const context = await browser.newContext({ viewport: { width, height: 932 }, reducedMotion: "reduce" });
  let scriptCount = 0;
  const events = [];
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await context.route("https://connect.facebook.net/**", async route => {
    scriptCount++;
    if (delayed) await gate;
    await route.fulfill({ status: 200, contentType: "application/javascript", body: stub });
  });
  await context.route(/https:\/\/(?:www\.)?facebook\.com\//, route => route.abort());
  await context.route("https://wa.me/**", route => route.fulfill({ status: 200, contentType: "text/html", body: "<title>Local WhatsApp test</title>" }));
  // Capture the browser-to-server contract without generating external events.
  await context.route("**/api/meta/events", async route => {
    events.push(route.request().postDataJSON());
    await route.fulfill({ status: 202 });
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  return { context, page, events, errors, scripts: () => scriptCount, release };
}

try {
  for (const width of [360, 430, 1440]) {
    const qa = await setup(width);
    const { page, context, events } = qa;
    await page.goto(`${base}/junior-fluency?fbclid=local_test_click&utm_campaign=test`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Tú eliges tus cookies" }).waitFor();
    assert.equal(qa.scripts(), 0);
    assert.equal(events.length, 0);
    assert.equal(await page.evaluate(() => Boolean(window.fbq)), false);
    assert.ok(!(await context.cookies()).some(cookie => ["_fbp", "_fbc"].includes(cookie.name)));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const accept = await page.getByRole("button", { name: "Aceptar", exact: true }).boundingBox();
    const reject = await page.getByRole("button", { name: "Rechazar", exact: true }).boundingBox();
    assert.ok(Math.abs(accept.width - reject.width) < 1, "equal visual choice");
    assert.ok(accept.height >= 44 && reject.height >= 44);
    await page.screenshot({ path: join(output, `consent-${width}.png`) });

    await page.getByRole("button", { name: "Rechazar", exact: true }).click();
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(qa.scripts(), 0);
    assert.equal(events.length, 0);
    assert.equal(await page.locator(".cookie-notice").count(), 0);
    assert.equal(await page.locator("footer .cookie-preferences").count(), 1, "preferences stay in the footer");
    assert.equal(await page.locator(".cookie-preferences").evaluate(button => getComputedStyle(button).position), "static", "preferences never float");
    assert.equal(await page.evaluate(() => scrollY), 0, "initial consent choice must not scroll to the footer");
    await page.getByRole("button", { name: "Preferencias de cookies" }).click();
    await page.getByRole("button", { name: "Aceptar", exact: true }).click();
    await page.waitForFunction(() => window.__metaCalls?.some(call => call[0] === "trackSingle"));
    assert.equal(events.length, 1, "one PageView, including React Strict Mode");
    assert.equal(qa.scripts(), 1);
    assert.equal(events[0].eventName, "PageView");
    const browserPageView = await page.evaluate(() => window.__metaCalls.find(call => call[0] === "trackSingle"));
    assert.equal(browserPageView[2], events[0].eventName);
    assert.equal(browserPageView[4].eventID, events[0].eventId);
    assert.equal(events[0].pagePath, "/junior-fluency");
    assert.ok(!JSON.stringify(events).includes("utm_campaign"));
    assert.ok((await context.cookies()).some(cookie => cookie.name === "_fbp"));
    assert.ok((await context.cookies()).some(cookie => cookie.name === "_fbc"));

    const [popup] = await Promise.all([page.waitForEvent("popup"), page.locator('[data-junior-cta="hero"]').click()]);
    await popup.waitForLoadState();
    assert.equal(new URL(popup.url()).hostname, "wa.me");
    await popup.close();
    assert.equal(events.length, 2);
    assert.equal(events[1].eventName, "WhatsAppClick");
    assert.equal(events[1].placement, "hero");
    const browserClick = await page.evaluate(() => window.__metaCalls.find(call => call[0] === "trackSingleCustom"));
    assert.equal(browserClick[4].eventID, events[1].eventId);
    assert.equal(browserClick[2], events[1].eventName);

    // Existing Next Link returns home without reloading the root layout.
    await page.locator(".jf-wordmark").click();
    await page.waitForURL(`${base}/`);
    await page.waitForFunction(() => window.__metaCalls.filter(call => call[0] === "trackSingle").length === 2);
    assert.equal(events.filter(event => event.eventName === "PageView").length, 2);
    assert.equal(events.at(-1).pagePath, "/");
    assert.equal(qa.scripts(), 1, "pixel script initialized once across SPA navigation");
    const before = events.length;
    await page.getByRole("button", { name: "Preferencias de cookies" }).click();
    await page.getByRole("button", { name: "Rechazar", exact: true }).click();
    assert.ok(!(await context.cookies()).some(cookie => ["_fbp", "_fbc"].includes(cookie.name)));
    assert.ok(await page.evaluate(() => window.__metaCalls.some(call => call[0] === "consent" && call[1] === "revoke")));
    await page.getByRole("link", { name: "Junior Fluency", exact: true }).click();
    await page.waitForURL(`${base}/junior-fluency`);
    assert.equal(events.length, before, "no further events after withdrawal");
    assert.deepEqual(qa.errors, []);
    console.log(`PASS ${width}px: opt-in, persistence, paired IDs, navigation, withdrawal, no overflow`);
    await context.close();
  }

  const slow = await setup(430, true);
  await slow.page.goto(`${base}/junior-fluency`, { waitUntil: "networkidle" });
  await slow.page.getByRole("button", { name: "Aceptar", exact: true }).click();
  await slow.page.getByRole("button", { name: "Preferencias de cookies" }).click();
  await slow.page.getByRole("button", { name: "Rechazar", exact: true }).click();
  slow.release();
  await slow.page.waitForFunction(() => Boolean(window.__metaCalls));
  assert.ok(await slow.page.evaluate(() => !window.__metaCalls.some(call => call[0].startsWith("track"))), "slow script cannot replay revoked events");
  await slow.context.close();
  console.log("PASS delayed script: withdrawal clears queued events");

  const api = await browser.newContext();
  const endpoint = `${base}/api/meta/events`;
  const event = { eventName: "PageView", eventId: "5102d00e-158d-4e3b-9fa2-94d290768507", pagePath: "/" };
  assert.equal((await api.request.post(endpoint, { data: event })).status(), 403);
  assert.equal((await api.request.post(endpoint, { data: event, headers: { origin: "https://evil.test", cookie: "ewj_marketing_v1=granted" } })).status(), 403);
  assert.equal((await api.request.post(endpoint, { data: { ...event, eventName: "Lead" }, headers: { origin: base, cookie: "ewj_marketing_v1=granted" } })).status(), 400);
  assert.equal((await api.request.post(endpoint, { data: event, headers: { origin: base, cookie: "ewj_marketing_v1=granted" } })).status(), 204, "run this test without a local access token");
  await api.close();
  console.log("PASS real local endpoint: consent/origin/event validation; disabled without token");
  console.log(`Screenshots: ${output}`);
} finally { await browser.close(); }

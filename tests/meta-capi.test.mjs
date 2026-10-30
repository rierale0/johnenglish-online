import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { hasMarketingConsent, MARKETING_CONSENT_COOKIE, parseMetaEvent } from "../lib/meta-events.ts";

let source = readFileSync(new URL("../lib/meta-capi.ts", import.meta.url), "utf8").replace('import "server-only";', "");
source = source.replace('"./meta-events"', JSON.stringify(new URL("../lib/meta-events.ts", import.meta.url).href));
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const capiModule = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const capi = await import(capiModule);
const event = { eventName: "PageView", eventId: "5102d00e-158d-4e3b-9fa2-94d290768507", pagePath: "/junior-fluency" };
const consent = `${MARKETING_CONSENT_COOKIE}=granted`;
const pixelId = "28816945551285566";

function request(overrides = {}, body = event) {
  return new Request("https://inglesconjohn.es/api/meta/events", {
    method: "POST", headers: { origin: "https://inglesconjohn.es", "sec-fetch-site": "same-origin", "content-type": "application/json", cookie: consent, ...overrides }, body: JSON.stringify(body),
  });
}

test("Meta requires explicit consent, same origin and JSON", () => {
  assert.equal(hasMarketingConsent(""), false);
  assert.equal(hasMarketingConsent(`${MARKETING_CONSENT_COOKIE}=denied`), false);
  assert.equal(hasMarketingConsent(`other=granted; ${consent}`), true);
  assert.equal(capi.isAllowedMetaRequest(request()), true);
  const internalHost = new Request("http://localhost:3011/api/meta/events", { method: "POST", headers: { origin: "http://127.0.0.1:3011", "content-type": "application/json", cookie: consent } });
  assert.equal(capi.isAllowedMetaRequest(internalHost, { NODE_ENV: "development" }), true);
  assert.equal(capi.isAllowedMetaRequest(internalHost, { NODE_ENV: "production" }), false);
  assert.equal(capi.isAllowedMetaRequest(request({ host: "evil.test", origin: "https://evil.test" })), false);
  assert.equal(capi.isAllowedMetaRequest(request({ origin: "https://my-preview.vercel.app" }), { VERCEL_URL: "my-preview.vercel.app" }), true);
  for (const headers of [{ cookie: "" }, { cookie: `${MARKETING_CONSENT_COOKIE}=denied` }, { origin: "https://evil.test" }, { "sec-fetch-site": "cross-site" }, { "content-type": "text/plain" }]) {
    assert.equal(capi.isAllowedMetaRequest(request(headers)), false);
  }
});

test("only allowed marketing events and confirmed Junior Fluency conversion labels are accepted", () => {
  assert.deepEqual(parseMetaEvent(event), event);
  assert.ok(parseMetaEvent({ ...event, eventName: "WhatsAppClick", placement: "hero" }));
  for (const value of [null, [], { ...event, eventName: "Lead" }, { ...event, pagePath: "/katy" }, { ...event, pagePath: "/?email=private" }, { ...event, eventId: "reused-id" }, { ...event, user_data: { email: "private" } }, { ...event, pixelId: "other" }, { ...event, placement: "hero" }, { ...event, eventName: "WhatsAppClick" }, { ...event, eventName: "WhatsAppClick", placement: "child-name" }]) {
    assert.equal(parseMetaEvent(value), null);
  }
});

test("Junior Fluency Ask is limited to its landing and carries the same deduplication ID", () => {
  const lead = { ...event, eventName: "Junior Fluency Ask" };
  assert.deepEqual(parseMetaEvent(lead), lead);
  assert.equal(parseMetaEvent({ ...lead, pagePath: "/" }), null);
  assert.equal(parseMetaEvent({ ...lead, placement: "hero" }), null);
  assert.equal(parseMetaEvent({ ...lead, phone: "+34612345678" }), null);
  const payload = capi.buildMetaServerEvent(lead, new Headers());
  assert.equal(payload.event_name, "Junior Fluency Ask");
  assert.deepEqual(payload.custom_data, { conversion_name: "Junior Fluency Ask" });
  assert.equal(payload.event_id, lead.eventId);
  const confirmation = { ...event, juniorConfirmation: true };
  assert.deepEqual(parseMetaEvent(confirmation), confirmation);
  assert.deepEqual(capi.buildMetaServerEvent(confirmation, new Headers()).custom_data, { conversion_name: "Junior Fluency Ask" });
  assert.equal(capi.buildMetaServerEvent(event, new Headers()).custom_data, undefined);
  assert.equal(parseMetaEvent({ ...confirmation, pagePath: "/" }), null);
  assert.equal(parseMetaEvent({ ...confirmation, eventName: "Junior Fluency Ask" }), null);
});

test("body is bounded even without a trustworthy content-length", async () => {
  assert.deepEqual(await capi.readMetaEvent(request()), event);
  assert.equal(await capi.readMetaEvent(request({}, { ...event, padding: "x".repeat(4000) })), null);
  assert.equal(await capi.readMetaEvent(request({ "content-length": "4000" })), null);
  const malformed = new Request("https://inglesconjohn.es/api/meta/events", { method: "POST", body: "{" });
  assert.equal(await capi.readMetaEvent(malformed), null);
});

test("server payload preserves deduplication ID, strips URL parameters, and uses only trusted matching data", () => {
  const headers = new Headers({ cookie: `${consent}; _fbp=fb.1.1793094000000.1234567890; _fbc=fb.1.1793094000000.click_abc`, "user-agent": "Test browser", "x-vercel-forwarded-for": "203.0.113.7", "x-forwarded-for": "192.0.2.8" });
  const payload = capi.buildMetaServerEvent(event, headers, 1793094000999, true);
  assert.equal(payload.event_id, event.eventId);
  assert.equal(payload.event_name, event.eventName);
  assert.equal(payload.event_time, 1793094000);
  assert.equal(payload.action_source, "website");
  assert.equal(payload.event_source_url, "https://inglesconjohn.es/junior-fluency");
  assert.deepEqual(payload.user_data, { client_user_agent: "Test browser", client_ip_address: "203.0.113.7", fbp: "fb.1.1793094000000.1234567890", fbc: "fb.1.1793094000000.click_abc" });
  assert.equal(capi.buildMetaServerEvent(event, headers, undefined, false).user_data.client_ip_address, undefined);
  headers.set("x-vercel-forwarded-for", "not-an-ip");
  headers.set("cookie", `${consent}; _fbp=private@email.test; _fbc=invalid`);
  const invalid = capi.buildMetaServerEvent(event, headers, undefined, true).user_data;
  assert.equal(invalid.client_ip_address, undefined);
  assert.equal(invalid.fbp, undefined);
  assert.equal(invalid.fbc, undefined);
});

test("Graph delivery keeps the secret in the authorization header and supports server-controlled test events", async () => {
  const config = capi.getMetaConfiguration({ FB_PIXEL_ID: pixelId, META_CAPI_ACCESS_TOKEN: "test-only-placeholder", META_CAPI_TEST_EVENT_CODE: "TEST54046" });
  assert.equal(config.version, "v26.0");
  let delivered;
  const success = await capi.sendMetaEvent(capi.buildMetaServerEvent(event, new Headers()), config, async (url, options) => {
    delivered = { url, options };
    return Response.json({ events_received: 1 });
  });
  assert.equal(success, true);
  assert.equal(delivered.url, `https://graph.facebook.com/v26.0/${pixelId}/events`);
  assert.equal(delivered.options.headers.Authorization, "Bearer test-only-placeholder");
  assert.ok(!delivered.url.includes(config.token));
  assert.ok(!delivered.options.body.includes(config.token));
  const body = JSON.parse(delivered.options.body);
  assert.equal(body.test_event_code, "TEST54046");
  assert.equal(body.data[0].event_id, event.eventId);
  assert.equal(body.data[0].event_name, "PageView");
  assert.equal(delivered.options.cache, "no-store");
  assert.equal(capi.getMetaConfiguration({ FB_PIXEL_ID: pixelId }), null);
  assert.equal(capi.getMetaConfiguration({ FB_PIXEL_ID: pixelId, META_CAPI_ACCESS_TOKEN: "x", META_GRAPH_API_VERSION: "../../elsewhere" }), null);
});

test("delivery errors do not leak Meta error messages, tokens or matching data", async () => {
  const entries = [];
  const original = console.error;
  console.error = (...args) => entries.push(args);
  try {
    const config = capi.getMetaConfiguration({ FB_PIXEL_ID: pixelId, META_CAPI_ACCESS_TOKEN: "private-token" });
    const payload = capi.buildMetaServerEvent(event, new Headers());
    assert.equal(await capi.sendMetaEvent(payload, config, async () => Response.json({ error: { code: 190, message: "private-token secret user data" } }, { status: 401 })), false);
    assert.equal(await capi.sendMetaEvent(payload, config, async () => { throw new Error("private-token"); }), false);
    assert.doesNotMatch(JSON.stringify(entries), /private-token|secret user data/);
    assert.match(JSON.stringify(entries), /190/);
  } finally { console.error = original; }
});

test("per-instance guard suppresses retries and limits bursts without growing indefinitely", () => {
  const guard = capi.createMetaEventGuard();
  assert.equal(guard("203.0.113.7", event, 1000), "allowed");
  assert.equal(guard("203.0.113.7", event, 1001), "duplicate");
  for (let index = 1; index < 60; index++) assert.equal(guard("203.0.113.7", { ...event, eventId: `id-${index}` }, 1001), "allowed");
  assert.equal(guard("203.0.113.7", { ...event, eventId: "over-limit" }, 1001), "limited");
  assert.equal(guard("203.0.113.8", { ...event, eventId: "another-visitor" }, 1001), "allowed");
  assert.equal(guard("203.0.113.7", event, 61_001), "allowed");
});

test("route forwards consented events to Graph once and reports delivery failure", async () => {
  const routeSource = readFileSync(new URL("../app/api/meta/events/route.ts", import.meta.url), "utf8").replace('"@/lib/meta-capi"', JSON.stringify(capiModule));
  const routeCode = ts.transpileModule(routeSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const { POST } = await import(`data:text/javascript;base64,${Buffer.from(routeCode).toString("base64")}`);
  const originalFetch = globalThis.fetch;
  const variables = ["FB_PIXEL_ID", "META_CAPI_ACCESS_TOKEN", "META_CAPI_TEST_EVENT_CODE", "META_GRAPH_API_VERSION", "VERCEL"];
  const saved = Object.fromEntries(variables.map(name => [name, process.env[name]]));
  const outgoing = [];
  const originalError = console.error;
  try {
    process.env.FB_PIXEL_ID = pixelId;
    process.env.META_CAPI_ACCESS_TOKEN = "unit-test-placeholder";
    process.env.META_CAPI_TEST_EVENT_CODE = "TEST54046";
    process.env.META_GRAPH_API_VERSION = "v26.0";
    process.env.VERCEL = "1";
    globalThis.fetch = async (url, options) => {
      outgoing.push({ url, body: JSON.parse(options.body) });
      return Response.json({ events_received: 1 });
    };
    assert.equal((await POST(request({ cookie: "" }))).status, 403);
    assert.equal((await POST(request({}, { ...event, eventName: "Lead" }))).status, 400);
    assert.equal(outgoing.length, 0);
    const response = await POST(request({ "x-vercel-forwarded-for": "203.0.113.7" }));
    assert.equal(response.status, 202);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(outgoing[0].body.test_event_code, "TEST54046");
    assert.equal(outgoing[0].body.data[0].event_id, event.eventId);
    assert.equal(outgoing[0].body.data[0].user_data.client_ip_address, "203.0.113.7");
    assert.equal((await POST(request())).status, 202);
    assert.equal(outgoing.length, 1, "duplicate is not forwarded twice");
    const click = { ...event, eventId: "5102d00e-158d-4e3b-9fa2-94d290768508", eventName: "WhatsAppClick", placement: "hero" };
    assert.equal((await POST(request({}, click))).status, 202);
    assert.equal(outgoing[1].body.data[0].event_name, "WhatsAppClick");
    globalThis.fetch = async () => Response.json({ error: { code: 190 } }, { status: 401 });
    console.error = () => {};
    assert.equal((await POST(request({}, { ...event, eventId: "5102d00e-158d-4e3b-9fa2-94d290768509" }))).status, 502);
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalError;
    for (const name of variables) {
      if (saved[name] === undefined) delete process.env[name];
      else process.env[name] = saved[name];
    }
  }
});

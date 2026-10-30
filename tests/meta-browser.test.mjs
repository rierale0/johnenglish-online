import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import * as events from "../lib/meta-events.ts";

const source = ts.transpileModule(readFileSync(new URL("../lib/meta-browser.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

test("Junior Fluency Ask respects consent and shares the confirmed submission ID across Pixel and CAPI", () => {
  const calls = [];
  const requests = [];
  const document = { cookie: "ewj_marketing_v1=denied" };
  const location = { pathname: "/junior-fluency", href: "https://inglesconjohn.es/junior-fluency", protocol: "https:" };
  const exports = {};
  runInNewContext(source, { exports, require: () => events, document, location, window: { fbq: (...args) => calls.push(args) }, crypto: webcrypto, URL, fetch: (url, options) => { requests.push({ url, body: JSON.parse(options.body) }); return Promise.resolve({}); } });
  const id = "5102d00e-158d-4e3b-9fa2-94d290768507";
  exports.trackMetaEvent("28816945551285566", "Junior Fluency Ask", undefined, id);
  assert.equal(calls.length, 0);
  assert.equal(requests.length, 0);
  document.cookie = "ewj_marketing_v1=granted; _fbp=fb.1.1793094000000.1234567890";
  exports.trackMetaEvent("28816945551285566", "Junior Fluency Ask", undefined, id);
  const tracked = calls.find(call => call[0] === "trackSingleCustom");
  assert.equal(tracked[2], "Junior Fluency Ask");
  assert.equal(tracked[4].eventID, id);
  assert.equal(tracked[3].conversion_name, "Junior Fluency Ask");
  assert.deepEqual(requests[0].body, { eventName: "Junior Fluency Ask", eventId: id, pagePath: "/junior-fluency" });
  location.pathname = "/";
  exports.trackMetaEvent("28816945551285566", "Junior Fluency Ask", undefined, id);
  assert.equal(requests.length, 1);
});

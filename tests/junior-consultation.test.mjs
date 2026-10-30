import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const compile = path => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const url = source => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const validationUrl = url(compile("../lib/junior-consultation.ts"));
const { validateConsultation } = await import(validationUrl);
const { POST } = await import(url(compile("../app/api/junior-fluency/consultation/route.ts").replace('"@/lib/junior-consultation"', JSON.stringify(validationUrl))));
const input = { name: "Familia de prueba", phone: "612 345 678", consent: true, website: "", submissionId: "a8479f3a-cc50-4ffd-b0d6-122bcc3abe6f" };
const request = (value = input, origin = "https://example.test") => new Request("https://example.test/api/junior-fluency/consultation", { method: "POST", headers: { origin, "Content-Type": "application/json" }, body: JSON.stringify(value) });

test("normalizes Spanish and international numbers and rejects invalid submissions", () => {
  assert.equal(validateConsultation(input).phone, "+34612345678");
  assert.equal(validateConsultation({ ...input, phone: "0044 7700 900123" }).phone, "+447700900123");
  for (const change of [{ phone: "123" }, { phone: "+34notaphone" }, { consent: false }, { website: "spam" }, { name: " " }, { submissionId: "invalid" }]) {
    assert.equal(validateConsultation({ ...input, ...change }), null);
  }
});

test("submission requires same origin, bounded input, configured delivery and durable acknowledgement", async () => {
  const oldFetch = globalThis.fetch;
  const oldUrl = process.env.JUNIOR_CONSULTATION_WEBHOOK_URL;
  const oldToken = process.env.JUNIOR_CONSULTATION_WEBHOOK_TOKEN;
  try {
    delete process.env.JUNIOR_CONSULTATION_WEBHOOK_URL;
    delete process.env.JUNIOR_CONSULTATION_WEBHOOK_TOKEN;
    assert.equal((await POST(request(input, "https://other.test"))).status, 403);
    assert.equal((await POST(request({ ...input, name: "a".repeat(5000) }))).status, 413);
    assert.equal((await POST(request({ ...input, consent: false }))).status, 400);
    assert.equal((await POST(request())).status, 503);
    process.env.JUNIOR_CONSULTATION_WEBHOOK_URL = "https://receiver.example.test/callback";
    process.env.JUNIOR_CONSULTATION_WEBHOOK_TOKEN = "test-only";
    globalThis.fetch = async (_, options) => {
      assert.equal(options.headers["Idempotency-Key"], input.submissionId);
      assert.equal(JSON.parse(options.body).phone, "+34612345678");
      return Response.json({ accepted: true });
    };
    assert.deepEqual(await (await POST(request())).json(), { accepted: true });
    globalThis.fetch = async () => Response.json({ queued: true });
    assert.equal((await POST(request())).status, 502);
    globalThis.fetch = async () => { throw new Error("Offline"); };
    assert.equal((await POST(request())).status, 502);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldUrl === undefined) delete process.env.JUNIOR_CONSULTATION_WEBHOOK_URL; else process.env.JUNIOR_CONSULTATION_WEBHOOK_URL = oldUrl;
    if (oldToken === undefined) delete process.env.JUNIOR_CONSULTATION_WEBHOOK_TOKEN; else process.env.JUNIOR_CONSULTATION_WEBHOOK_TOKEN = oldToken;
  }
});

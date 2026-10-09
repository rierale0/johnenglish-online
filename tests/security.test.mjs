import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import nextConfig from "../next.config.ts";
import { getRedirectKeys, getRedirectUrl } from "../lib/redirects.ts";
import robots from "../app/robots.ts";

async function importSource(relativePath, imports = {}) {
  const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
  let compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  for (const [specifier, replacement] of Object.entries(imports)) {
    compiled = compiled.replaceAll(JSON.stringify(specifier), JSON.stringify(replacement));
  }
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
}

test("only configured redirects resolve, including normalized keys", () => {
  for (const key of getRedirectKeys()) {
    const url = getRedirectUrl(` ${key.toUpperCase()} `);
    assert.equal(new URL(url).protocol, "https:");
  }
  for (const key of ["constructor", "__proto__", "toString", "valueOf", "missing"]) {
    assert.equal(getRedirectUrl(key), null);
  }
});

test("JSON-LD preserves data without allowing an embedded script closing tag", async () => {
  const require = createRequire(import.meta.url);
  const jsxRuntime = pathToFileURL(require.resolve("react/jsx-runtime")).href;
  const { default: JsonLd } = await importSource("../app/global-components/JsonLd.tsx", {
    "react/jsx-runtime": jsxRuntime,
  });
  const data = { name: '</script><script>alert("xss")</script>', level: "A1 & A2" };
  const html = renderToStaticMarkup(JsonLd({ data }));
  assert.equal((html.match(/<script/g) ?? []).length, 1);
  assert.equal((html.match(/<\/script>/g) ?? []).length, 1);
  const serialized = html.slice(html.indexOf(">") + 1, html.lastIndexOf("</script>"));
  assert.deepEqual(JSON.parse(serialized), data);
});

test("security headers restrict embedding and plugins while allowing existing videos", async () => {
  const [rule] = await nextConfig.headers();
  assert.equal(rule.source, "/:path*");
  const headers = Object.fromEntries(rule.headers.map(({ key, value }) => [key, value]));
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["X-Frame-Options"], "DENY");
  const csp = headers["Content-Security-Policy"];
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /base-uri 'self'/);
  assert.match(csp, /https:\/\/www\.youtube-nocookie\.com/);
  assert.doesNotMatch(csp, /unsafe-eval/);
});

test("native sitemap and robots use the canonical domain and existing routes", async () => {
  const { default: sitemap } = await importSource("../app/sitemap.ts", {
    "@/lib/redirects": new URL("../lib/redirects.ts", import.meta.url).href,
  });
  const entries = sitemap();
  const urls = entries.map(({ url }) => url);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes("https://inglesconjohn.es"));
  assert.ok(urls.includes("https://inglesconjohn.es/privacy"));
  for (const key of getRedirectKeys()) {
    assert.ok(urls.includes(`https://inglesconjohn.es/${key}`));
    assert.ok(urls.includes(`https://inglesconjohn.es/r/${key}`));
  }
  assert.ok(urls.every((url) => new URL(url).origin === "https://inglesconjohn.es"));
  assert.equal(robots().sitemap, "https://inglesconjohn.es/sitemap.xml");
});

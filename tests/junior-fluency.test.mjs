import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { getRedirectUrl } from "../lib/redirects.ts";

const source = readFileSync(new URL("../lib/junior-fluency.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  .replace('"./redirects"', JSON.stringify(new URL("../lib/redirects.ts", import.meta.url).href));
const { getJuniorPricing, juniorWhatsAppUrl } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

for (const [frequency, startClasses, startTotal, continuityClasses, continuityTotal, savings] of [
  [1, 4, 72, 12, 192, 24], [2, 8, 144, 24, 384, 48], [3, 12, 216, 36, 576, 72],
]) {
  test(`Junior Fluency: precios y servicio para ${frequency} clases semanales`, () => {
    const result = getJuniorPricing(frequency);
    assert.deepEqual(result.start, { weeks: 4, rate: 18, classes: startClasses, total: startTotal, tasks: startClasses / 2, reviews: startClasses / 4 });
    assert.deepEqual(result.continuity, { weeks: 12, rate: 16, classes: continuityClasses, total: continuityTotal, tasks: continuityClasses / 2, reviews: continuityClasses / 4 });
    assert.equal(result.savings, savings);
    assert.equal(result.start.total * 3 - result.continuity.total, savings);
  });
}
test("frecuencias fuera de oferta no producen precios", () => {
  for (const value of [0, 4, 1.5, NaN]) assert.throws(() => getJuniorPricing(value), RangeError);
});
test("WhatsApp usa el contacto existente y un mensaje dirigido al adulto", () => {
  const url = new URL(juniorWhatsAppUrl);
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname.slice(1), new URL(getRedirectUrl("contact")).searchParams.get("phone"));
  assert.equal(url.searchParams.get("text"), "Hola, soy madre/padre/tutor y me gustaría solicitar la asesoría gratuita de 15–20 minutos para conocer el programa Junior Fluency.");
});

import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.JUNIOR_QA_URL ?? "http://localhost:3000";
const output = process.env.JUNIOR_QA_OUTPUT ?? join(tmpdir(), "junior-journey-qa");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  for (const width of [360, 393, 430, 768, 1440, 2560]) {
    const page = await browser.newPage({ viewport: { width, height: width < 768 ? 932 : 1000 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => {
      window.journeyAnimations = 0;
      const original = Element.prototype.animate;
      Element.prototype.animate = function (...args) {
        if (this.matches(".jf-step-card")) window.journeyAnimations++;
        return original.apply(this, args);
      };
    });
    await page.goto(`${base}/junior-fluency`, { waitUntil: "networkidle" });
    const cards = page.locator(".jf-step-card");
    assert.equal(await cards.count(), 4);
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      await card.locator("img").evaluate(image => image.decode());
      await card.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
    }
    assert.equal(await page.evaluate(() => window.journeyAnimations), 4, "each card animates once");
    await cards.first().scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(() => window.journeyAnimations), 4, "scrolling back does not repeat reveals");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "no horizontal overflow");
    const boxes = await cards.evaluateAll(items => items.map(item => {
      const bounds = item.getBoundingClientRect();
      return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    }));
    assert.equal(boxes[0].y === boxes[1].y, width >= 768, "responsive column count");
    await page.locator("#como-funciona").screenshot({ path: join(output, `journey-${width}.png`) });
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: four images, responsive layout, one-time reveal, no overflow`);
    await page.close();
  }

  const reduced = await browser.newPage({ viewport: { width: 393, height: 852 }, reducedMotion: "reduce" });
  await reduced.goto(`${base}/junior-fluency`, { waitUntil: "networkidle" });
  for (const card of await reduced.locator(".jf-step-card").all()) {
    await card.scrollIntoViewIfNeeded();
    assert.equal(await card.evaluate(element => element.getAnimations().length), 0);
    assert.equal(await card.evaluate(element => getComputedStyle(element).opacity), "1");
  }
  console.log("PASS reduced motion: static visible cards");
  await reduced.close();

  const noJs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 393, height: 852 } });
  await noJs.goto(`${base}/junior-fluency`);
  assert.equal(await noJs.locator(".jf-step-card:visible").count(), 4);
  console.log("PASS without JavaScript: all content remains visible");
  await noJs.close();
} finally {
  await browser.close();
}

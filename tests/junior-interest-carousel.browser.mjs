import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.JUNIOR_QA_URL ?? "http://localhost:3000";
const output = process.env.JUNIOR_QA_OUTPUT ?? join(tmpdir(), "junior-carousel-qa");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of [393, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 393 ? 852 : 900 }, reducedMotion: "no-preference" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${base}/junior-fluency`);
    await page.waitForLoadState("networkidle");
    const carousel = page.locator(".jf-carousel");
    const index = () => carousel.getAttribute("data-carousel-index");
    await carousel.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    assert.equal(await carousel.getAttribute("data-carousel-playing"), "true");
    const initial = await index();
    await page.waitForFunction(value => document.querySelector(".jf-carousel")?.getAttribute("data-carousel-index") !== value, initial, { timeout: 9000 });
    await page.getByRole("button", { name: "Pausar carrusel", exact: true }).click();
    await page.mouse.move(0, 0);
    assert.equal(await carousel.getAttribute("data-carousel-playing"), "false");
    const pausedIndex = await index();
    await page.waitForTimeout(5600);
    assert.equal(await index(), pausedIndex, "paused carousel must stay in place");
    await page.getByRole("button", { name: "Interés siguiente", exact: true }).click();
    await page.waitForFunction(value => document.querySelector(".jf-carousel")?.getAttribute("data-carousel-index") !== value, pausedIndex);
    await page.getByRole("button", { name: "Interés anterior", exact: true }).focus();
    const beforeKeyboard = await index();
    await page.keyboard.press("ArrowLeft");
    await page.waitForFunction(value => document.querySelector(".jf-carousel")?.getAttribute("data-carousel-index") !== value, beforeKeyboard);
    await page.getByRole("button", { name: "Ir a la posición 1", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".jf-carousel")?.getAttribute("data-carousel-index") === "0");
    await page.getByRole("button", { name: "Reanudar carrusel", exact: true }).click();
    await page.mouse.move(0, 0);
    await page.waitForFunction(() => document.querySelector(".jf-carousel")?.getAttribute("data-carousel-index") !== "0", null, { timeout: 9000 });
    await page.getByRole("button", { name: "Pausar carrusel", exact: true }).click();
    if (width === 393) {
      await page.getByRole("button", { name: "Ir a la posición 1", exact: true }).click();
      await page.waitForFunction(() => document.querySelector(".jf-carousel")?.getAttribute("data-carousel-index") === "0");
      const viewport = await page.locator(".jf-carousel-viewport").boundingBox();
      await page.mouse.move(viewport.x + viewport.width * .85, viewport.y + 100);
      await page.mouse.down();
      await page.mouse.move(viewport.x + 10, viewport.y + 100, { steps: 20 });
      await page.mouse.up();
      await page.waitForFunction(() => document.querySelector(".jf-carousel")?.getAttribute("data-carousel-index") !== "0");
    }
    assert.equal(await page.locator(".jf-carousel-slide").count(), 3);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator(".jf-interest-grid").evaluate(track => new Promise(resolve => {
      let previous = "";
      let stableFrames = 0;
      function check() {
        const current = getComputedStyle(track).transform;
        stableFrames = current === previous ? stableFrames + 1 : 0;
        previous = current;
        if (stableFrames >= 8) resolve(true);
        else requestAnimationFrame(check);
      }
      check();
    }));
    await carousel.screenshot({ path: join(output, `carousel-${width}.png`) });
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: autoplay, pause, resume, arrows, keyboard, dots, no overflow${width === 393 ? ", drag" : ""}`);
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 393, height: 852 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${base}/junior-fluency`);
  await page.waitForLoadState("networkidle");
  await page.locator(".jf-carousel").scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const index = await page.locator(".jf-carousel").getAttribute("data-carousel-index");
  assert.equal(await page.locator("[data-autoplay-control]").isDisabled(), true);
  await page.waitForTimeout(5600);
  assert.equal(await page.locator(".jf-carousel").getAttribute("data-carousel-index"), index);
  await page.getByRole("button", { name: "Interés siguiente", exact: true }).click();
  await page.waitForFunction(value => document.querySelector(".jf-carousel")?.getAttribute("data-carousel-index") !== value, index);
  console.log("PASS reduced motion: autoplay off, manual navigation available");
  await context.close();
} finally { await browser.close(); }

// Run against the local server; Playwright is supplied through NODE_PATH.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.JUNIOR_QA_URL ?? "http://127.0.0.1:3011";
const output = process.env.JUNIOR_QA_OUTPUT ?? join(tmpdir(), "junior-hero-qa");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];

try {
  for (const width of [360, 393, 430, 768, 1440]) {
    const height = width === 430 ? 932 : width === 393 ? 852 : width < 768 ? 844 : 1000;
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "no-preference" });
    await context.route("https://wa.me/**", route => route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Consultation link checked locally</title>" }));
    await context.addInitScript(() => {
      window.heroQA = { starts: [], samples: [], shifts: 0, complete: false };
      document.addEventListener("animationstart", event => {
        if (!event.animationName.startsWith("jf-hero-")) return;
        const target = event.target;
        window.heroQA.starts.push(`${event.animationName}:${target.id || target.getAttribute("class") || target.tagName}:${event.pseudoElement}`);
      });
      if (PerformanceObserver.supportedEntryTypes.includes("layout-shift")) {
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput && entry.sources?.some(source => source.node?.closest?.(".jf-hero-shell"))) window.heroQA.shifts += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      }
      document.addEventListener("DOMContentLoaded", async () => {
        await document.fonts.ready;
        const started = performance.now();
        const sample = () => {
          const hero = document.querySelector(".jf-hero-shell");
          const cta = hero.querySelector('[data-junior-cta="hero"]');
          window.heroQA.samples.push({
            overflow: document.documentElement.scrollWidth > innerWidth,
            headingOpacity: getComputedStyle(hero.querySelector("h1")).opacity,
            buttonOpacity: getComputedStyle(cta).opacity,
            buttonY: cta.getBoundingClientRect().y + scrollY,
          });
          if (performance.now() - started < 3300) requestAnimationFrame(sample);
          else window.heroQA.complete = true;
        };
        requestAnimationFrame(sample);
      });
    });

    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(`${base}/junior-fluency`, { waitUntil: "domcontentloaded" });
    assert.equal(response.status(), 200);
    const hero = page.locator(".jf-hero-shell");
    const cta = hero.locator('[data-junior-cta="hero"]');
    assert.ok(await cta.isVisible(), "the consultation link is immediately visible");
    assert.equal(await cta.evaluate(element => getComputedStyle(element).transform), "none", "the CTA itself does not move");

    if (width === 430) {
      // Click during the introduction: conversion must never wait for animation.
      const [popup] = await Promise.all([page.waitForEvent("popup"), cta.click()]);
      await popup.waitForLoadState();
      assert.equal(new URL(popup.url()).hostname, "wa.me");
      await popup.close();
    }

    await page.waitForFunction(() => window.heroQA.complete);
    const motion = await page.evaluate(() => window.heroQA);
    assert.ok(motion.starts.length > 0, "the hero has an entrance when motion is allowed");
    assert.equal(new Set(motion.starts).size, motion.starts.length, "each entrance plays once");
    assert.ok(motion.samples.length > 10);
    assert.ok(motion.samples.every(sample => !sample.overflow), "no horizontal overflow during motion");
    assert.ok(motion.samples.every(sample => sample.headingOpacity === "1" && sample.buttonOpacity === "1"), "the headline and CTA remain fully visible");
    const positions = motion.samples.map(sample => sample.buttonY);
    assert.ok(Math.max(...positions) - Math.min(...positions) < 1, "the consultation link stays in the same place");
    assert.ok(motion.shifts < 0.02, `hero layout shifts: ${motion.shifts}`);
    const active = () => hero.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.animationName?.startsWith("jf-hero-")).length);
    assert.equal(await active(), 0, "the hero settles instead of looping");
    await page.locator("#programas").scrollIntoViewIfNeeded();
    await page.evaluate(() => scrollTo(0, 0));
    assert.equal(await active(), 0, "scrolling back does not restart the entrance");
    await page.locator(".jf-hero-illustration > img").evaluate(image => image.decode());
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (width < 768) assert.ok((await hero.boundingBox()).height <= height, "the complete mobile hero still fits");
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    await hero.screenshot({ path: join(output, `hero-${width}.png`) });
    assert.deepEqual(errors, []);
    results.push({ width, status: "passed", entrances: motion.starts.length, layoutShift: motion.shifts, checks: "visible headline, fixed CTA, finite motion, no overflow, no replay, mobile height" });
    console.log(`PASS ${width}px: finite entrance, stable CTA, no overflow`);
    await context.close();
  }

  const reduced = await browser.newPage({ viewport: { width: 430, height: 932 }, reducedMotion: "reduce" });
  await reduced.goto(`${base}/junior-fluency`);
  assert.equal(await reduced.locator(".jf-hero-shell").evaluate(element => element.getAnimations({ subtree: true }).length), 0);
  assert.ok(await reduced.locator('.jf-hero [data-junior-cta="hero"]').isVisible());
  await reduced.close();

  const preferenceChange = await browser.newPage({ viewport: { width: 430, height: 932 }, reducedMotion: "no-preference" });
  await preferenceChange.goto(`${base}/junior-fluency`, { waitUntil: "domcontentloaded" });
  await preferenceChange.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await preferenceChange.locator(".jf-hero-shell").evaluate(element => element.getAnimations({ subtree: true }).length), 0, "motion stops when the preference changes");
  await preferenceChange.close();

  const noJs = await browser.newPage({ viewport: { width: 430, height: 932 }, javaScriptEnabled: false, reducedMotion: "reduce" });
  await noJs.goto(`${base}/junior-fluency`);
  assert.equal(await noJs.locator("h1:visible").count(), 1);
  assert.ok(await noJs.locator('.jf-hero [data-junior-cta="hero"]').isVisible());
  assert.match(await noJs.locator('.jf-hero [data-junior-cta="hero"]').getAttribute("href"), /^https:\/\/wa\.me\//);
  await noJs.close();
  results.push({ status: "passed", checks: "reduced motion, preference change, content and CTA without JavaScript, immediate WhatsApp navigation intercepted locally" });
  await writeFile(join(output, "results.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ output, results }, null, 2));
} finally {
  await browser.close();
}

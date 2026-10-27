// Run against a local server. Requires Playwright in NODE_PATH or node_modules.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.env.JUNIOR_QA_URL ?? "http://localhost:3000";
const output = process.env.JUNIOR_QA_OUTPUT ?? join(tmpdir(), "junior-fluency-qa");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
try {
  for (const width of [360, 375, 390, 393, 430, 768, 1024, 1440]) {
    const height = width === 430 ? 932 : width === 393 ? 852 : width < 768 ? 844 : 900;
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
    // Observe conversion navigation without contacting WhatsApp or sending messages.
    await context.route("https://wa.me/**", route => route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>WhatsApp navigation checked locally</title>" }));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(`${base}/junior-fluency?utm_source=qa&utm_medium=test&utm_campaign=junior-v1`);
    assert.equal(response.status(), 200);
    await page.waitForLoadState("networkidle");
    await page.locator('input[value="2"]').waitFor();
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://inglesconjohn.es/junior-fluency");
    assert.match(await page.title(), /^Junior Fluency/);
    assert.equal(await page.locator('input[value="1"]').isChecked(), true);
    const prices = async () => (await page.locator("[data-price]").allTextContents()).map(text => text.replace(/\s+/g, " ").trim());
    assert.deepEqual(await prices(), ["72 €", "192 €"]);
    for (const [frequency, start, continuity] of [[1, 72, 192], [3, 216, 576], [2, 144, 384]]) {
      await page.getByRole("radio", { name: `${frequency} ${frequency === 1 ? "clase" : "clases"}`, exact: true }).check();
      await page.waitForFunction(expected => document.querySelector('[data-plan="start"] [data-price]')?.textContent?.includes(`${expected} €`), start);
      assert.deepEqual(await prices(), [`${start} €`, `${continuity} €`]);
      for (const [key, weeks] of [["start", 4], ["continuity", 12]]) {
        const plan = page.locator(`[data-plan="${key}"]`);
        assert.match(await plan.innerText(), new RegExp(`${weeks * frequency} clases individuales de 60 minutos`));
        assert.match(await plan.innerText(), new RegExp(`${weeks * frequency / 2} actividades personalizadas con corrección`));
        const reviews = weeks * frequency / 4;
        assert.match(await plan.innerText(), new RegExp(`${reviews} ${reviews === 1 ? "revisión" : "revisiones"}`));
        assert.match(await plan.locator(".jf-session-price").innerText(), new RegExp(`${key === "start" ? 18 : 16}\\s*€\\s*/\\s*clase`));
        assert.equal(await plan.locator(".jf-duration").innerText(), `${weeks} semanas`);
        assert.match(await plan.locator(".jf-program-total").innerText(), /Un único pago antes de empezar\./);
        assert.ok(await plan.locator(".jf-program-total").isVisible(), "the full program price stays visible");
        assert.ok(await plan.evaluate(element => parseFloat(getComputedStyle(element.querySelector(".jf-session-price strong")).fontSize) > parseFloat(getComputedStyle(element.querySelector("[data-price]")).fontSize)), "the session rate leads the price hierarchy");
      }
      assert.match(await page.locator(".jf-featured .jf-savings").innerText(), new RegExp(`${24 * frequency} €`));
    }
    await page.locator('input[value="2"]').focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator('input[value="3"]').isChecked(), true);
    await page.keyboard.press("ArrowLeft");
    assert.equal(await page.locator('input[value="2"]').isChecked(), true);
    assert.equal(new URL(page.url()).searchParams.get("utm_campaign"), "junior-v1");
    const hero = page.locator(".jf-hero-illustration > img");
    await hero.evaluate(img => img.decode());
    assert.ok((await hero.getAttribute("alt")).includes("Ilustración"));
    const interestImages = page.locator(".jf-interest-grid article img");
    assert.equal(await interestImages.count(), 3);
    await page.locator(".jf-carousel-viewport").scrollIntoViewIfNeeded();
    for (const illustration of await interestImages.all()) {
      await illustration.evaluate(image => image.decode());
      assert.ok(await illustration.evaluate(image => image.naturalWidth > 0));
      assert.ok((await illustration.getAttribute("alt"))?.trim().length > 10, "interest images have descriptive alternative text");
      assert.equal(await illustration.getAttribute("loading"), "lazy");
    }
    if (width < 768) {
      const heroShell = await page.locator(".jf-hero-shell").boundingBox();
      const scrollOffset = await page.evaluate(() => scrollY);
      assert.ok(heroShell && heroShell.y + scrollOffset + heroShell.height <= height, `hero exceeds the ${height}px mobile viewport at ${width}px`);
      // Pricing cards can grow vertically so prices, payment terms and benefits
      // remain legible; horizontal overflow is checked for the complete page.
      for (const selector of [".jf-benefits", ".jf-includes"]) {
        const section = await page.locator(selector).boundingBox();
        if (section && section.height > height) {
          await page.locator(selector).screenshot({ path: join(output, `oversize-${width}.png`) });
          console.log(await page.locator(selector).evaluate(element => [...element.querySelectorAll('.jf-section-heading, .jf-frequency, .jf-price-card, .jf-plan-more, .jf-price-note')].map(child => ({ name: child.className, height: child.getBoundingClientRect().height }))));
        }
        assert.ok(section && section.height <= height, `${selector} is ${section?.height}px tall at ${width}px; maximum ${height}`);
      }
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}px`);
    assert.equal(await page.locator("form").count(), 0);
    for (const link of await page.locator("a[data-junior-cta]").all()) {
      const url = new URL(await link.getAttribute("href"));
      assert.equal(url.hostname, "wa.me");
      assert.equal(url.pathname, "/34613696839");
      assert.match(url.searchParams.get("text"), /15–20 minutos.*Junior Fluency/);
      const [popup] = await Promise.all([page.waitForEvent("popup"), link.click()]);
      await popup.waitForLoadState();
      assert.equal(new URL(popup.url()).hostname, "wa.me");
      await popup.close();
    }
    const faq = page.locator(".jf-faq details").first();
    await faq.locator("summary").focus();
    await page.keyboard.press("Enter");
    assert.equal(await faq.getAttribute("open"), "");
    await page.evaluate(() => scrollTo(0, 0));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(output, `junior-${width}.png`), fullPage: true });
    if (width === 390 || width === 1440) await page.screenshot({ path: join(output, `hero-${width}.png`) });
    if (width === 393) {
      for (const [name, selector] of [["benefits", ".jf-benefits"], ["pricing", "#programas"], ["teacher", ".jf-teacher"]]) {
        await page.locator(selector).evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY));
        await page.screenshot({ path: join(output, `${name}-393.png`) });
      }
    }
    if (width === 430 || width === 1440) await page.locator(".jf-interest-grid").screenshot({ path: join(output, `interests-${width}.png`) });
    assert.deepEqual(errors, [], `browser errors at ${width}px`);
    results.push({ width, status: "passed", checks: "render, SEO, prices, tasks, reviews, savings, keyboard, FAQ, WhatsApp (intercepted), UTM, hero, overflow, console" });
    await context.close();
  }
  const page = await browser.newPage();
  await page.goto(base);
  await page.getByRole("link", { name: "Junior Fluency", exact: true }).click();
  await page.waitForURL(`${base}/junior-fluency`);
  assert.equal((await page.request.get(`${base}/privacy`)).status(), 200);
  const sitemap = await (await page.request.get(`${base}/sitemap.xml`)).text();
  assert.ok(sitemap.includes("https://inglesconjohn.es/junior-fluency"));
  results.push({ status: "passed", checks: "home navigation, privacy route, sitemap" });
  await writeFile(join(output, "results.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ output, results }, null, 2));
} finally { await browser.close(); }

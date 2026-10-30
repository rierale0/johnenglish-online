"use client";

import { hasMarketingConsent, isMetaPagePath, MARKETING_CONSENT_COOKIE, MARKETING_CONSENT_DAYS, META_PLACEMENTS, type MetaEvent, type MetaPlacement } from "./meta-events";

const initializedPixels = new Set<string>();

function setCookie(name: string, value: string, days: number) {
  document.cookie = `${name}=${value}; Max-Age=${days * 86400}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

function clearMatchingCookies() {
  const labels = location.hostname.split(".");
  const domains = ["", ...labels.map((_, index) => labels.slice(index).join(".")).filter((domain) => domain.includes(".")).map((domain) => `; Domain=.${domain}`)];
  for (const name of ["_fbp", "_fbc"]) {
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  }
}

export function revokeMetaTracking() {
  // A blocked/slow script must not replay queued events after withdrawal.
  if (window.fbq && !window.fbq.callMethod) window.fbq.queue = window.fbq.queue.filter(([command]) => command === "init" || command === "set");
  window.fbq?.("consent", "revoke");
  clearMatchingCookies();
}

export function saveMarketingConsent(granted: boolean) {
  setCookie(MARKETING_CONSENT_COOKIE, granted ? "granted" : "denied", MARKETING_CONSENT_DAYS);
  if (!granted) revokeMetaTracking();
}

export function initializeMetaPixel(pixelId: string): boolean {
  if (!hasMarketingConsent(document.cookie) || !/^\d{5,30}$/.test(pixelId)) return false;
  if (!window.fbq) {
    const pixel: FacebookPixel = Object.assign(function (...args: FacebookPixelArguments) {
      if (pixel.callMethod) pixel.callMethod(...args);
      else pixel.queue.push(args);
    }, { loaded: true, version: "2.0", queue: [] as FacebookPixelArguments[] }) as FacebookPixel;
    pixel.push = pixel;
    window.fbq = pixel;
    window._fbq = pixel;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
  window.fbq("consent", "grant");
  if (!initializedPixels.has(pixelId)) {
    window.fbq("set", "autoConfig", false, pixelId);
    window.fbq("init", pixelId);
    initializedPixels.add(pixelId);
  }
  return true;
}

function setMatchingCookies() {
  if (!document.cookie.split(";").some((cookie) => cookie.trim().startsWith("_fbp="))) {
    const random = crypto.getRandomValues(new Uint32Array(1))[0];
    setCookie("_fbp", `fb.1.${Date.now()}.${random}`, 90);
  }
  const clickId = new URL(location.href).searchParams.get("fbclid");
  if (clickId && /^[A-Za-z0-9_-]{1,200}$/.test(clickId)) {
    const current = document.cookie.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith("_fbc="));
    if (!current?.endsWith(`.${clickId}`)) setCookie("_fbc", `fb.1.${Date.now()}.${clickId}`, 90);
  }
}

export function trackMetaEvent(pixelId: string, eventName: MetaEvent["eventName"], placement?: MetaPlacement, eventId = crypto.randomUUID()) {
  const pagePath = location.pathname;
  if (eventName === "Junior Fluency Ask" && pagePath !== "/junior-fluency") return;
  if (!isMetaPagePath(pagePath) || !initializeMetaPixel(pixelId)) return;
  setMatchingCookies();
  const event: MetaEvent = { eventName, eventId, pagePath, ...(placement ? { placement } : {}) };
  const parameters = placement ? { placement } : {};
  window.fbq?.(eventName === "PageView" ? "trackSingle" : "trackSingleCustom", pixelId, eventName, parameters, { eventID: event.eventId });
  // Keep navigation immediate, including opening WhatsApp in a new tab.
  void fetch("/api/meta/events", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => { /* Measurement must never interrupt the visitor. */ });
}

export function getWhatsAppPlacement(anchor: HTMLAnchorElement): MetaPlacement | null {
  const url = new URL(anchor.href, location.origin);
  const whatsapp = ["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname);
  const internalRedirect = url.origin === location.origin && ["/demo", "/contact", "/r/demo", "/r/contact"].includes(url.pathname);
  if (!whatsapp && !internalRedirect) return null;
  const placement = anchor.dataset.juniorCta;
  if (META_PLACEMENTS.some((allowed) => allowed === placement)) return placement as MetaPlacement;
  if (anchor.closest("footer")) return "footer";
  if (anchor.closest("nav, header")) return "nav";
  return "other";
}

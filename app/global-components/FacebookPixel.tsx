"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getWhatsAppPlacement, revokeMetaTracking, saveMarketingConsent, trackMetaEvent } from "@/lib/meta-browser";
import { MARKETING_CONSENT_COOKIE, readCookie } from "@/lib/meta-events";

export default function FacebookPixel({ pixelId }: { pixelId?: string }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const lastPage = useRef<string | null>(null);
  const preferencesButton = useRef<HTMLButtonElement | null>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    function syncConsent() {
      const saved = readCookie(document.cookie, MARKETING_CONSENT_COOKIE);
      if (saved !== "granted") revokeMetaTracking();
      setConsent(saved === "granted" || saved === "denied" ? saved : null);
      setReady(true);
    }
    function openPreferences(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>("button[data-cookie-preferences]");
      if (!button) return;
      preferencesButton.current = button;
      setPreferencesOpen(true);
    }
    syncConsent();
    window.addEventListener("focus", syncConsent);
    document.addEventListener("click", openPreferences);
    return () => {
      window.removeEventListener("focus", syncConsent);
      document.removeEventListener("click", openPreferences);
    };
  }, []);

  useEffect(() => {
    if (consent !== "granted" || !pixelId) {
      lastPage.current = null;
      return;
    }
    if (lastPage.current !== pathname) {
      lastPage.current = pathname;
      trackMetaEvent(pixelId, "PageView");
    }
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const marked = event.target.closest("[data-meta-whatsapp]");
      if (marked) { trackMetaEvent(pixelId!, "WhatsAppClick", "plans"); return; }
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const placement = getWhatsAppPlacement(anchor);
      if (placement) trackMetaEvent(pixelId!, "WhatsAppClick", placement);
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [consent, pathname, pixelId]);

  useEffect(() => {
    if (preferencesOpen) title.current?.focus();
  }, [preferencesOpen]);

  function choose(granted: boolean) {
    saveMarketingConsent(granted);
    setConsent(granted ? "granted" : "denied");
    setPreferencesOpen(false);
    requestAnimationFrame(() => preferencesButton.current?.focus({ preventScroll: true }));
  }

  if (!ready || (consent && !preferencesOpen)) return null;

  return (
    <section className="cookie-notice" aria-labelledby="cookie-title" aria-describedby="cookie-description">
      <div className="cookie-notice-copy">
        <h2 id="cookie-title" ref={title} tabIndex={-1}>Tú eliges tus cookies</h2>
        <p id="cookie-description">¿Nos ayudas a mejorar? Con tu permiso, usamos cookies de terceros para entender cómo se utiliza nuestra web y mejorar nuestros anuncios. Puedes aceptar, rechazar o cambiar tu elección cuando quieras. <a href="/privacy#cookies">Más información</a></p>
      </div>
      <div className="cookie-notice-actions">
        <button type="button" onClick={() => choose(false)}>Rechazar</button>
        <button className="cookie-accept" type="button" onClick={() => choose(true)}>Aceptar</button>
        {consent && <button className="cookie-close" type="button" onClick={() => { setPreferencesOpen(false); requestAnimationFrame(() => preferencesButton.current?.focus({ preventScroll: true })); }}>Cerrar</button>}
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";

export default function SectionMotion() {
  useEffect(() => {
    const root = document.getElementById("junior-contenido");
    if (!root || !("IntersectionObserver" in window) || !("animate" in Element.prototype)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 767px)");
    const targets = new Map<Element, number>();
    const revealed = new WeakSet<Element>();
    const animations = new Set<Animation>();

    root.querySelectorAll(
      ".jf-section-heading, .jf-includes-intro, .jf-includes-list, .jf-pricing-next-step, .jf-teacher-intro, .jf-teacher-values, .jf-closing h2",
    ).forEach(element => targets.set(element, 0));
    for (const selector of [".jf-benefit-card", ".jf-testimonial-card blockquote"]) {
      root.querySelectorAll(selector).forEach((element, index) => targets.set(element, (index % 3) * 55));
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || revealed.has(entry.target)) return;
        revealed.add(entry.target);
        observer.unobserve(entry.target);
        if (preference.matches || document.visibilityState !== "visible" || entry.target.contains(document.activeElement)) return;

        // Independent translate preserves existing hover transforms. Content is
        // never hidden, and interactive controls are not among the targets.
        const animation = entry.target.animate(
          [{ translate: `0 ${compact.matches ? 8 : 12}px` }, { translate: "0 0" }],
          { duration: 520, delay: targets.get(entry.target) ?? 0, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
        animation.id = "jf-section-reveal";
        animations.add(animation);
        const release = () => animations.delete(animation);
        animation.onfinish = release;
        animation.oncancel = release;
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

    targets.forEach((_, element) => observer.observe(element));
    const stopMotion = () => {
      if (!preference.matches) return;
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    preference.addEventListener("change", stopMotion);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      preference.removeEventListener("change", stopMotion);
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function LearningJourney({ children }: { children: ReactNode }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const revealed = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || revealed.has(entry.target)) return;
        revealed.add(entry.target);
        observer.unobserve(entry.target);
        if (preference.matches) return;

        const animation = entry.target.animate(
          [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.12 });

    list.querySelectorAll(".jf-step-card").forEach(card => observer.observe(card));
    const stopMotion = () => {
      if (preference.matches) {
        animations.forEach(animation => animation.cancel());
        animations.clear();
      }
    };
    preference.addEventListener("change", stopMotion);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      preference.removeEventListener("change", stopMotion);
    };
  }, []);

  return <ol ref={listRef} className="jf-steps">{children}</ol>;
}

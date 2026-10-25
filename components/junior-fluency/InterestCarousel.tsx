"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

export default function InterestCarousel({ children }: { children: ReactNode }) {
  const slides = Children.toArray(children);
  const [viewportRef, api] = useEmblaCarousel({ align: "start", loop: false });
  const rootRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(slides.length);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setSelected(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => { api.off("select", update); api.off("reInit", update); };
  }, [api]);

  useEffect(() => {
    if (!api || paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      const bounds = rootRef.current?.getBoundingClientRect();
      if (!bounds || hovering.current || document.visibilityState !== "visible") return;
      const visibleHeight = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0);
      if (visibleHeight < Math.min(bounds.height / 2, 300)) return;
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [api, paused, reducedMotion]);

  function move(direction: "previous" | "next") {
    if (!api) return;
    setPaused(true);
    const target = direction === "next" ? (selected + 1) % snapCount : (selected - 1 + snapCount) % snapCount;
    api.scrollTo(target, reducedMotion);
  }

  return (
    <div
      ref={rootRef}
      className="jf-carousel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Actividades según sus intereses"
      data-carousel-index={selected}
      data-carousel-playing={!paused && !reducedMotion}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") hovering.current = true; }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") hovering.current = false; }}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest("[data-autoplay-control]")) setPaused(true);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? "next" : "previous");
        }
      }}
    >
      <div className="jf-carousel-viewport" ref={viewportRef} onPointerDown={() => setPaused(true)}>
        <div className="jf-interest-grid">
          {slides.map((slide, index) => (
            <div className="jf-carousel-slide" key={index} role="group" aria-roledescription="diapositiva" aria-label={`${index + 1} de ${slides.length}`}>
              {slide}
            </div>
          ))}
        </div>
      </div>
      <div className="jf-carousel-controls">
        <div className="jf-carousel-arrows">
          <button type="button" onClick={() => move("previous")} aria-label="Interés anterior"><ArrowLeft size={20} aria-hidden="true" /></button>
          <button type="button" onClick={() => move("next")} aria-label="Interés siguiente"><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
        <div className="jf-carousel-dots" aria-label="Posiciones del carrusel">
          {Array.from({ length: snapCount }, (_, index) => (
            <button type="button" key={index} aria-label={`Ir a la posición ${index + 1}`} aria-current={selected === index ? "true" : undefined} onClick={() => { setPaused(true); api?.scrollTo(index, reducedMotion); }}><span /></button>
          ))}
        </div>
        <button
          type="button"
          data-autoplay-control
          disabled={reducedMotion}
          aria-label={reducedMotion ? "Avance automático desactivado por preferencia de movimiento reducido" : paused ? "Reanudar carrusel" : "Pausar carrusel"}
          title={reducedMotion ? "Movimiento reducido: utiliza las flechas o desliza" : paused ? "Reanudar carrusel" : "Pausar carrusel"}
          onClick={() => setPaused(value => !value)}
        >
          {paused || reducedMotion ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
        </button>
      </div>
      <p className="sr-only" role="status" aria-live={paused || reducedMotion ? "polite" : "off"} aria-atomic="true">Posición {selected + 1} de {snapCount}.</p>
    </div>
  );
}

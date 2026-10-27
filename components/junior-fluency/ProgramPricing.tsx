"use client";

import { useState } from "react";
import { Check, ChevronDown, CircleHelp, MessageCircle } from "lucide-react";
import { getJuniorPricing, type Frequency } from "@/lib/junior-fluency";
import ConsultationLink from "./ConsultationLink";

const euros = (value: number) => `${value.toLocaleString("es-ES")} €`;

export default function ProgramPricing() {
  const [frequency, setFrequency] = useState<Frequency>(1);
  const pricing = getJuniorPricing(frequency);

  return (
    <section className="jf-section jf-pricing" id="programas" aria-labelledby="programas-title">
      <div className="jf-container">
        <div className="jf-section-heading">
          <p className="jf-eyebrow">Programas y precios</p>
          <h2 id="programas-title">Elige cómo empezar.</h2>
          <p>Dos programas con clases individuales, actividades y seguimiento. Si tienes dudas, te ayudo a elegir en la asesoría gratuita.</p>
        </div>
        <div className="jf-frequency-panel">
          <fieldset className="jf-frequency" aria-describedby="frequency-help">
            <legend>¿Cuántas clases por semana?</legend>
            <div className="jf-options">
              {([1, 2, 3] as const).map((value) => (
                <label key={value}>
                  <input type="radio" name="frequency" value={value} checked={frequency === value} onChange={() => setFrequency(value)} />
                  <span>{value} {value === 1 ? "clase" : "clases"}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p id="frequency-help">Las clases incluidas y los totales se ajustan al ritmo que elijas.</p>
        </div>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {frequency} {frequency === 1 ? "clase" : "clases"} por semana. Inicio: {pricing.start.classes} clases, {euros(pricing.start.total)}. Continuidad: {pricing.continuity.classes} clases, {euros(pricing.continuity.total)}. Ahorro: {euros(pricing.savings)}.
        </p>
        <div className="jf-price-grid">
          {(["start", "continuity"] as const).map((key) => {
            const plan = pricing[key];
            const continuity = key === "continuity";
            return (
              <article key={key} className={`jf-price-card ${continuity ? "jf-featured" : ""}`} data-plan={key} aria-labelledby={`${key}-plan-title`}>
                <div className="jf-plan-heading">
                  <p className="jf-plan-tag">{continuity ? "Mejor precio por clase" : "Para dar el primer paso"}</p>
                  <span className="jf-duration">{plan.weeks} semanas</span>
                </div>
                <h3 id={`${key}-plan-title`}>{continuity ? "Continuidad" : "Plan de Inicio"}</h3>
                <p className="jf-plan-description">{continuity ? "Más tiempo para practicar y consolidar lo aprendido." : "Conoce las clases y empieza a trabajar sus objetivos."}</p>
                <p className="jf-session-price"><strong>{euros(plan.rate)}</strong><span>/ clase</span></p>
                <p className="jf-session-detail">Individual · Online · 60 minutos</p>
                <dl className="jf-program-total">
                  <div className="jf-program-amount">
                    <dt>Total por {plan.weeks} semanas</dt>
                    <dd className="jf-total" data-price>{euros(plan.total)}</dd>
                  </div>
                  <div className="jf-program-payment">
                    <dt className="sr-only">Forma de pago</dt>
                    <dd>Un único pago antes de empezar.</dd>
                  </div>
                </dl>
                <ul className="jf-plan-list">
                  {[
                    `${plan.classes} clases individuales de 60 minutos`,
                    `${plan.tasks} actividades personalizadas con corrección`,
                    `${plan.reviews} ${plan.reviews === 1 ? "revisión" : "revisiones"} de progreso para la familia`,
                  ].map(text => <li key={text}><Check size={18} aria-hidden="true" /><span>{text}</span></li>)}
                </ul>
                {continuity && <p className="jf-savings"><strong>Ahorras {euros(pricing.savings)} en estas 12 semanas.</strong><span>Frente a 3 planes de Inicio de la misma frecuencia.</span></p>}
                <ConsultationLink placement={key} />
              </article>
            );
          })}
        </div>
        <div className="jf-pricing-footer">
          <div className="jf-pricing-next-step">
            <div><span className="jf-pricing-help-icon"><MessageCircle size={22} aria-hidden="true" /></span><strong>No necesitas tenerlo decidido.</strong></div>
            <p>En una asesoría gratuita de 15–20 minutos vemos qué necesita tu hijo y qué programa le encaja. Sin compromiso.</p>
          </div>
          <details className="jf-plan-more">
            <summary><span><CircleHelp size={19} aria-hidden="true" />¿Qué programa encaja mejor?</span><ChevronDown className="jf-plan-chevron" size={18} aria-hidden="true" /></summary>
            <div className="jf-plan-guidance"><p><strong>Plan de Inicio · 4 semanas.</strong> Una primera etapa para conocer nuestra forma de trabajar, identificar sus necesidades y comenzar a desarrollar sus habilidades en inglés.</p><p><strong>Continuidad · 12 semanas.</strong> Más tiempo para trabajar objetivos, reforzar lo aprendido y observar cómo evoluciona su aprendizaje.</p></div>
          </details>
          <p className="jf-price-note"><strong>Diagnóstico y objetivos incluidos en ambos programas.</strong> Pago por tarjeta (Stripe) o Bizum tras acordar el programa. Horarios según disponibilidad; condiciones de cambios y cancelaciones antes de contratar.</p>
        </div>
      </div>
    </section>
  );
}

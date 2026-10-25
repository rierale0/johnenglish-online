"use client";

import { useState } from "react";
import { Check, ChevronDown, CircleHelp } from "lucide-react";
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
          <p className="jf-eyebrow">A vuestro ritmo</p>
          <h2 id="programas-title">Elige cómo empezar.</h2>
          <p>Ambos planes incluyen actividades, correcciones y seguimiento.</p>
        </div>
        <fieldset className="jf-frequency">
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
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {frequency} {frequency === 1 ? "clase" : "clases"} por semana. Inicio: {pricing.start.classes} clases, {euros(pricing.start.total)}. Continuidad: {pricing.continuity.classes} clases, {euros(pricing.continuity.total)}. Ahorro: {euros(pricing.savings)}.
        </p>
        <div className="jf-price-grid">
          {(["start", "continuity"] as const).map((key) => {
            const plan = pricing[key];
            const continuity = key === "continuity";
            return (
              <article key={key} className={`jf-price-card ${continuity ? "jf-featured" : ""}`} data-plan={key}>
                <p className="jf-plan-tag">{continuity ? "Mejor precio por clase" : "Para empezar a aprender juntos"}</p>
                <h3>{continuity ? "Continuidad" : "Plan de Inicio"}</h3>
                <p className="jf-duration">{plan.weeks} semanas · {plan.rate} €/clase</p>
                <p className="jf-total" data-price>{euros(plan.total)} <span>en total</span></p>
                <ul className="jf-plan-list">
                  {[
                    [`${plan.classes} clases individuales de 60 minutos`, `${plan.classes} clases de 60 min`],
                    [`${plan.tasks} actividades personalizadas con corrección`, `${plan.tasks} actividades con corrección`],
                    [`${plan.reviews} ${plan.reviews === 1 ? "revisión" : "revisiones"} de progreso para la familia`, `${plan.reviews} ${plan.reviews === 1 ? "revisión" : "revisiones"} para la familia`],
                  ].map(([text, shortText]) => <li key={text}><Check size={18} aria-hidden="true" /><span className="jf-plan-full-label">{text}</span><span className="jf-plan-short-label">{shortText}</span></li>)}
                </ul>
                {continuity && <p className="jf-savings">Ahorras {euros(pricing.savings)} frente a 3 planes de Inicio<span className="jf-plan-full-label"> de la misma frecuencia</span>.</p>}
                <ConsultationLink placement={key} />
              </article>
            );
          })}
        </div>
        <div className="jf-pricing-footer">
          <details className="jf-plan-more">
            <summary><span><CircleHelp size={22} aria-hidden="true" />¿Qué programa elegir?</span><ChevronDown className="jf-plan-chevron" size={18} aria-hidden="true" /></summary>
            <div className="jf-plan-guidance"><p>El Plan de Inicio es una primera etapa para conocer nuestra forma de trabajar, identificar sus necesidades y comenzar a desarrollar sus habilidades en inglés.</p><p>Continuidad permite trabajar objetivos con más tiempo, reforzar lo aprendido y observar cómo evoluciona su aprendizaje. Ambos incluyen diagnóstico y objetivos al inicio.</p></div>
          </details>
          <p className="jf-price-note"><strong>Clases individuales. Diagnóstico y objetivos incluidos.</strong> Pago anticipado por tarjeta (Stripe) o Bizum tras acordar el programa. Horarios según disponibilidad; condiciones de cambios y cancelaciones antes de contratar.</p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { juniorWhatsAppUrl } from "@/lib/junior-fluency";
import { validateConsultation } from "@/lib/junior-consultation";

export default function ConsultationForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const busy = useRef(false);
  const submissionId = useRef<string | null>(null);
  const fingerprint = useRef("");
  const result = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    const nextFingerprint = JSON.stringify([data.get("name"), data.get("phone")]);
    if (fingerprint.current !== nextFingerprint) submissionId.current = null;
    fingerprint.current = nextFingerprint;
    submissionId.current ??= crypto.randomUUID();
    const nameField = event.currentTarget.elements.namedItem("name") as HTMLInputElement;
    if (nameField.value.trim().length < 2) {
      nameField.setCustomValidity("Escribe tu nombre para que pueda dirigirme a ti.");
      nameField.reportValidity();
      return;
    }
    const input = { name: data.get("name"), phone: data.get("phone"), consent: data.get("consent") === "on", website: data.get("website"), submissionId: submissionId.current };
    if (!validateConsultation(input)) {
      const phone = event.currentTarget.elements.namedItem("phone") as HTMLInputElement;
      phone.setCustomValidity("Introduce un teléfono válido. Para números de fuera de España, incluye + y el prefijo del país.");
      phone.reportValidity();
      return;
    }
    busy.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/junior-fluency/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(20000),
      });
      const payload = await response.json();
      if (!response.ok || payload.accepted !== true) throw new Error("Not accepted");
      setStatus("success");
      document.dispatchEvent(new CustomEvent("junior-consultation-accepted", { detail: { eventId: input.submissionId } }));
      requestAnimationFrame(() => result.current?.focus());
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }

  return (
    <section className="jf-contact-card" id="solicitar-llamada" aria-labelledby="call-title">
      <div className="jf-contact-badge"><Phone size={16} aria-hidden="true" /> Asesoría gratuita · Sin compromiso</div>
      <h2 id="call-title">Hablemos de lo que necesita tu hijo</h2>
      {status === "success" ? (
        <div className="jf-contact-success" ref={result} tabIndex={-1} role="status">
          <CheckCircle2 size={36} aria-hidden="true" />
          <h3>¡Solicitud recibida!</h3>
          <p>Gracias por dar el primer paso. Te llamaré al teléfono que has indicado para hablar de lo que necesita tu hijo y resolver tus dudas.</p>
          <p>La asesoría es gratuita y dura entre 15 y 20 minutos.</p>
        </div>
      ) : (
        <>
          <p className="jf-contact-intro">Déjame tus datos y te llamaré para conocer sus necesidades, explicarte cómo funcionan las clases y resolver tus dudas.</p>
          <form onSubmit={submit} aria-busy={status === "sending"}>
            <label className="jf-contact-field" htmlFor="call-name">Tu nombre <span>(madre, padre o tutor)</span>
              <input id="call-name" name="name" autoComplete="name" required minLength={2} maxLength={100} onInput={event => event.currentTarget.setCustomValidity("")} placeholder="¿Cómo te llamas?" />
            </label>
            <label className="jf-contact-field" htmlFor="call-phone">Teléfono de contacto
              <input id="call-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={25} onInput={event => event.currentTarget.setCustomValidity("")} placeholder="Ej. +34 612 345 678" aria-describedby="call-phone-help" />
            </label>
            <p id="call-phone-help" className="jf-contact-help">Si tu número es de fuera de España, incluye el prefijo del país.</p>
            <div className="jf-contact-trap" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <label className="jf-contact-consent"><input type="checkbox" name="consent" required /><span>He leído la <a href="/privacy" target="_blank" rel="noopener noreferrer">política de privacidad<span className="sr-only"> (abre en otra pestaña)</span></a> y solicito que John me contacte por teléfono para esta asesoría.</span></label>
            <button type="submit" className="jf-cta" disabled={status === "sending"}><Phone size={18} aria-hidden="true" />{status === "sending" ? "Enviando solicitud…" : "Quiero que me llames"}</button>
            {status === "error" && <p className="jf-contact-error" role="alert">No hemos podido confirmar el envío. Puedes volver a intentarlo o escribirme por WhatsApp.</p>}
            <noscript><p>Activa JavaScript para enviar el formulario o utiliza el enlace de WhatsApp que aparece debajo.</p></noscript>
          </form>
          <p className="jf-contact-duration">Una conversación de 15–20 minutos, sin compromiso.</p>
        </>
      )}
      <a className="jf-contact-alternative" href={juniorWhatsAppUrl} target="_blank" rel="noopener noreferrer">¿Prefieres escribirme? Hablemos por WhatsApp<span className="sr-only"> (abre en otra pestaña)</span></a>
    </section>
  );
}

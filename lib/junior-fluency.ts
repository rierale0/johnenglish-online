import { getRedirectUrl } from "./redirects";

export type Frequency = 1 | 2 | 3;

export function getJuniorPricing(frequency: Frequency) {
  if (![1, 2, 3].includes(frequency)) throw new RangeError("Frecuencia no válida");
  const plan = (weeks: number, rate: number) => {
    const classes = weeks * frequency;
    return { weeks, rate, classes, total: classes * rate, tasks: classes / 2, reviews: classes / 4 };
  };
  return { start: plan(4, 18), continuity: plan(12, 16), savings: 12 * frequency * 2 };
}

// Reuse the site's configured public contact number without creating another source of truth.
const contact = new URL(getRedirectUrl("contact")!);
const phone = contact.searchParams.get("phone");
if (!phone || !/^\d+$/.test(phone)) throw new Error("WhatsApp de contacto no válido");
export const juniorWhatsAppUrl = `https://wa.me/${phone}?text=${encodeURIComponent("Hola, soy madre/padre/tutor y me gustaría solicitar la asesoría gratuita de 15–20 minutos para conocer el programa Junior Fluency.")}`;

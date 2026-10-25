import { ArrowUpRight } from "lucide-react";
import { juniorWhatsAppUrl } from "@/lib/junior-fluency";

export default function ConsultationLink({ placement }: { placement: string }) {
  return (
    <a className="jf-cta" href={juniorWhatsAppUrl} target="_blank" rel="noopener noreferrer" data-junior-cta={placement}>
      Solicitar asesoría gratuita <ArrowUpRight size={18} aria-hidden="true" />
      <span className="sr-only"> (WhatsApp, abre en otra pestaña)</span>
    </a>
  );
}

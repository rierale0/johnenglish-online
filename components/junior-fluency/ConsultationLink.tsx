import { ArrowUpRight } from "lucide-react";

export default function ConsultationLink({ placement }: { placement: string }) {
  return (
    <a className="jf-cta" href="#solicitar-llamada" data-junior-cta={placement}>
      Quiero que me llames <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Mail, ShieldCheck } from "lucide-react";
import CookiePreferencesButton from "@/app/global-components/CookiePreferencesButton";
import "./privacy.css";

export const metadata: Metadata = {
  title: "Política de privacidad | English with John",
  alternates: { canonical: "https://inglesconjohn.es/privacy" },
};

const sections = [
  { id: "informacion", label: "Información que recopilamos" },
  { id: "uso", label: "Uso de la información" },
  { id: "proteccion", label: "Protección de datos" },
  { id: "cookies", label: "Cookies y seguimiento" },
  { id: "derechos", label: "Tus derechos" },
  { id: "contacto", label: "Contacto" },
];

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <main id="privacy-content">
        <header className="privacy-hero">
          <div className="privacy-container privacy-hero-inner">
            <Link href="/" className="privacy-back"><ArrowLeft size={16} aria-hidden="true" />Volver al inicio</Link>
            <div className="privacy-eyebrow">English with John · Privacidad</div>
            <h1>Política de privacidad</h1>
            <p className="privacy-intro">Información sobre tus datos, el uso de cookies y cómo contactar con nosotros.</p>
            <p className="privacy-updated"><CalendarDays size={16} aria-hidden="true" />Última actualización: Octubre 2026</p>
            <div className="privacy-hero-mark" aria-hidden="true"><ShieldCheck size={90} strokeWidth={1.25} /></div>
          </div>
        </header>

        <div className="privacy-container privacy-layout">
          <aside className="privacy-sidebar">
            <nav className="privacy-index" aria-label="Índice de la política de privacidad">
              <p>En esta página</p>
              <ol>
                {sections.map((section, index) => (
                  <li key={section.id}><a href={"#" + section.id}><span aria-hidden="true">0{index + 1}</span>{section.label}</a></li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="privacy-document" aria-label="Contenido de la política de privacidad">
            <section id="informacion" className="privacy-section">
              <h2><span aria-hidden="true">01</span>Información que recopilamos</h2>
              <p>En John English Online, nos tomamos muy en serio la privacidad de nuestros usuarios. Recopilamos la siguiente información:</p>
              <ul>
                <li>Información de contacto (nombre, correo electrónico y teléfono cuando solicitas una llamada)</li>
                <li>Información de progreso en el aprendizaje</li>
                <li>Datos de uso de la plataforma</li>
              </ul>
            </section>

            <section id="uso" className="privacy-section">
              <h2><span aria-hidden="true">02</span>Uso de la información</h2>
              <p>Utilizamos la información recopilada para:</p>
              <ul>
                <li>Atender tu solicitud de asesoría de Junior Fluency y contactarte por teléfono con los datos que facilitas en el formulario.</li>
                <li>Gestionar las solicitudes de llamada mediante n8n y recibir en Telegram un aviso con el nombre y teléfono facilitados.</li>
                <li>Personalizar tu experiencia de aprendizaje</li>
                <li>Mejorar nuestros servicios</li>
                <li>Comunicarnos contigo sobre tu progreso</li>
                <li>Enviar actualizaciones importantes sobre el servicio</li>
              </ul>
            </section>

            <section id="proteccion" className="privacy-section">
              <h2><span aria-hidden="true">03</span>Protección de datos</h2>
              <p>Implementamos medidas de seguridad para proteger tu información personal:</p>
              <ul>
                <li>Encriptación de datos sensibles</li>
                <li>Acceso restringido a la información personal</li>
                <li>Monitoreo regular de seguridad</li>
              </ul>
            </section>

            <section id="cookies" className="privacy-section">
              <h2><span aria-hidden="true">04</span>Cookies y tecnologías de seguimiento</h2>
              <p>Guardamos tu elección de cookies durante 180 días en una cookie propia (ewj_marketing_v1). Puedes usar la web aunque rechaces la medición publicitaria.</p>
              <ul>
                <li>Solo si aceptas, activamos el píxel de Meta y Conversions API para medir visitas a las páginas comerciales, clics en WhatsApp y solicitudes confirmadas de asesoría de Junior Fluency y evaluar nuestros anuncios.</li>
                <li>Compartimos con Meta el tipo y momento del evento, la URL visitada, el navegador, la dirección IP y los identificadores publicitarios _fbp y _fbc, cuando están disponibles. El envío desde nuestro servidor excluye parámetros y fragmentos de la URL. Estas cookies publicitarias duran hasta 90 días.</li>
                <li>No enviamos nombres, correos, teléfonos ni datos de los niños mediante estos eventos. Un clic en WhatsApp no confirma que hayas enviado un mensaje ni solicitado una asesoría.</li>
                <li>Puedes retirar el permiso desde «Preferencias de cookies», en el pie de página. Al rechazar, detenemos los nuevos eventos y eliminamos las cookies publicitarias propias de Meta.</li>
              </ul>
              <p>Meta puede utilizar estos datos para medición y publicidad según su <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">política de privacidad<ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (abre en otra pestaña)</span></a>. Retirar el permiso no elimina los eventos compartidos previamente.</p>
            </section>

            <section id="derechos" className="privacy-section">
              <h2><span aria-hidden="true">05</span>Tus derechos</h2>
              <p>Tienes derecho a:</p>
              <ul>
                <li>Acceder a tus datos personales</li>
                <li>Solicitar la rectificación de datos incorrectos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
              </ul>
            </section>

            <section id="contacto" className="privacy-section privacy-contact">
              <h2><span aria-hidden="true">06</span>Contacto</h2>
              <p>Para cualquier consulta sobre nuestra política de privacidad, puedes contactarnos en:</p>
              <a className="privacy-email" href="mailto:informacion@inglesconjohn.es"><Mail size={20} aria-hidden="true" /><span>informacion@inglesconjohn.es</span><ArrowUpRight size={18} aria-hidden="true" /></a>
            </section>
          </article>
        </div>
      </main>

      <footer className="privacy-footer">
        <div className="privacy-container">
          <Link href="/" className="privacy-footer-brand">English with John</Link>
          <CookiePreferencesButton />
        </div>
      </footer>
    </div>
  );
}

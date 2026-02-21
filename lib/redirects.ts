/**
 * Configuración central de redirecciones.
 * Usar enlaces internos tipo /r/clave para redirigir a destinos externos o internos.
 */

const REDIRECTS: Record<string, string> = {
  /** WhatsApp: solicitar clase demo */
  demo:
    "https://api.whatsapp.com/send?phone=34613696839&text=%C2%A1Hola%2C%20John!%20Me%20gustar%C3%ADa%20solicitar%20una%20clase%20demo.",
  /** WhatsApp: contacto general */
  contact:
    "https://api.whatsapp.com/send?phone=34613696839&text=%C2%A1Hola%2C%20John!%20Me%20interesa%20mejorar%20mi%20ingl%C3%A9s%20y%20quiero%20saber%20m%C3%A1s%20sobre%20tus%20clases.%20%C2%BFPodr%C3%ADas%20darme%20m%C3%A1s%20detalles%3F",

  // Ejemplo: cualquier URL externa (descomenta y cambia a tu gusto)
  // linkedin: "https://www.linkedin.com/in/johnenlavida/",
};

/**
 * Devuelve la URL de destino para una clave de redirección, o null si no existe.
 */
export function getRedirectUrl(key: string): string | null {
  const normalized = key.toLowerCase().trim();
  return REDIRECTS[normalized] ?? null;
}

/**
 * Claves disponibles (útil para validar o listar).
 */
export function getRedirectKeys(): string[] {
  return Object.keys(REDIRECTS);
}

export { REDIRECTS };

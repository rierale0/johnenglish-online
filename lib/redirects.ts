/**
 * Configuración central de redirecciones.
 * Solo edita este archivo: añade o quita entradas en REDIRECTS.
 * - /r/clave y /clave redirigen a la URL (ej: inglesconjohn.es/katy o inglesconjohn.es/r/katy).
 */

const REDIRECTS: Record<string, string> = {
  /** WhatsApp: solicitar clase demo */
  demo:
    "https://api.whatsapp.com/send?phone=34613696839&text=%C2%A1Hola%2C%20John!%20Me%20gustar%C3%ADa%20solicitar%20una%20clase%20demo.",
  /** WhatsApp: contacto general */
  contact:
    "https://api.whatsapp.com/send?phone=34613696839&text=%C2%A1Hola%2C%20John!%20Me%20interesa%20mejorar%20mi%20ingl%C3%A9s%20y%20quiero%20saber%20m%C3%A1s%20sobre%20tus%20clases.%20%C2%BFPodr%C3%ADas%20darme%20m%C3%A1s%20detalles%3F",

  /** Notion: cursos ESL */
  katy: "https://rierale0.notion.site/Katy-ESL-Course-11961211622b8095aeb4e43dd34a1b5e",
  carolina: "https://www.notion.so/rierale0/Carolina-English-Practice-18c61211622b805faa9fc812db083de8",
  pablo: "https://rierale0.notion.site/Pablo-ESL-Course-1c061211622b80abb0d5c2b9e8c7cd81",
  luiscamacho: "https://www.notion.so/rierale0/23161211622b803bb64be9422ab96bab",
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

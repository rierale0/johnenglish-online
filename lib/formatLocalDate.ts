// lib/formatLocalDate.ts

/**
 * Convierte una fecha UTC (en string o Date) a una fecha local formateada.
 * @param dateUTC Fecha en formato ISO string o Date
 * @param locale Idioma/localización (por defecto el del navegador)
 * @returns Fecha y hora local formateada como string
 */
export function formatLocalDate(
    dateUTC: string | Date | null,
    locale?: string
  ): string {
    if (!dateUTC) return "—";
    
    const parsedDate = typeof dateUTC === "string" ? new Date(dateUTC) : dateUTC;
  
    return parsedDate.toLocaleString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  
  
  
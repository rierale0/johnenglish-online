export const MARKETING_CONSENT_COOKIE = "ewj_marketing_v1";
export const MARKETING_CONSENT_DAYS = 180;
export const META_PAGE_PATHS = ["/", "/junior-fluency"] as const;
export const META_PLACEMENTS = ["nav", "hero", "start", "continuity", "teacher", "closing", "footer", "plans", "other"] as const;

export type MetaPagePath = (typeof META_PAGE_PATHS)[number];
export type MetaPlacement = (typeof META_PLACEMENTS)[number];
export type MetaEvent = {
  eventName: "PageView" | "WhatsAppClick" | "Junior Fluency Ask";
  eventId: string;
  pagePath: MetaPagePath;
  placement?: MetaPlacement;
};

export function readCookie(cookies: string, name: string): string | undefined {
  return cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

export function hasMarketingConsent(cookies: string): boolean {
  return readCookie(cookies, MARKETING_CONSENT_COOKIE) === "granted";
}

export function isMetaPagePath(path: string): path is MetaPagePath {
  return META_PAGE_PATHS.some((allowed) => allowed === path);
}

// Only fixed page/placement labels travel from the browser. Never accept user_data,
// a destination, event time, access token, or arbitrary conversion names here.
export function parseMetaEvent(value: unknown): MetaEvent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const event = value as Record<string, unknown>;
  if (Object.keys(event).some((key) => !["eventName", "eventId", "pagePath", "placement"].includes(key))) return null;
  if (event.eventName !== "PageView" && event.eventName !== "WhatsAppClick" && event.eventName !== "Junior Fluency Ask") return null;
  if (typeof event.eventId !== "string" || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(event.eventId)) return null;
  if (typeof event.pagePath !== "string" || !isMetaPagePath(event.pagePath)) return null;
  if (event.eventName === "PageView" && event.placement !== undefined) return null;
  if (event.eventName === "WhatsAppClick" && !META_PLACEMENTS.some((allowed) => allowed === event.placement)) return null;
  if (event.eventName === "Junior Fluency Ask" && (event.pagePath !== "/junior-fluency" || event.placement !== undefined)) return null;
  return event as MetaEvent;
}

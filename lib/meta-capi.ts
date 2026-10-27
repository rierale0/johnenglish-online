import "server-only";

import { isIP } from "node:net";
import { hasMarketingConsent, parseMetaEvent, readCookie, type MetaEvent } from "./meta-events";

const MAX_BODY_BYTES = 1024;
const CANONICAL_ORIGIN = "https://inglesconjohn.es";

export function getMetaConfiguration(env: NodeJS.ProcessEnv = process.env) {
  const pixelId = env.FB_PIXEL_ID;
  const token = env.META_CAPI_ACCESS_TOKEN;
  const version = env.META_GRAPH_API_VERSION || "v26.0";
  if (!pixelId || !/^\d{5,30}$/.test(pixelId) || !token?.trim() || !/^v\d{2}\.0$/.test(version)) return null;
  const testEventCode = env.META_CAPI_TEST_EVENT_CODE;
  if (testEventCode && !/^TEST\d{1,20}$/.test(testEventCode)) return null;
  return { pixelId, token, version, testEventCode };
}

export function isAllowedMetaRequest(request: Request, env: NodeJS.ProcessEnv = process.env): boolean {
  const origin = request.headers.get("origin");
  const allowedOrigins = new Set([CANONICAL_ORIGIN, "https://www.inglesconjohn.es"]);
  // Trust deployment configuration, never a client-supplied Host/forwarded-host.
  for (const hostname of [env.VERCEL_URL, env.VERCEL_BRANCH_URL]) {
    if (hostname && /^[a-z0-9-]+\.vercel\.app$/i.test(hostname)) allowedOrigins.add(`https://${hostname}`);
  }
  const internal = new URL(request.url);
  if (env.NODE_ENV === "development" && ["localhost", "127.0.0.1"].includes(internal.hostname)) {
    for (const hostname of ["localhost", "127.0.0.1"]) allowedOrigins.add(`http://${hostname}${internal.port ? `:${internal.port}` : ""}`);
  }
  return origin !== null && allowedOrigins.has(origin)
    && !["cross-site", "same-site"].includes(request.headers.get("sec-fetch-site") || "")
    && request.headers.get("content-type")?.split(";")[0].trim() === "application/json"
    && hasMarketingConsent(request.headers.get("cookie") || "");
}

export async function readMetaEvent(request: Request): Promise<MetaEvent | null> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES || !request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    return parseMetaEvent(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

function matchingCookie(cookies: string, name: string): string | undefined {
  const value = readCookie(cookies, name);
  return value && /^fb\.\d{1,3}\.\d{13}\.[A-Za-z0-9_-]{1,200}$/.test(value) ? value : undefined;
}

export function buildMetaServerEvent(event: MetaEvent, headers: Headers, now = Date.now(), vercel = process.env.VERCEL === "1") {
  const cookies = headers.get("cookie") || "";
  // Vercel overwrites this header. Do not trust arbitrary forwarded IPs elsewhere.
  const forwardedIp = vercel ? headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() : undefined;
  return {
    event_name: event.eventName,
    event_id: event.eventId,
    event_time: Math.floor(now / 1000),
    action_source: "website",
    event_source_url: `${CANONICAL_ORIGIN}${event.pagePath}`,
    user_data: {
      client_user_agent: headers.get("user-agent")?.slice(0, 512) || undefined,
      client_ip_address: forwardedIp && isIP(forwardedIp) ? forwardedIp : undefined,
      fbp: matchingCookie(cookies, "_fbp"),
      fbc: matchingCookie(cookies, "_fbc"),
    },
    custom_data: event.placement ? { placement: event.placement } : undefined,
  };
}

export async function sendMetaEvent(
  event: ReturnType<typeof buildMetaServerEvent>,
  config: NonNullable<ReturnType<typeof getMetaConfiguration>>,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const response = await fetcher(`https://graph.facebook.com/${config.version}/${config.pixelId}/events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ data: [event], ...(config.testEventCode ? { test_event_code: config.testEventCode } : {}) }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    const result = await response.json().catch(() => null);
    if (response.ok && result?.events_received === 1) return true;
    // Meta error messages can echo request data. Log status and numeric code only.
    console.error("Meta CAPI delivery failed", { status: response.status, code: typeof result?.error?.code === "number" ? result.error.code : undefined });
  } catch {
    console.error("Meta CAPI delivery unavailable");
  }
  return false;
}

// Best-effort per-instance protection, bounded in memory. Meta also deduplicates
// by event_name + event_id across browser/server and serverless instances.
export function createMetaEventGuard() {
  const clients = new Map<string, { count: number; expires: number }>();
  const events = new Map<string, number>();
  return (client: string, event: MetaEvent, now = Date.now()): "allowed" | "duplicate" | "limited" => {
    for (const [key, entry] of clients) if (entry.expires <= now) clients.delete(key);
    for (const [key, expires] of events) if (expires <= now) events.delete(key);
    const eventKey = `${event.eventName}:${event.eventId}`;
    if (events.has(eventKey)) return "duplicate";
    const usage = clients.get(client) || { count: 0, expires: now + 60_000 };
    if (usage.count >= 60 || clients.size >= 10_000 || events.size >= 10_000) return "limited";
    usage.count++;
    clients.set(client, usage);
    events.set(eventKey, now + 60_000);
    return "allowed";
  };
}

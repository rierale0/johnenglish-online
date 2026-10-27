import { buildMetaServerEvent, createMetaEventGuard, getMetaConfiguration, isAllowedMetaRequest, readMetaEvent, sendMetaEvent } from "@/lib/meta-capi";

export const runtime = "nodejs";
export const maxDuration = 10;
const guard = createMetaEventGuard();
const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (!isAllowedMetaRequest(request)) return new Response(null, { status: 403, headers });
  const event = await readMetaEvent(request);
  if (!event) return new Response(null, { status: 400, headers });
  const config = getMetaConfiguration();
  if (!config) return new Response(null, { status: 204, headers });
  const serverEvent = buildMetaServerEvent(event, request.headers);
  const decision = guard(serverEvent.user_data.client_ip_address || "unknown", event);
  if (decision === "limited") return new Response(null, { status: 429, headers });
  if (decision === "duplicate") return new Response(null, { status: 202, headers });
  const delivered = await sendMetaEvent(serverEvent, config);
  return new Response(null, { status: delivered ? 202 : 502, headers });
}

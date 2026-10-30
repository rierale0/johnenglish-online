import { validateConsultation } from "@/lib/junior-consultation";

const reply = (status: number, accepted = false) => Response.json({ accepted }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const internal = new URL(request.url);
  const origins = new Set([internal.origin, "https://inglesconjohn.es", "https://www.inglesconjohn.es"]);
  if (process.env.NODE_ENV === "development" && ["localhost", "127.0.0.1", "0.0.0.0"].includes(internal.hostname)) {
    for (const host of ["localhost", "127.0.0.1"]) origins.add(`http://${host}:${internal.port || "80"}`);
  }
  if (!origins.has(request.headers.get("origin") || "") || request.headers.get("sec-fetch-site") === "cross-site") return reply(403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply(415);
  // Bound the actual body, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return reply(400);
  let body = "";
  let size = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return reply(413); }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } catch { return reply(400); }
  let input: unknown;
  try { input = JSON.parse(body); } catch { return reply(400); }
  const lead = validateConsultation(input);
  if (!lead) return reply(400);
  const destination = process.env.JUNIOR_CONSULTATION_WEBHOOK_URL;
  const token = process.env.JUNIOR_CONSULTATION_WEBHOOK_TOKEN;
  if (!destination) return reply(503);
  try {
    if (new URL(destination).protocol !== "https:") return reply(503);
    const response = await fetch(destination, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), "Idempotency-Key": lead.submissionId },
      body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(12000),
      redirect: "error",
    });
    if (!response.ok) return reply(502);
    const receipt = await response.json();
    // n8n acknowledges only after Telegram has accepted the notification.
    if (receipt.accepted !== true) return reply(502);
    return reply(200, true);
  } catch { return reply(502); }
}

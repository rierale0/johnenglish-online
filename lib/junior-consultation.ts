export function validateConsultation(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (typeof data.name !== "string" || typeof data.phone !== "string" || data.consent !== true) return null;
  const name = data.name.trim();
  if (name.length < 2 || name.length > 100 || Array.from(name).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return null;
  if (data.phone.length > 25 || !/^[+\d ()-]+$/.test(data.phone)) return null;
  let phone = data.phone.replace(/[ ()-]/g, "");
  if (phone.startsWith("00")) phone = `+${phone.slice(2)}`;
  if (/^[6789]\d{8}$/.test(phone)) phone = `+34${phone}`;
  if (!/^\+[1-9]\d{6,14}$/.test(phone)) return null;
  if (typeof data.submissionId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.submissionId)) return null;
  if (typeof data.website !== "string" || data.website !== "") return null;
  return { name, phone, consent: true, submissionId: data.submissionId, source: "junior-fluency", consentVersion: "callback-v1" };
}

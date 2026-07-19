import crypto from "crypto";

function getSecret() {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s) throw new Error("ADMIN_JWT_SECRET env var not set");
  return s;
}

export function signAdminToken(payload: Record<string, unknown>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyAdminToken(token: string): Record<string, unknown> | null {
  try {
    const dot = token.lastIndexOf(".");
    if (dot < 1) return null;
    const data = token.slice(0, dot);
    const sig  = token.slice(dot + 1);
    const expected = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as Record<string, unknown>;
    if (typeof payload.exp === "number" && payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

// WhatsApp notifications via AiSensy Business API
// Configure AISENSY_API_KEY in .env to enable

export type WhatsAppNotifyPayload = {
  phone: string;      // E.164 without '+', e.g. "919876543210"
  campaignName: string;
  userName: string;
  templateParams: string[];
};

export async function sendWhatsAppNotification(payload: WhatsAppNotifyPayload) {
  const apiKey = process.env.AISENSY_API_KEY;
  if (!apiKey) {
    console.warn("[WhatsApp] AISENSY_API_KEY not set — skipping notification");
    return { skipped: true };
  }

  const phone = payload.phone.replace(/\D/g, "");
  const destination = phone.startsWith("91") ? phone : `91${phone}`;

  const res = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey,
      campaignName: payload.campaignName,
      destination,
      userName: payload.userName,
      templateParams: payload.templateParams,
      media: {},
      buttons: [],
      carouselCards: [],
      location: {},
    }),
  });

  if (!res.ok) {
    console.error("[WhatsApp] AiSensy API error:", await res.text());
    return { error: true };
  }

  return { sent: true };
}

import { WHATSAPP_NUMBER } from "./constants";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function bookingMessage(
  checkin: string,
  checkout: string,
  guests: string,
  roomType: string
): string {
  return `Hi! I'd like to check availability at VMP Villa.\n\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}\nRoom type: ${roomType}\n\nPlease confirm if a room is available.`;
}

export function enquiryMessage(
  name: string,
  phone: string,
  checkin: string,
  checkout: string,
  roomType: string,
  guests: string,
  special: string
): string {
  const lines = [
    `Hello! I'm ${name} and I'd like to make a booking enquiry at VMP Villa.`,
    "",
    `Phone: ${phone}`,
    `Check-in: ${checkin}`,
    `Check-out: ${checkout}`,
    `Room type: ${roomType}`,
    `Guests: ${guests}`,
  ];
  if (special.trim()) lines.push(`Special requests: ${special.trim()}`);
  return lines.join("\n");
}

export const WA_CHAT_URL = buildWhatsAppUrl(
  "Hi! I saw your website and would like to know more about VMP Villa."
);

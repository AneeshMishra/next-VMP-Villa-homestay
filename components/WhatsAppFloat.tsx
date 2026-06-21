"use client";
import { WA_CHAT_URL } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  return (
    <a href={WA_CHAT_URL} target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 z-[999] flex items-center gap-2.5 text-white text-sm font-semibold rounded-full transition-all duration-200 hover:-translate-y-1" style={{ background: "#25D366", padding: "14px 20px", boxShadow: "0 6px 24px rgba(37,211,102,0.35)" }} aria-label="Chat on WhatsApp">
      <span className="text-[22px] leading-none">💬</span>
      <span className="whitespace-nowrap hidden sm:inline">Chat with us</span>
    </a>
  );
}

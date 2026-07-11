import type { Metadata } from "next";
import Link from "next/link";
import { WA_CHAT_URL } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "VMP Villa Home Stay cancellation and refund policy. Free cancellation up to 48 hours before check-in.",
};

const TIERS = [
  { timing: "48+ hours before check-in", refund: "100% refund", color: "#3a6b4a", bg: "rgba(58,107,74,0.08)", icon: "✅" },
  { timing: "24–48 hours before check-in", refund: "50% refund", color: "#e8762b", bg: "rgba(232,118,43,0.08)", icon: "⚠️" },
  { timing: "Less than 24 hours", refund: "No refund", color: "#b9402b", bg: "rgba(185,64,43,0.08)", icon: "❌" },
  { timing: "No-show", refund: "Full amount charged", color: "#b9402b", bg: "rgba(185,64,43,0.08)", icon: "❌" },
];

const SECTIONS = [
  { title: "How to Cancel", body: "To cancel a booking, contact Aneesh directly via WhatsApp or email with your full name, booking dates, and the word ‘CANCEL’. We will confirm the cancellation and process any eligible refund within 5 business days." },
  { title: "Refund Method", body: "Refunds are processed back to the original payment method. If you paid via bank transfer or UPI, please provide your account details at the time of cancellation. Allow 5–7 business days for the refund to appear in your account." },
  { title: "Date Changes", body: "If you need to change your dates (not cancel), please WhatsApp us as early as possible. We will always try to accommodate date changes at no charge, subject to availability." },
  { title: "Force Majeure & Special Circumstances", body: "In cases of extreme circumstances — serious illness (with medical documentation), natural disaster, or government travel restrictions — we will work with you individually to find a fair solution." },
  { title: "Bookings via OTAs", body: "If you booked through Booking.com, MakeMyTrip, TripAdvisor, or any other online travel agency, their cancellation policy applies — not this one. Please refer to your booking confirmation from the OTA." },
];

export default function CancellationPage() {
  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[760px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">Legal</div>
          <h1 className="font-display font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>Cancellation Policy</h1>
          <p className="text-white/60 text-[14px]">Last updated: June 2025</p>
        </div>
      </div>
      <div className="bg-cream" style={{ padding: "64px 40px 80px" }}>
        <div className="max-w-[760px] mx-auto">
          <h2 className="font-display text-[24px] font-bold text-ink mb-6">Refund Schedule</h2>
          <div className="flex flex-col gap-4 mb-12">
            {TIERS.map((tier) => (
              <div key={tier.timing} className="flex items-center gap-5 p-5 rounded-xl border" style={{ background: tier.bg, borderColor: tier.color + "33" }}>
                <div className="text-2xl shrink-0">{tier.icon}</div>
                <div className="flex-1"><div className="font-semibold text-ink text-[15px]">{tier.timing}</div></div>
                <div className="font-bold text-[15px] shrink-0" style={{ color: tier.color }}>{tier.refund}</div>
              </div>
            ))}
          </div>
          {SECTIONS.map((s) => (
            <div key={s.title} className="mb-8">
              <h2 className="font-display text-xl font-bold text-ink mb-3">{s.title}</h2>
              <p className="text-muted text-[15px] leading-[1.8]">{s.body}</p>
            </div>
          ))}
          <div className="rounded-2xl p-6 mt-10" style={{ background: "var(--marble)" }}>
            <div className="font-semibold text-ink mb-2">Need to cancel or change your booking?</div>
            <p className="text-muted text-sm mb-4">WhatsApp Aneesh directly — he will handle it personally and quickly.</p>
            <a href={WA_CHAT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-150">💬 WhatsApp Aneesh</a>
          </div>
          <div className="mt-8 pt-8 border-t border-marble flex gap-6">
            <Link href="/terms" className="text-saffron hover:underline font-medium text-sm">← Terms & Conditions</Link>
            <Link href="/faq" className="text-saffron hover:underline font-medium text-sm">FAQ →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

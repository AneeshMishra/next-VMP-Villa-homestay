import type { Metadata } from "next";
import Link from "next/link";
import BookingBar from "@/components/BookingBar";

export const metadata: Metadata = {
  title: "Book a Room",
  description: "Book a room at VMP Villa Home Stay, Agra. Check availability via WhatsApp — we reply within 30 minutes. Online calendar coming soon.",
};

const PHASE2_FEATURES = [
  { icon: "📅", label: "Live availability calendar" },
  { icon: "💳", label: "Razorpay — UPI, cards, net banking" },
  { icon: "📧", label: "Instant booking confirmation email" },
  { icon: "📱", label: "SMS reminders via MSG91" },
  { icon: "🎁", label: "Seasonal deals & early-bird discounts" },
  { icon: "🔔", label: "Pre-arrival & post-checkout follow-ups" },
];

export default function BookPage() {
  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">Book a Room</div>
          <h1 className="font-display font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(36px, 6vw, 60px)" }}>
            Check Availability & <em className="not-italic text-saffron">Reserve Your Spot</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            Online booking is coming very soon. For now, use the form below to send a WhatsApp
            message directly to Aneesh — he replies within 30 minutes.
          </p>
        </div>
      </div>

      <div style={{ background: "var(--ink)", paddingBottom: 48 }}>
        <BookingBar />
      </div>

      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div className="max-w-[760px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-6 px-4 py-2 rounded-full" style={{ background: "rgba(232,118,43,0.1)", border: "1px solid rgba(232,118,43,0.25)", color: "var(--saffron)" }}>
            🚀 Phase 2 — Coming Soon
          </div>
          <h2 className="font-display text-[32px] font-bold text-ink mb-4">Online Booking Engine</h2>
          <p className="text-muted text-[15px] leading-[1.8] mb-10 max-w-[540px] mx-auto">
            We&apos;re building a live availability calendar with instant payment — so you can
            book a room at VMP Villa in under 2 minutes, any time of day.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left mb-10">
            {PHASE2_FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-marble">
                <span className="text-xl">{f.icon}</span>
                <span className="text-sm font-medium text-ink">{f.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone">Until then, WhatsApp is the fastest way to book — Aneesh replies in under 30 minutes.</p>
        </div>
      </div>

      <div className="bg-marble" style={{ padding: "64px 40px" }}>
        <div className="max-w-[1100px] mx-auto grid gap-10 items-center" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <h2 className="font-display text-[28px] font-bold text-ink mb-4">Book Directly — No Commission</h2>
            <p className="text-muted text-[15px] leading-[1.7] mb-6">Booking via WhatsApp directly saves you the 15–20% OTA commission.</p>
            <div className="flex flex-col gap-2.5 text-sm text-muted">
              {["✅ Best price guaranteed", "✅ Flexible check-in / check-out times", "✅ Special requests accommodated", "✅ Personal response within 30 minutes"].map((line) => (<div key={line}>{line}</div>))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/contact" className="flex items-center gap-4 bg-white rounded-xl p-5 border border-marble hover:shadow-md transition-shadow">
              <span className="text-3xl">💬</span>
              <div><div className="font-semibold text-ink">WhatsApp Enquiry</div><div className="text-sm text-muted">Fastest — Aneesh replies in &lt; 30 min</div></div>
              <span className="ml-auto text-stone">→</span>
            </Link>
            <Link href="/rooms" className="flex items-center gap-4 bg-white rounded-xl p-5 border border-marble hover:shadow-md transition-shadow">
              <span className="text-3xl">🛏️</span>
              <div><div className="font-semibold text-ink">Compare Rooms</div><div className="text-sm text-muted">Deluxe AC · Standard AC · Dormitory</div></div>
              <span className="ml-auto text-stone">→</span>
            </Link>
            <Link href="/faq" className="flex items-center gap-4 bg-white rounded-xl p-5 border border-marble hover:shadow-md transition-shadow">
              <span className="text-3xl">❓</span>
              <div><div className="font-semibold text-ink">Common Questions</div><div className="text-sm text-muted">Check-in, cancellation, pets & more</div></div>
              <span className="ml-auto text-stone">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { WA_CHAT_URL } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Guest Portal",
  description: "Manage your booking at VMP Villa Home Stay. View your reservation, request changes, or contact us. Online portal coming soon.",
};

const PORTAL_FEATURES = [
  { icon: "📋", title: "View Your Booking", desc: "Access your reservation details, room type, and stay dates." },
  { icon: "💳", title: "Download Receipt", desc: "Get a PDF invoice or GST receipt for your stay." },
  { icon: "✏️", title: "Request Changes", desc: "Modify dates, room type, or add special requests." },
  { icon: "🚗", title: "Arrange Transfers", desc: "Book airport or station pickup directly from your portal." },
  { icon: "🍳", title: "Order Breakfast", desc: "Add Bhavna’s home-cooked breakfast to your booking." },
  { icon: "⭐", title: "Leave a Review", desc: "Share your experience after checkout." },
];

export default function GuestPortalPage() {
  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">My Booking</div>
          <h1 className="font-display font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(36px, 6vw, 60px)" }}>
            Guest <em className="not-italic text-saffron">Portal</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            Your personal booking dashboard — view reservations, download receipts, and manage your stay at VMP Villa. Launching soon.
          </p>
        </div>
      </div>

      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div className="max-w-[760px] mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-6 px-4 py-2 rounded-full" style={{ background: "rgba(232,118,43,0.1)", border: "1px solid rgba(232,118,43,0.25)", color: "var(--saffron)" }}>
            🚀 Phase 2 — Coming Soon
          </div>
          <h2 className="font-display text-[32px] font-bold text-ink mb-4">Your Booking Dashboard</h2>
          <p className="text-muted text-[15px] leading-[1.8] max-w-[540px] mx-auto">
            We&apos;re building a full guest portal powered by Supabase — so you can manage every aspect of your VMP Villa stay without needing to WhatsApp us (though Aneesh loves hearing from guests).
          </p>
        </div>
        <div className="max-w-[1100px] mx-auto grid gap-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {PORTAL_FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-marble opacity-60">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold text-ink text-[15px] mb-1.5">{f.title}</div>
              <p className="text-muted text-sm leading-[1.6]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-marble" style={{ padding: "64px 40px" }}>
        <div className="max-w-[760px] mx-auto text-center">
          <h2 className="font-display text-[26px] font-bold text-ink mb-4">Already have a booking?</h2>
          <p className="text-muted text-[15px] leading-[1.7] mb-8">Until the portal launches, WhatsApp or email Aneesh directly — he manages all reservations personally and responds within 30 minutes.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href={WA_CHAT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white font-semibold px-8 py-4 rounded-lg transition-all duration-150">💬 WhatsApp Aneesh</a>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white border border-marble text-ink hover:border-saffron font-semibold px-8 py-4 rounded-lg transition-all duration-150">📧 Send Email</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

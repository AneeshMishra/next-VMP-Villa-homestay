import type { Metadata } from "next";
import Link from "next/link";
import { WA_CHAT_URL } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Special Offers & Deals",
  description: "Seasonal offers and deals at VMP Villa Home Stay, Agra. Book direct for the best price.",
};

const CURRENT_OFFERS = [
  { badge: "Always On", badgeColor: "#3a6b4a", title: "Direct Booking Discount", desc: "Book via WhatsApp or our website and pay 0% OTA commission. The saving comes back to you.", saving: "Save 15–20%", cta: "Book via WhatsApp", href: WA_CHAT_URL, external: true },
  { badge: "Families", badgeColor: "#e8762b", title: "Kids Stay Free", desc: "Children under 5 years share a parent’s room at no extra charge. Extra mattress or cot available on request.", saving: "Free for under-5s", cta: "Enquire Now", href: "/contact", external: false },
  { badge: "Long Stay", badgeColor: "#2b7bb9", title: "Weekly Rate", desc: "Staying 7 nights or more? WhatsApp Aneesh for our weekly rate — typically 10% off the nightly price.", saving: "~10% off", cta: "Ask Aneesh", href: WA_CHAT_URL, external: true },
];

const UPCOMING_FEATURES = [
  { icon: "⏳", label: "Live countdown timers for flash deals" },
  { icon: "🎉", label: "Festive season packages (Diwali, Holi)" },
  { icon: "🌞", label: "Summer & monsoon early-bird rates" },
  { icon: "💌", label: "Exclusive newsletter-subscriber deals" },
  { icon: "🔄", label: "Returning guest loyalty discounts" },
  { icon: "📅", label: "Last-minute availability alerts" },
];

export default function OffersPage() {
  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">Special Offers</div>
          <h1 className="font-display font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(36px, 6vw, 60px)" }}>
            Deals & <em className="not-italic text-saffron">Seasonal Offers</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            The best deal at VMP Villa is always booking direct. No middleman — the saving comes back to you.
          </p>
        </div>
      </div>

      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[28px] font-bold text-ink mb-2">Current Offers</h2>
          <p className="text-muted mb-10">Available now — no promo code needed.</p>
          <div className="flex flex-col gap-6">
            {CURRENT_OFFERS.map((offer) => (
              <div key={offer.title} className="offer-card bg-white rounded-2xl p-8 border border-marble flex items-start gap-8 transition-shadow duration-200 hover:shadow-md">
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full text-white mb-4" style={{ background: offer.badgeColor }}>{offer.badge}</span>
                  <h3 className="font-display text-[22px] font-bold text-ink mb-3">{offer.title}</h3>
                  <p className="text-muted text-[15px] leading-[1.7]">{offer.desc}</p>
                </div>
                <div className="offer-card-right shrink-0 text-right flex flex-col items-end gap-4">
                  <div>
                    <div className="font-display text-[22px] font-bold text-leaf">{offer.saving}</div>
                    <div className="text-xs text-stone">vs. OTA price</div>
                  </div>
                  {offer.external ? (
                    <a href={offer.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-150 whitespace-nowrap">{offer.cta} →</a>
                  ) : (
                    <Link href={offer.href} className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-150 whitespace-nowrap">{offer.cta} →</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-marble" style={{ padding: "80px 40px" }}>
        <div className="max-w-[760px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-6 px-4 py-2 rounded-full" style={{ background: "rgba(232,118,43,0.1)", border: "1px solid rgba(232,118,43,0.25)", color: "var(--saffron)" }}>
            🚀 Phase 2 — Coming Soon
          </div>
          <h2 className="font-display text-[28px] font-bold text-ink mb-4">Seasonal Deals Engine</h2>
          <p className="text-muted text-[15px] leading-[1.8] mb-10 max-w-[520px] mx-auto">We&apos;re building a full offers system with live countdown timers, festive packages, and loyalty rewards for returning guests.</p>
          <div className="grid grid-cols-2 gap-3 text-left">
            {UPCOMING_FEATURES.map((f) => (<div key={f.label} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-marble"><span className="text-xl">{f.icon}</span><span className="text-sm font-medium text-ink">{f.label}</span></div>))}
          </div>
        </div>
      </div>

      <div className="bg-ink text-white text-center" style={{ padding: "64px 40px" }}>
        <h2 className="font-display text-[28px] font-bold mb-4">Don&apos;t miss a deal</h2>
        <p className="text-white/60 mb-8 max-w-[440px] mx-auto text-[15px]">WhatsApp Aneesh and ask to be added to the VMP Villa deals list.</p>
        <a href={WA_CHAT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white font-semibold px-10 py-4 rounded-lg transition-all duration-150">💬 WhatsApp for Deals</a>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .offer-card { flex-direction: column !important; gap: 20px !important; padding: 24px !important; }
          .offer-card-right { align-items: flex-start !important; text-align: left !important; width: 100% !important; flex-direction: row !important; justify-content: space-between !important; flex-wrap: wrap !important; gap: 12px !important; }
          .offer-card-right > div { text-align: left !important; }
          .offer-card-right a { flex: 1 !important; justify-content: center !important; min-width: 140px !important; }
        }
        @media (max-width: 480px) {
          .offer-card-right { flex-direction: column !important; }
          .offer-card-right a { width: 100% !important; }
        }
        @media (max-width: 500px) {
          div[style*="padding: 64px 40px 48px"] { padding: 40px 20px 32px !important; }
          div[style*="padding: 80px 40px"] { padding: 48px 20px !important; }
          .grid-cols-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

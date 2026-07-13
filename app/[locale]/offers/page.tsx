import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WA_CHAT_URL } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Special Offers & Deals",
  description: "Seasonal offers and deals at VMP Villa Home Stay, Agra. Book direct for the best price.",
};

const OFFER_META = [
  { badgeColor: "#3a6b4a", href: WA_CHAT_URL, external: true },
  { badgeColor: "#e8762b", href: "/contact", external: false },
  { badgeColor: "#2b7bb9", href: WA_CHAT_URL, external: true },
];

export default async function OffersPage() {
  const t = await getTranslations("offers");

  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">{t("eyebrow")}</div>
          <h1 className="font-display font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(36px, 6vw, 60px)" }}>
            {t("heading")} <em className="not-italic text-saffron">{t("headingAccent")}</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">{t("subtitle")}</p>
        </div>
      </div>

      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[28px] font-bold text-ink mb-2">{t("currentTitle")}</h2>
          <p className="text-muted mb-10">{t("currentSub")}</p>
          <div className="flex flex-col gap-6">
            {OFFER_META.map((offer, i) => (
              <div key={i} className="offer-card bg-white rounded-2xl p-8 border border-marble flex items-start gap-8 transition-shadow duration-200 hover:shadow-md">
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full text-white mb-4" style={{ background: offer.badgeColor }}>{t(`o${i}badge`)}</span>
                  <h3 className="font-display text-[22px] font-bold text-ink mb-3">{t(`o${i}title`)}</h3>
                  <p className="text-muted text-[15px] leading-[1.7]">{t(`o${i}desc`)}</p>
                </div>
                <div className="offer-card-right shrink-0 text-right flex flex-col items-end gap-4">
                  <div>
                    <div className="font-display text-[22px] font-bold text-leaf">{t(`o${i}saving`)}</div>
                    <div className="text-xs text-stone">{t("vsOta")}</div>
                  </div>
                  {offer.external ? (
                    <a href={offer.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-150 whitespace-nowrap">{t(`o${i}cta`)} →</a>
                  ) : (
                    <Link href={offer.href} className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-150 whitespace-nowrap">{t(`o${i}cta`)} →</Link>
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
            {t("comingSoonBadge")}
          </div>
          <h2 className="font-display text-[28px] font-bold text-ink mb-4">{t("comingSoonTitle")}</h2>
          <p className="text-muted text-[15px] leading-[1.8] mb-10 max-w-[520px] mx-auto">{t("comingSoonSub")}</p>
          <div className="grid grid-cols-2 gap-3 text-left">
            {[0,1,2,3,4,5].map((i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-marble">
                <span className="text-sm font-medium text-ink">{t(`f${i}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-ink text-white text-center" style={{ padding: "64px 40px" }}>
        <h2 className="font-display text-[28px] font-bold mb-4">{t("ctaTitle")}</h2>
        <p className="text-white/60 mb-8 max-w-[440px] mx-auto text-[15px]">{t("ctaSub")}</p>
        <a href={WA_CHAT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white font-semibold px-10 py-4 rounded-lg transition-all duration-150">{t("ctaBtn")}</a>
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

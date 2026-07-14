import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/ScrollReveal";
import { DISTANCES, ADDRESS, GOOGLE_MAPS_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Location & Map",
  description:
    "VMP Villa is located in Tajganj, Agra — 6 km from Taj Mahal East Gate and 8 km from Agra Fort. Get directions and transport tips.",
};

const TRANSPORT_TIPS: number[][] = [[0, 1, 2], [0, 1], [0, 1, 2], [0, 1, 2]];

export default async function LocationPage() {
  const t = await getTranslations("locationPage");

  return (
    <div>
      {/* Header */}
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
            {t("eyebrow")}
          </div>
          <h1
            className="font-display font-black text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(36px, 6vw, 60px)" }}
          >
            {t("heading")}{" "}
            <em className="not-italic text-saffron">{t("headingAccent")}</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            {t("subtitle")}
          </p>
          <div className="mt-5 text-white/40 text-sm">📍 {ADDRESS}</div>
        </div>
      </div>

      {/* Map + distances */}
      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div
          className="max-w-[1100px] mx-auto grid gap-10 items-start location-grid"
          style={{ gridTemplateColumns: "1fr 1.4fr" }}
        >
          {/* Distances */}
          <div>
            <h2 className="font-display text-[28px] font-bold mb-2">{t("nearbyTitle")}</h2>
            <p className="text-muted mb-8">{t("nearbySub")}</p>

            <div className="flex flex-col gap-3 mb-8">
              {DISTANCES.map((d, i) => (
                <ScrollReveal key={i} delay={i * 60}>
                  <div
                    className="flex items-center gap-3.5 py-3.5 px-4 rounded-xl bg-white border border-marble"
                    style={{ borderLeft: "4px solid var(--saffron)" }}
                  >
                    <span className="text-xl shrink-0">{d.icon}</span>
                    <span className="text-sm font-medium text-ink flex-1">{t(`d${i}`)}</span>
                    <span className="text-[13px] font-semibold text-saffron whitespace-nowrap">{d.value}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white font-semibold px-8 py-4 rounded-lg transition-all duration-150 hover:-translate-y-px"
            >
              📍 {t("openMaps")}
            </a>
          </div>

          {/* Map placeholder */}
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{ height: 480, background: "#2a2420" }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/60">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 40% 60%, rgba(58,107,74,0.3) 0%, transparent 50%)",
                }}
              />
              <div className="text-[52px] relative z-10">📍</div>
              <div className="relative z-10 text-center px-6">
                <strong className="text-white/90 block text-lg mb-1">VMP Villa Home Stay</strong>
                <span className="text-sm">{ADDRESS}</span>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {t("getDirections")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Transport guide */}
      <div className="bg-marble" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[32px] font-bold mb-2 text-center">
            {t("transportTitle")}
          </h2>
          <p className="text-muted text-center mb-12">{t("transportSub")}</p>

          <div className="grid grid-cols-2 gap-6 transport-grid">
            {TRANSPORT_TIPS.map((tips, mi) => (
              <ScrollReveal key={mi} delay={mi * 80}>
                <div className="bg-white rounded-2xl p-6 border border-marble">
                  <div className="text-lg font-bold mb-4">{t(`t${mi}mode`)}</div>
                  <ul className="flex flex-col gap-2.5">
                    {tips.map((ti) => (
                      <li key={ti} className="flex items-start gap-2 text-sm text-muted">
                        <span className="text-saffron mt-0.5 shrink-0">→</span>
                        {t(`t${mi}t${ti}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .location-grid {
            grid-template-columns: 1fr !important;
          }
          .transport-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          div[style*="padding: 64px 40px 48px"] { padding: 48px 20px 36px !important; }
          div[style*="padding: 80px 40px"] { padding: 48px 20px !important; }
        }
      `}</style>
    </div>
  );
}

"use client";

import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/ScrollReveal";

const CORE_ICONS = ["📶", "🍳", "🅿️", "🌿", "🔥", "🧺", "🚗", "🗺️"] as const;
const EXTRA_ICONS = ["🏡", "🌡️", "🧴", "📱", "🌙", "🧊", "🪴", "⚡"] as const;
const ECO_INDICES = [0, 1, 2, 3, 4, 5] as const;

export default function FacilitiesPage() {
  const t = useTranslations("facilitiesPage");

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
        </div>
      </div>

      {/* Core facilities */}
      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[28px] font-bold mb-2">{t("coreTitle")}</h2>
          <p className="text-muted mb-10">{t("coreSub")}</p>

          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {CORE_ICONS.map((icon, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="bg-white rounded-2xl p-6 border border-marble text-center transition-shadow duration-200 hover:shadow-md">
                  <div className="text-4xl mb-4">{icon}</div>
                  <div className="font-semibold text-[15px] mb-1.5">{t(`c${i}n`)}</div>
                  <div className="text-xs text-muted">{t(`c${i}d`)}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Extra facilities */}
      <div className="bg-marble" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[28px] font-bold mb-2">{t("alsoTitle")}</h2>
          <p className="text-muted mb-10">{t("alsoSub")}</p>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {EXTRA_ICONS.map((icon, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div className="bg-white rounded-xl p-5 flex items-start gap-3 border border-marble/50">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: "var(--leaf-l)" }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div className="font-semibold text-[14px] mb-0.5">{t(`e${i}n`)}</div>
                    <div className="text-xs text-muted">{t(`e${i}d`)}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Eco section */}
      <div className="bg-leaf text-white" style={{ padding: "64px 40px" }}>
        <div className="max-w-[760px] mx-auto text-center">
          <div className="text-5xl mb-6">🌿</div>
          <h2 className="font-display text-[32px] font-bold mb-4">{t("ecoTitle")}</h2>
          <p className="text-white/70 text-[15px] leading-[1.8] mb-8">{t("ecoSub")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {ECO_INDICES.map((i) => (
              <span
                key={i}
                className="text-sm font-medium px-4 py-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                {t(`eco${i}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          div[style*="padding: 64px 40px 48px"] { padding: 48px 20px 40px !important; }
          div[style*="padding: 80px 40px"] { padding: 48px 20px !important; }
          div[style*="padding: 64px 40px"] { padding: 48px 20px !important; }
        }
      `}</style>
    </div>
  );
}

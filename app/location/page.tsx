import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import { DISTANCES, ADDRESS, GOOGLE_MAPS_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Location & Map",
  description:
    "VMP Villa is located in Tajganj, Agra — 4.2 km from the Taj Mahal and 2.8 km from Agra Fort. Get directions and transport tips.",
};

const TRANSPORT = [
  { mode: "🚂 Train", tips: ["Agra Cantt. (AGC) — 3.1 km, 10 mins", "Rajdhani, Shatabdi & Gatimaan from Delhi (2 hrs)", "Auto-rickshaw from station: ₹100–150"] },
  { mode: "🚌 Bus", tips: ["ISBT Agra is 6 km away", "Idgah Bus Stand — regular buses from Delhi, Jaipur"] },
  { mode: "✈️ Fly", tips: ["Agra Airport (AGR) is 7 km away", "Nearest major airport: Delhi IGI (200 km, ~4 hr drive)", "We offer airport pickup for ₹400 (book in advance)"] },
  { mode: "🚗 Drive", tips: ["From Delhi via Yamuna Expressway: ~3.5 hours", "From Jaipur via NH48: ~4 hours", "Free parking at VMP Villa for all guests"] },
];

export default function LocationPage() {
  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">Find Us</div>
          <h1 className="font-display font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(36px, 6vw, 60px)" }}>
            Right in the <em className="not-italic text-saffron">Heart of Agra</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">Tucked in a quiet residential lane in Tajganj — walkable to the Taj&apos;s south gate, yet away from the tourist noise.</p>
          <div className="mt-5 text-white/40 text-sm">📍 {ADDRESS}</div>
        </div>
      </div>

      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto grid gap-16 items-start" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
          <div>
            <h2 className="font-display text-[28px] font-bold mb-2">Nearby Landmarks</h2>
            <p className="text-muted mb-8">Distances and travel times by auto-rickshaw.</p>
            <div className="flex flex-col gap-3 mb-8">
              {DISTANCES.map((d, i) => (
                <ScrollReveal key={d.name} delay={i * 60}>
                  <div className="flex items-center gap-3.5 py-3.5 px-4 rounded-xl bg-white border border-marble" style={{ borderLeft: "4px solid var(--saffron)" }}>
                    <span className="text-xl shrink-0">{d.icon}</span>
                    <span className="text-sm font-medium text-ink flex-1">{d.name}</span>
                    <span className="text-[13px] font-semibold text-saffron whitespace-nowrap">{d.value}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white font-semibold px-8 py-4 rounded-lg transition-all duration-150 hover:-translate-y-px">📍 Open in Google Maps</a>
          </div>
          <div className="rounded-2xl overflow-hidden relative" style={{ height: 480, background: "#2a2420" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/60">
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 40% 60%, rgba(58,107,74,0.3) 0%, transparent 50%)" }} />
              <div className="text-[52px] relative z-10">📍</div>
              <div className="relative z-10 text-center px-6">
                <strong className="text-white/90 block text-lg mb-1">VMP Villa Home Stay</strong>
                <span className="text-sm">{ADDRESS}</span>
              </div>
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="relative z-10 bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors">Get Directions →</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-marble" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[32px] font-bold mb-2 text-center">How to Get Here</h2>
          <p className="text-muted text-center mb-12">Transport options to reach VMP Villa in Agra.</p>
          <div className="grid grid-cols-2 gap-6">
            {TRANSPORT.map((t, i) => (
              <ScrollReveal key={t.mode} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 border border-marble">
                  <div className="text-lg font-bold mb-4">{t.mode}</div>
                  <ul className="flex flex-col gap-2.5">
                    {t.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-muted">
                        <span className="text-saffron mt-0.5 shrink-0">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

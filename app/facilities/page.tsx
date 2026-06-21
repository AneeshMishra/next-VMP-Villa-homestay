import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import { FACILITIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Free WiFi, home-cooked breakfast, garden, parking, fireplace, laundry, and more. Everything included at VMP Villa homestay in Agra.",
};

const EXTRA_FACILITIES = [
  { icon: "🏡", name: "Common Lounge", note: "Shared space with books & board games" },
  { icon: "🌡️", name: "Hot Water 24/7", note: "Geyser in every bathroom" },
  { icon: "🧴", name: "Toiletries", note: "Eco-friendly, plastic-free" },
  { icon: "📱", name: "Mobile Charging", note: "Multiple sockets per room" },
  { icon: "🌙", name: "24-hr Check-in", note: "Late arrivals welcome" },
  { icon: "🧊", name: "Filtered Water", note: "Free refill every day" },
  { icon: "🪴", name: "Organic Garden", note: "Herbs for cooking" },
  { icon: "⚡", name: "Solar Power", note: "Eco-friendly energy" },
];

export default function FacilitiesPage() {
  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
            What&apos;s Included
          </div>
          <h1
            className="font-display font-black text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(36px, 6vw, 60px)" }}
          >
            Everything You{" "}
            <em className="not-italic text-saffron">Need to Feel at Home</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            No hidden fees, no surprises. Every stay at VMP Villa comes with these facilities as
            standard.
          </p>
        </div>
      </div>

      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[28px] font-bold mb-2">Core Facilities</h2>
          <p className="text-muted mb-10">Included in every room, every night.</p>
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {FACILITIES.map((f, i) => (
              <ScrollReveal key={f.name} delay={i * 60}>
                <div className="bg-white rounded-2xl p-6 border border-marble text-center transition-shadow duration-200 hover:shadow-md">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <div className="font-semibold text-[15px] mb-1.5">{f.name}</div>
                  <div className="text-xs text-muted">{f.note}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-marble" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[28px] font-bold mb-2">Also Available</h2>
          <p className="text-muted mb-10">On request or as part of the stay.</p>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {EXTRA_FACILITIES.map((f, i) => (
              <ScrollReveal key={f.name} delay={i * 50}>
                <div className="bg-white rounded-xl p-5 flex items-start gap-3 border border-marble/50">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: "var(--leaf-l)" }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-[14px] mb-0.5">{f.name}</div>
                    <div className="text-xs text-muted">{f.note}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-leaf text-white" style={{ padding: "64px 40px" }}>
        <div className="max-w-[760px] mx-auto text-center">
          <div className="text-5xl mb-6">🌿</div>
          <h2 className="font-display text-[32px] font-bold mb-4">Our Eco Promise</h2>
          <p className="text-white/70 text-[15px] leading-[1.8] mb-8">
            VMP Villa is committed to responsible hospitality. Every decision is made with the environment in mind.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["♻️ Zero single-use plastics","🌧️ Rainwater harvesting","☀️ Solar-powered lighting","🌱 Organic kitchen garden","🍃 Eco-friendly toiletries","🚴 Cycle rentals available"].map((tag) => (
              <span key={tag} className="text-sm font-medium px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

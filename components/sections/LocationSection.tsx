import ScrollReveal from "@/components/ScrollReveal";
import { DISTANCES, GOOGLE_MAPS_URL } from "@/lib/constants";

export default function LocationSection() {
  return (
    <div className="bg-ink" style={{ padding: "80px 40px" }} id="location">
      <div
        className="max-w-[1100px] mx-auto grid gap-15 items-center"
        style={{ gridTemplateColumns: "1fr 1.4fr", gap: 60 }}
      >
        {/* Text + distances */}
        <div>
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-2.5">
            Find Us
          </div>
          <h2
            className="font-display font-bold text-white mb-3.5 leading-tight"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Right in the{" "}
            <em className="not-italic text-saffron">Heart of Agra</em>
          </h2>
          <p className="text-white/55 text-[15px] leading-[1.7] mb-8">
            Tucked in a quiet residential lane in Tajganj — walkable to the Taj&apos;s south gate,
            yet away from the tourist noise.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            {DISTANCES.map((d, i) => (
              <ScrollReveal key={d.name} delay={i * 60}>
                <div
                  className="flex items-center gap-3.5 py-3 px-4 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderLeft: "3px solid var(--saffron)",
                  }}
                >
                  <span className="text-xl shrink-0">{d.icon}</span>
                  <span className="text-sm font-medium text-white/85 flex-1">{d.name}</span>
                  <span className="text-[13px] font-semibold text-saffron">{d.value}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white text-[15px] font-semibold px-8 py-4 rounded-lg transition-all duration-150 hover:-translate-y-px"
          >
            📍 Open in Google Maps
          </a>
        </div>

        {/* Map */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{ height: 400, background: "#2a2420" }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/60 text-sm">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at 40% 60%, rgba(58,107,74,0.3) 0%, transparent 50%)",
              }}
            />
            <div className="text-[42px] relative z-10">📍</div>
            <div className="relative z-10 text-center">
              <strong className="text-white/90 block text-[15px] mb-1">VMP Villa Home Stay</strong>
              Tajganj, Agra, UP 282001
            </div>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 bg-saffron hover:bg-saffron-d text-white text-[13px] font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #location > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 600px) {
          #location { padding: 60px 20px !important; }
        }
      `}</style>
    </div>
  );
}

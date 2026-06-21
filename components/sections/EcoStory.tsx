import ScrollReveal from "@/components/ScrollReveal";
import { ECO_STATS } from "@/lib/constants";

export default function EcoStory() {
  return (
    <div className="bg-leaf-l" style={{ padding: "80px 40px" }} id="story">
      <div className="max-w-[1100px] mx-auto grid gap-20 items-center" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-leaf mb-2.5">Our Story</div>
          <h2 className="font-display font-bold text-ink mb-6 leading-tight" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>A home built on<br /><em className="not-italic text-leaf">roots & responsibility</em></h2>
          <p className="text-muted text-[15px] leading-[1.8] mb-6">Aneesh and Bhavna started VMP Villa with a simple idea — give every guest the same warmth their own family would receive. Ten years on, that mission also includes taking care of the planet they&apos;ll pass on to their children.</p>
          <p className="text-muted text-sm leading-[1.8]">From rainwater harvesting to solar lighting, organic kitchen gardens to plastic-free rooms — every choice at VMP Villa is made with intention.</p>
        </div>
        <div className="flex flex-col gap-5">
          {ECO_STATS.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 100}>
              <div className="flex items-center gap-5 bg-white rounded-xl py-5 px-6" style={{ borderLeft: "4px solid var(--leaf)" }}>
                <div className="text-3xl shrink-0">{s.icon}</div>
                <div>
                  <div className="font-display text-2xl font-bold text-leaf leading-none mb-0.5">{s.value}</div>
                  <div className="text-xs text-muted">{s.label}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

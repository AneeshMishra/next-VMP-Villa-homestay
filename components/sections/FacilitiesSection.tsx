import ScrollReveal from "@/components/ScrollReveal";
import { FACILITIES } from "@/lib/constants";

export default function FacilitiesSection() {
  return (
    <div id="facilities">
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", minHeight: 600 }}>
        {/* Photo side */}
        <div
          className="relative"
          style={{
            background:
              "url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=80') center/cover",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(26,23,20,0.3) 0%, transparent 60%)" }}
          />
        </div>

        {/* Content side */}
        <div className="bg-ink flex flex-col justify-center" style={{ padding: "72px 60px" }}>
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-2.5">
            What&apos;s Included
          </div>
          <h2
            className="font-display font-bold text-white mb-3.5 leading-tight"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Everything you
            <br />
            <em className="not-italic text-saffron">need to feel at home</em>
          </h2>
          <p className="text-white/55 text-[15px] leading-[1.7] mb-9 max-w-[400px]">
            No hidden fees, no surprises. Every stay includes the facilities below. Because a good
            host makes you feel welcome, not nickel-and-dimed.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {FACILITIES.map((f, i) => (
              <ScrollReveal key={f.name} delay={i * 60}>
                <div className="flex items-start gap-3">
                  <div
                    className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/90 leading-tight mb-0.5">
                      {f.name}
                    </div>
                    <div className="text-xs text-white/40">{f.note}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #facilities > div {
            grid-template-columns: 1fr !important;
          }
          #facilities > div > div:first-child {
            min-height: 300px;
          }
          #facilities > div > div:last-child {
            padding: 48px 32px !important;
          }
        }
      `}</style>
    </div>
  );
}

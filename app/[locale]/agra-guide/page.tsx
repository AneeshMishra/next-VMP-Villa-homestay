import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agra Travel Guide",
  description: "A local's guide to Agra — best restaurants, hidden gems, sunrise spots, and travel tips beyond the Taj Mahal. Coming soon from VMP Villa.",
};

const PREVIEW_TOPICS = [
  { icon: "🕌", title: "Beyond the Taj", desc: "Agra Fort, Fatehpur Sikri, Mehtab Bagh — the monuments tourists miss." },
  { icon: "🍽️", title: "Where Locals Eat", desc: "Aneesh’s personal list of Tajganj dhabas and Sadar Bazaar street food." },
  { icon: "🌅", title: "Sunrise & Sunset Spots", desc: "The exact rooftops and river banks where Agra turns golden." },
  { icon: "🚺", title: "Getting Around", desc: "E-rickshaw routes, trusted auto drivers, and how to avoid the tourist traps." },
  { icon: "🛍️", title: "What to Buy", desc: "Agra marble inlay, leather goods, and where NOT to buy them." },
  { icon: "📅", title: "When to Visit", desc: "Month-by-month guide to weather, crowds, and hidden seasonal gems." },
];

export default function AgraGuidePage() {
  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">Local Knowledge</div>
          <h1 className="font-display font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(36px, 6vw, 60px)" }}>
            Agra Travel <em className="not-italic text-saffron">Guide</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            Not the tourist-board version. A guide written by someone who grew up in Tajganj and has seen thousands of travellers make the same avoidable mistakes.
          </p>
        </div>
      </div>

      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div className="max-w-[760px] mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-6 px-4 py-2 rounded-full" style={{ background: "rgba(58,107,74,0.1)", border: "1px solid rgba(58,107,74,0.25)", color: "var(--leaf)" }}>
            ✍️ Phase 3 — In Progress
          </div>
          <h2 className="font-display text-[32px] font-bold text-ink mb-4">Aneesh is writing this</h2>
          <p className="text-muted text-[15px] leading-[1.8] mb-6 max-w-[540px] mx-auto">
            A full blog powered by Sanity CMS is coming in Phase 3 — covering everything from the best rooftop for a Taj sunrise to the greatest puri sabzi in Agra.
          </p>
          <p className="text-muted text-[15px] leading-[1.8] mb-10 max-w-[540px] mx-auto">
            Until then, WhatsApp Aneesh directly — he&apos;ll send you a personalised itinerary based on your dates and interests.
          </p>
        </div>
        <div className="max-w-[1100px] mx-auto">
          <h3 className="font-display text-[22px] font-bold text-ink mb-6 text-center">Topics we&apos;ll cover</h3>
          <div className="grid grid-cols-3 gap-5">
            {PREVIEW_TOPICS.map((t) => (
              <div key={t.title} className="bg-white rounded-2xl p-6 border border-marble opacity-70">
                <div className="text-3xl mb-3">{t.icon}</div>
                <div className="font-semibold text-ink text-[15px] mb-2">{t.title}</div>
                <p className="text-muted text-sm leading-[1.6]">{t.desc}</p>
                <div className="mt-4 text-[10px] font-bold tracking-widest uppercase py-1 px-2 rounded inline-block" style={{ background: "rgba(58,107,74,0.1)", color: "var(--leaf)" }}>Coming Soon</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-ink text-white" style={{ padding: "64px 40px" }}>
        <div className="max-w-[1100px] mx-auto grid gap-10 items-center" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">In the meantime</div>
            <h2 className="font-display font-bold text-white mb-4 leading-tight" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>Ask Aneesh — he&apos;s better than any guide book</h2>
            <p className="text-white/60 text-[15px] leading-[1.7] mb-6">Aneesh has been showing guests around Agra since 2015. WhatsApp him your dates and interests — he’ll send you a personalised itinerary, usually within the hour.</p>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              {["🕌 Sunrise Taj entry timing & ticket tips", "🍽️ Best local restaurant for your budget", "🚺 Trusted auto driver recommendations", "🗺️ Day trip suggestions (Fatehpur Sikri etc.)"].map((tip) => (<li key={tip}>{tip}</li>))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/contact" className="flex items-center gap-4 rounded-xl p-5 border transition-all duration-150 hover:border-saffron" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-3xl">💬</span>
              <div><div className="font-semibold text-white">Ask for Agra Tips</div><div className="text-sm text-white/50">WhatsApp · replies within 1 hour</div></div>
              <span className="ml-auto text-white/40">→</span>
            </Link>
            <Link href="/location" className="flex items-center gap-4 rounded-xl p-5 border transition-all duration-150 hover:border-saffron" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-3xl">📍</span>
              <div><div className="font-semibold text-white">Distances & Transport</div><div className="text-sm text-white/50">How to get around Agra</div></div>
              <span className="ml-auto text-white/40">→</span>
            </Link>
            <Link href="/faq" className="flex items-center gap-4 rounded-xl p-5 border transition-all duration-150 hover:border-saffron" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-3xl">❓</span>
              <div><div className="font-semibold text-white">Common Questions</div><div className="text-sm text-white/50">Taj tours, transfers & more</div></div>
              <span className="ml-auto text-white/40">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

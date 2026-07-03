import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { REVIEWS } from "@/lib/constants";
import { WA_CHAT_URL } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Guest Reviews",
  description:
    "Read what guests say about VMP Villa Home Stay — 9.4 score across 200+ reviews on Booking.com, TripAdvisor, Google, and MakeMyTrip.",
};

const SOURCE_STYLES: Record<string, { bg: string; color: string }> = {
  "src-booking":     { bg: "#003580", color: "#fff" },
  "src-tripadvisor": { bg: "#34E0A1", color: "#000" },
  "src-google":      { bg: "#4285F4", color: "#fff" },
  "src-mmt":         { bg: "#D52B2B", color: "#fff" },
};

const PLATFORM_STATS = [
  { name: "Booking.com",  score: "9.4", reviews: "80+",  color: "#003580", text: "#fff" },
  { name: "TripAdvisor",  score: "4.8", reviews: "60+",  color: "#34E0A1", text: "#000" },
  { name: "Google",       score: "4.7", reviews: "50+",  color: "#4285F4", text: "#fff" },
  { name: "MakeMyTrip",   score: "4.6", reviews: "30+",  color: "#D52B2B", text: "#fff" },
];

export default function ReviewsPage() {
  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">Guest Love</div>
          <h1 className="font-display font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(36px, 6vw, 60px)" }}>
            What Travellers <em className="not-italic text-saffron">Say About Us</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            Collected from Booking.com, TripAdvisor, Google, and MakeMyTrip — unfiltered and real.
            We don&apos;t delete bad reviews. We haven&apos;t needed to.
          </p>
        </div>
      </div>

      <div className="bg-cream" style={{ padding: "64px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="reviews-stats-grid grid gap-8 items-center mb-12" style={{ gridTemplateColumns: "auto 1fr" }}>
            <div className="reviews-score-col text-center pr-8" style={{ borderRight: "1px solid var(--marble)" }}>
              <div className="font-display text-[80px] font-black text-ink leading-none">9.4</div>
              <div className="text-[28px] text-saffron tracking-widest mb-2">★★★★★</div>
              <div className="text-sm text-muted">Overall Guest Score</div>
              <div className="text-xs text-stone mt-1">Across 200+ reviews</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {PLATFORM_STATS.map((p) => (
                <ScrollReveal key={p.name}>
                  <div className="bg-white rounded-xl p-5 border border-marble flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: p.color, color: p.text }}
                    >
                      {p.score}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-ink">{p.name}</div>
                      <div className="text-xs text-muted">{p.reviews} reviews</div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-marble" style={{ padding: "64px 40px 80px" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[28px] font-bold mb-2">Featured Reviews</h2>
          <p className="text-muted mb-10">Hand-picked from our favourite moments.</p>
          <div className="reviews-cards-grid grid gap-5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {REVIEWS.map((r, i) => {
              const style = SOURCE_STYLES[r.sourceClass];
              return (
                <ScrollReveal key={r.name + i} delay={i * 80}>
                  <div className="bg-white rounded-2xl p-6 border border-marble transition-shadow duration-200 hover:shadow-lg flex flex-col">
                    <div className="flex items-center gap-3 mb-3.5">
                      <div
                        className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-bold text-base text-white shrink-0"
                        style={{ background: r.avatarColor }}
                      >{r.initial}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-ink">{r.name}</div>
                        <div className="text-[11px] text-stone">{r.meta}</div>
                      </div>
                      <div className="text-xs text-saffron tracking-wide ml-auto">
                        {"★".repeat(r.stars)}
                        {r.stars < 5 && <span className="text-marble">{"★".repeat(5 - r.stars)}</span>}
                      </div>
                    </div>
                    <p className="text-[13px] leading-[1.7] text-muted italic flex-1">{r.text}</p>
                    <span className="inline-block mt-3.5 text-[10px] font-bold tracking-wide uppercase py-1 px-2 rounded self-start" style={style}>
                      {r.source}
                    </span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-cream" style={{ padding: "64px 40px" }}>
        <div className="max-w-[760px] mx-auto text-center">
          <div className="text-4xl mb-5">✍️</div>
          <h2 className="font-display text-[28px] font-bold mb-4">Stayed with us? Share your experience.</h2>
          <p className="text-muted mb-8 max-w-[480px] mx-auto">Honest reviews help other travellers make great decisions — and help us keep improving.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg" style={{ background: "#003580" }}>Review on Booking.com</a>
            <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-black text-sm font-semibold px-6 py-3 rounded-lg" style={{ background: "#34E0A1" }}>Review on TripAdvisor</a>
            <a href="https://maps.google.com/?q=VMP+Villa+Agra" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg" style={{ background: "#4285F4" }}>Review on Google</a>
          </div>
        </div>
      </div>

      <div className="bg-ink text-white text-center" style={{ padding: "64px 40px" }}>
        <h2 className="font-display text-[28px] font-bold mb-4">Ready to write your own story?</h2>
        <p className="text-white/60 mb-8 max-w-[480px] mx-auto">Join 200+ guests who&apos;ve made VMP Villa their Agra home.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href={WA_CHAT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white font-semibold px-10 py-4 rounded-lg transition-all duration-150">💬 Book via WhatsApp</a>
          <Link href="/rooms" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-10 py-4 rounded-lg border border-white/20 transition-all duration-150">🛏️ See Rooms</Link>
        </div>
      </div>

      <style>{`
        /* Reviews cards: 3 cols → 2 cols → 1 col */
        @media (max-width: 900px) {
          .reviews-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .reviews-cards-grid { grid-template-columns: 1fr !important; }
        }

        /* Stats section: side-by-side → stacked */
        @media (max-width: 700px) {
          .reviews-stats-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .reviews-score-col { border-right: none !important; padding-right: 0 !important; border-bottom: 1px solid var(--marble); padding-bottom: 28px !important; }
        }

        /* Section padding on mobile */
        @media (max-width: 600px) {
          div[style*="padding: 64px 40px 48px"] { padding: 40px 20px 32px !important; }
          div[style*="padding: 64px 40px 80px"] { padding: 40px 20px 60px !important; }
          div[style*="padding: 64px 40px"] { padding: 40px 20px !important; }
        }
      `}</style>
    </div>
  );
}

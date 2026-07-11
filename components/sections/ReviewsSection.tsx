import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/ScrollReveal";
import { REVIEWS } from "@/lib/constants";

const SOURCE_STYLES: Record<string, { bg: string; color: string }> = {
  "src-booking":      { bg: "#003580", color: "#fff" },
  "src-tripadvisor":  { bg: "#34E0A1", color: "#000" },
  "src-google":       { bg: "#4285F4", color: "#fff" },
  "src-mmt":          { bg: "#D52B2B", color: "#fff" },
};

export default function ReviewsSection({ limit }: { limit?: number }) {
  const t = useTranslations("reviews");
  const reviews = limit ? REVIEWS.slice(0, limit) : REVIEWS;

  return (
    <div style={{ padding: "80px 40px" }} id="reviews">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-2.5">
              {t("eyebrow")}
            </div>
            <h2
              className="font-display font-bold text-ink mb-2 leading-tight"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              {t("heading")}{" "}
              <em className="not-italic text-saffron">{t("headingAccent")}</em>
            </h2>
            <p className="text-muted text-[15px]">
              Booking.com · TripAdvisor · Google · MakeMyTrip
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-[56px] font-black text-ink leading-none">9.4</div>
            <div className="text-[22px] text-saffron tracking-widest">★★★★★</div>
            <div className="text-xs text-muted mt-1">{t("viewAll")}</div>
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {reviews.map((r, i) => {
            const style = SOURCE_STYLES[r.sourceClass];
            return (
              <ScrollReveal key={r.name + i} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 border border-marble transition-shadow duration-200 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-3.5">
                    <div
                      className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-bold text-base text-white shrink-0"
                      style={{ background: r.avatarColor }}
                    >
                      {r.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-ink">{r.name}</div>
                      <div className="text-[11px] text-stone">{r.meta}</div>
                    </div>
                    <div className="text-xs text-saffron tracking-wide ml-auto">
                      {"★".repeat(r.stars)}
                      {r.stars < 5 && <span className="text-marble">{"★".repeat(5 - r.stars)}</span>}
                    </div>
                  </div>
                  <p className="text-[13px] leading-[1.7] text-muted italic">{r.text}</p>
                  <span
                    className="inline-block mt-3.5 text-[10px] font-bold tracking-wide uppercase py-1 px-2 rounded"
                    style={style}
                  >
                    {r.source}
                  </span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #reviews .reviews-header { flex-direction: column; }
          #reviews > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          #reviews { padding: 60px 20px !important; }
        }
      `}</style>
    </div>
  );
}

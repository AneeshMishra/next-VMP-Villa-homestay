import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EMAIL, PHONE_DISPLAY, INSTAGRAM_URL, INSTAGRAM, ADDRESS } from "@/lib/constants";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-ink text-white/55" style={{ padding: "60px 40px 32px" }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid gap-12 pb-10 mb-10" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <div className="font-display text-[22px] font-black text-white mb-3">VMP<span className="text-saffron">Villa</span></div>
            <p className="text-sm leading-relaxed mb-5">{t("tagline")}</p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(58,107,74,0.2)", border: "1px solid rgba(58,107,74,0.3)", color: "#6FCF97" }}>
              {t("ecoCertified")}
            </span>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-widest text-white/80 mb-4 uppercase">{t("quickLinks")}</div>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/rooms" as const, label: t("ourRooms") },
                { href: "/facilities" as const, label: t("facilities") },
                { href: "/location" as const, label: t("locationMap") },
                { href: "/reviews" as const, label: t("guestReviews") },
                { href: "/story" as const, label: t("ourStory") },
                { href: "/offers" as const, label: t("specialOffers") },
                { href: "/blog" as const, label: t("travelBlog") },
                { href: "/faq" as const, label: t("faq") },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-white/45 hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-widest text-white/80 mb-4 uppercase">{t("roomTypes")}</div>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/rooms#deluxe-ac" as const, label: t("deluxeRoom") },
                { href: "/rooms#standard-ac" as const, label: t("standardRoom") },
                { href: "/rooms#dormitory" as const, label: t("dormitory") },
                { href: "/book" as const, label: t("checkAvailability") },
                { href: "/contact" as const, label: t("specialRequests") },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-white/45 hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-widest text-white/80 mb-4 uppercase">{t("contact")}</div>
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex gap-2.5"><span className="opacity-60">📍</span><span>{ADDRESS}</span></div>
              <div className="flex gap-2.5"><span className="opacity-60">📞</span><a href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`} className="text-white/45 hover:text-white transition-colors">{PHONE_DISPLAY}</a></div>
              <div className="flex gap-2.5"><span className="opacity-60">✉️</span><a href={`mailto:${EMAIL}`} className="text-white/45 hover:text-white transition-colors">{EMAIL}</a></div>
              <div className="flex gap-2.5"><span className="opacity-60">📸</span><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-white/45 hover:text-white transition-colors">{INSTAGRAM}</a></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs flex-wrap gap-3">
          <span>{t("copyright")}</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-white/30 hover:text-white/70 transition-colors">{t("privacy")}</Link>
            <Link href="/terms" className="text-white/30 hover:text-white/70 transition-colors">{t("terms")}</Link>
            <Link href="/cancellation" className="text-white/30 hover:text-white/70 transition-colors">{t("cancellation")}</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { footer { padding: 48px 20px 24px !important; } footer > div > div:first-child { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

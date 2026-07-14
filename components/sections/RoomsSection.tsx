import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import CurrencyPrice from "@/components/CurrencyPrice";
import { ROOMS, ROOM_CAPACITY } from "@/lib/constants";
import { ROOM_PRICES } from "@/lib/booking-config";

function RoomCard({
  room,
  delay,
  t,
  tContent,
  tCap,
}: {
  room: (typeof ROOMS)[number];
  delay: number;
  t: ReturnType<typeof useTranslations<"rooms">>;
  tContent: ReturnType<typeof useTranslations<"roomContent">>;
  tCap: ReturnType<typeof useTranslations<"capacity">>;
}) {
  const translatedBadge = room.badge ? tContent(`${room.id}-badge`) : null;
  const cap = ROOM_CAPACITY[room.id as keyof typeof ROOM_CAPACITY];

  return (
    <ScrollReveal delay={delay} className="h-full">
      <div className="room-card bg-white rounded-2xl overflow-hidden border border-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)] group h-full flex flex-col">

        <Link href={`/rooms#${room.id}`} className="relative block overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <Image
            src={room.image}
            alt={room.imageAlt}
            fill
            className="object-cover transition-transform duration-400 group-hover:scale-105"
            sizes="(max-width: 768px) 85vw, 33vw"
          />
          {translatedBadge && (
            <div
              className="absolute top-3.5 left-3.5 text-white text-[10px] font-bold tracking-wide uppercase py-1 px-2.5 rounded"
              style={{ background: room.badgeColor ?? undefined }}
            >
              {translatedBadge}
            </div>
          )}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/25 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-ink text-[12px] font-semibold px-4 py-2 rounded-full shadow-lg">
              {t("viewDetails")}
            </span>
          </div>
        </Link>

        <div className="p-6 flex flex-col flex-1">
          <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-saffron mb-1.5">
            {translatedBadge ?? t("room")}
          </div>

          <Link
            href={`/rooms#${room.id}`}
            className="font-display text-[22px] font-bold text-ink leading-tight mb-2.5 hover:text-saffron transition-colors duration-200 block"
          >
            {tContent(`${room.id}-name`)}
          </Link>

          <p className="text-[13px] text-stone leading-[1.75] mb-4 flex-1">{tContent(`${room.id}-desc`)}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {room.amenities.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className="bg-cream border border-marble rounded-full text-[11px] font-medium text-muted px-2.5 py-1"
              >
                {tContent(`${room.id}-a${idx}`)}
              </span>
            ))}
            {room.amenities.length > 5 && (
              <span className="bg-cream border border-marble rounded-full text-[11px] font-medium text-stone px-2.5 py-1">
                +{room.amenities.length - 5} {t("more")}
              </span>
            )}
          </div>

          {/* Capacity strip */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-5 text-[11px] text-muted">
            <span>👥 <strong className="text-ink">{cap.baseAdults}</strong> {tCap("adults")}</span>
            {cap.childFreeAge > 0 && (
              <>
                <span className="text-stone/40">·</span>
                <span>👶 {tCap("childrenFree", { age: cap.childFreeAge })}</span>
              </>
            )}
            <span className="text-stone/40">·</span>
            {cap.extraPersonFee > 0 ? (
              <span>➕ {tCap("extraPerson", { fee: cap.extraPersonFee })}</span>
            ) : (
              <span>{tCap("dormNote")}</span>
            )}
          </div>

          <div
            className="flex items-center justify-between pt-4"
            style={{ borderTop: "1px solid var(--marble)" }}
          >
            <div>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-stone mb-0.5">
                {t("startingFrom")}
              </div>
              <CurrencyPrice
                amountInr={ROOM_PRICES[room.id as keyof typeof ROOM_PRICES] ?? 0}
                unit={room.priceUnit}
                size="sm"
                showInrSecondary={true}
              />
            </div>
            <Link
              href={`/book?room=${room.id}`}
              className="bg-ink hover:bg-saffron text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-all duration-150 hover:-translate-y-px"
            >
              {t("bookNow")}
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function RoomsSection() {
  const t = useTranslations("rooms");
  const tContent = useTranslations("roomContent");
  const tCap = useTranslations("capacity");

  return (
    <div className="bg-marble rooms-section" style={{ padding: "80px 0" }}>
      <div className="max-w-[1100px] mx-auto px-10 rooms-section-inner">
        <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-2.5">
          {t("eyebrow")}
        </div>
        <h2 className="font-display font-bold text-ink mb-3.5" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
          {t("heading")} <em className="not-italic text-saffron">{t("headingAccent")}</em>
        </h2>
        <p className="text-muted text-[15px] leading-[1.7] mb-12 max-w-[560px]">
          {t("subtitle")}
        </p>

        <div className="rooms-scroll-wrap grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {ROOMS.map((room, i) => (
            <RoomCard key={room.id} room={room} delay={i * 100} t={t} tContent={tContent} tCap={tCap} />
          ))}
        </div>

        <p className="rooms-swipe-hint text-center text-xs text-muted mt-4 hidden">
          {t("swipeHint")}
        </p>

        <div className="text-center mt-10">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 bg-ink hover:bg-saffron text-white text-sm font-semibold px-8 py-3.5 rounded-lg transition-all duration-150"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .rooms-section-inner {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .rooms-section-inner > p,
          .rooms-section-inner > div:first-child,
          .rooms-section-inner > h2,
          .rooms-section-inner > .text-center {
            padding-left: 20px;
            padding-right: 20px;
          }
          .rooms-scroll-wrap {
            display: flex !important;
            grid-template-columns: unset !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 16px !important;
            padding: 0 20px 16px !important;
            margin-bottom: 0 !important;
          }
          .rooms-scroll-wrap::-webkit-scrollbar {
            display: none;
          }
          .rooms-scroll-wrap > div {
            flex: 0 0 82vw;
            scroll-snap-align: start;
          }
          .rooms-swipe-hint {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

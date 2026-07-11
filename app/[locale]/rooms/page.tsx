import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import RoomImageSlider from "@/components/RoomImageSlider";
import CurrencyPrice from "@/components/CurrencyPrice";
import { ROOMS } from "@/lib/constants";
import { ROOM_PRICES } from "@/lib/booking-config";

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Choose from Deluxe AC, Standard AC, or Dormitory rooms at VMP Villa. All rooms include free WiFi and Aneesh & Bhavna's signature hospitality.",
};

export default function RoomsPage() {
  const t = useTranslations("rooms");
  const tContent = useTranslations("roomContent");

  return (
    <div>
      {/* Page header */}
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
            {t("pageEyebrow")}
          </div>
          <h1
            className="font-display font-black text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(36px, 6vw, 60px)" }}
          >
            {t("pageHeading")}{" "}
            <em className="not-italic text-saffron">{t("pageHeadingAccent")}</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            {t("pageSubtitle")}
          </p>
        </div>
      </div>

      {/* Rooms */}
      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto flex flex-col gap-20">
          {ROOMS.map((room, i) => {
            const isEven = i % 2 === 0;
            return (
              <ScrollReveal key={room.id}>
                <div
                  id={room.id}
                  className="grid gap-12 items-center"
                  style={{ gridTemplateColumns: "1fr 1fr" }}
                >
                  {/* Image / Slider */}
                  <div className={isEven ? "order-1" : "order-2"}>
                    {"images" in room && Array.isArray(room.images) ? (
                      <RoomImageSlider
                        images={room.images as { src: string; alt: string }[]}
                        badge={room.badge}
                        badgeColor={room.badgeColor}
                        roomName={room.name}
                      />
                    ) : (
                      <div
                        className="relative rounded-2xl overflow-hidden"
                        style={{ aspectRatio: "4/3" }}
                      >
                        <Image
                          src={room.image}
                          alt={room.imageAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={i === 0}
                        />
                        {room.badge && (
                          <div
                            className="absolute top-4 left-4 text-white text-[10px] font-bold tracking-wide uppercase py-1 px-3 rounded"
                            style={{ background: room.badgeColor ?? undefined }}
                          >
                            {room.badge}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={isEven ? "order-2" : "order-1"}>
                    <div className="font-display text-[32px] font-bold mb-4 leading-tight">
                      {tContent(`${room.id}-name`)}
                    </div>
                    <p className="text-muted text-[15px] leading-[1.8] mb-6">
                      {tContent(`${room.id}-desc`)}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {room.amenities.map((_, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-marble rounded-full text-sm font-medium text-muted px-3 py-1.5"
                        >
                          {tContent(`${room.id}-a${idx}`)}
                        </span>
                      ))}
                    </div>

                    <div
                      className="flex items-center justify-between pt-6"
                      style={{ borderTop: "1px solid var(--marble)" }}
                    >
                      <div>
                        <div className="text-[11px] text-stone mb-1">{t("startingFrom")}</div>
                        <CurrencyPrice
                          amountInr={ROOM_PRICES[room.id as keyof typeof ROOM_PRICES] ?? 0}
                          unit={room.priceUnit}
                          size="lg"
                          showInrSecondary={true}
                        />
                      </div>
                      <Link
                        href={`/book?room=${room.id}`}
                        className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white font-semibold px-8 py-4 rounded-lg transition-all duration-150 hover:-translate-y-px"
                      >
                        {t("bookThisRoom")}
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* CTA banner */}
      <div className="bg-ink text-white text-center" style={{ padding: "60px 40px" }}>
        <h2 className="font-display text-[28px] font-bold mb-4">
          {t("notSureTitle")}
        </h2>
        <p className="text-white/60 mb-8 max-w-[480px] mx-auto">
          {t("notSureSubtitle")}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white font-semibold px-10 py-4 rounded-lg transition-all duration-150"
        >
          {t("askAneesh")}
        </Link>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #deluxe-ac, #standard-ac, #dormitory, #\\31 bhk-flat, #\\32 bhk-flat {
            grid-template-columns: 1fr !important;
          }
          #deluxe-ac > div,
          #standard-ac > div,
          #dormitory > div,
          #\\31 bhk-flat > div,
          #\\32 bhk-flat > div {
            order: unset !important;
          }
        }
        @media (max-width: 600px) {
          div[style*="padding: 64px 40px 48px"] { padding: 48px 20px 40px !important; }
          div[style*="padding: 80px 40px"] { padding: 48px 20px !important; }
        }
      `}</style>
    </div>
  );
}

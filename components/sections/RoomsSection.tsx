import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import CurrencyPrice from "@/components/CurrencyPrice";
import { ROOMS } from "@/lib/constants";
import { ROOM_PRICES } from "@/lib/booking-config";

function RoomCard({ room, delay }: { room: (typeof ROOMS)[number]; delay: number }) {
  return (
    <ScrollReveal delay={delay} className="h-full">
      <div className="room-card bg-white rounded-2xl overflow-hidden border border-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)] group h-full flex flex-col">

        {/* Image — links to detail section */}
        <Link href={`/rooms#${room.id}`} className="relative block overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <Image
            src={room.image}
            alt={room.imageAlt}
            fill
            className="object-cover transition-transform duration-400 group-hover:scale-105"
            sizes="(max-width: 768px) 85vw, 33vw"
          />
          {room.badge && (
            <div
              className="absolute top-3.5 left-3.5 text-white text-[10px] font-bold tracking-wide uppercase py-1 px-2.5 rounded"
              style={{ background: room.badgeColor ?? undefined }}
            >
              {room.badge}
            </div>
          )}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/25 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-ink text-[12px] font-semibold px-4 py-2 rounded-full shadow-lg">
              View Details →
            </span>
          </div>
        </Link>

        <div className="p-6 flex flex-col flex-1">
          {/* Badge label above name */}
          <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-saffron mb-1.5">
            {room.badge ?? "Room"}
          </div>

          {/* Room name — links to detail section */}
          <Link
            href={`/rooms#${room.id}`}
            className="font-display text-[22px] font-bold text-ink leading-tight mb-2.5 hover:text-saffron transition-colors duration-200 block"
          >
            {room.name}
          </Link>

          <p className="text-[13px] text-stone leading-[1.75] mb-4 flex-1">{room.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {room.amenities.slice(0, 5).map((a) => (
              <span
                key={a}
                className="bg-cream border border-marble rounded-full text-[11px] font-medium text-muted px-2.5 py-1"
              >
                {a}
              </span>
            ))}
            {room.amenities.length > 5 && (
              <span className="bg-cream border border-marble rounded-full text-[11px] font-medium text-stone px-2.5 py-1">
                +{room.amenities.length - 5} more
              </span>
            )}
          </div>

          <div
            className="flex items-center justify-between pt-4"
            style={{ borderTop: "1px solid var(--marble)" }}
          >
            <div>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-stone mb-0.5">Starting from</div>
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
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function RoomsSection() {
  return (
    <div className="bg-marble rooms-section" style={{ padding: "80px 0" }}>
      <div className="max-w-[1100px] mx-auto px-10 rooms-section-inner">
        <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-2.5">
          Step Inside
        </div>
        <h2 className="font-display font-bold text-ink mb-3.5" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
          Choose Your <em className="not-italic text-saffron">Perfect Room</em>
        </h2>
        <p className="text-muted text-[15px] leading-[1.7] mb-12 max-w-[560px]">
          Five room types for every traveller — private flats, couples, families, and solo backpackers.
          All include free WiFi, filtered water, and Aneesh &amp; Bhavna&apos;s signature hospitality.
        </p>

        {/* Grid on desktop, horizontal scroll carousel on mobile */}
        <div className="rooms-scroll-wrap grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {ROOMS.map((room, i) => (
            <RoomCard key={room.id} room={room} delay={i * 100} />
          ))}
        </div>

        {/* Swipe hint — mobile only */}
        <p className="rooms-swipe-hint text-center text-xs text-muted mt-4 hidden">
          ← Swipe to see more rooms →
        </p>

        <div className="text-center mt-10">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 bg-ink hover:bg-saffron text-white text-sm font-semibold px-8 py-3.5 rounded-lg transition-all duration-150"
          >
            View All Room Details →
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

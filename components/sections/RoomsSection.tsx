import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { ROOMS } from "@/lib/constants";

function RoomCard({ room, delay }: { room: (typeof ROOMS)[number]; delay: number }) {
  return (
    <ScrollReveal delay={delay} className="h-full">
      <div
        id={room.id}
        className="room-card bg-white rounded-2xl overflow-hidden border border-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] group h-full flex flex-col"
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
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
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="font-display text-xl font-bold mb-2">{room.name}</div>
          <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{room.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {room.amenities.map((a) => (
              <span
                key={a}
                className="bg-cream border border-marble rounded-full text-[11px] font-medium text-muted px-2.5 py-1"
              >
                {a}
              </span>
            ))}
          </div>

          <div
            className="flex items-center justify-between pt-4"
            style={{ borderTop: "1px solid var(--marble)" }}
          >
            <div>
              <div className="text-[11px] text-stone">From</div>
              <span className="font-display text-2xl font-bold">{room.price}</span>
              <span className="text-xs text-muted ml-0.5">{room.priceUnit}</span>
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
          Three room types for every type of traveller — couples, families, solo adventurers.
          All include free WiFi, filtered water, and Aneesh & Bhavna&apos;s signature hospitality.
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

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { ROOMS } from "@/lib/constants";
import { buildWhatsAppUrl, bookingMessage } from "@/lib/whatsapp";

function RoomCard({ room, delay }: { room: (typeof ROOMS)[number]; delay: number }) {
  const waUrl = buildWhatsAppUrl(bookingMessage("", "", "2 Guests", room.name));
  return (
    <ScrollReveal delay={delay}>
      <div id={room.id} className="room-card bg-white rounded-2xl overflow-hidden border border-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] group">
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <Image src={room.image} alt={room.imageAlt} fill className="object-cover transition-transform duration-400 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          {room.badge && <div className="absolute top-3.5 left-3.5 text-white text-[10px] font-bold tracking-wide uppercase py-1 px-2.5 rounded" style={{ background: room.badgeColor ?? undefined }}>{room.badge}</div>}
        </div>
        <div className="p-6">
          <div className="font-display text-xl font-bold mb-2">{room.name}</div>
          <p className="text-sm text-muted leading-relaxed mb-4">{room.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {room.amenities.map((a) => <span key={a} className="bg-cream border border-marble rounded-full text-[11px] font-medium text-muted px-2.5 py-1">{a}</span>)}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--marble)" }}>
            <div>
              <div className="text-[11px] text-stone">From</div>
              <span className="font-display text-2xl font-bold">{room.price}</span>
              <span className="text-xs text-muted ml-0.5">{room.priceUnit}</span>
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="bg-ink hover:bg-saffron text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-all duration-150 hover:-translate-y-px">Book Now</a>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function RoomsSection() {
  return (
    <div className="bg-marble" style={{ padding: "80px 0" }}>
      <div className="max-w-[1100px] mx-auto px-10">
        <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-2.5">Step Inside</div>
        <h2 className="font-display font-bold text-ink mb-3.5" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>Choose Your <em className="not-italic text-saffron">Perfect Room</em></h2>
        <p className="text-muted text-[15px] leading-[1.7] mb-12 max-w-[560px]">Three room types for every type of traveller — couples, families, solo adventurers. All include free WiFi, filtered water, and Aneesh & Bhavna&apos;s signature hospitality.</p>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {ROOMS.map((room, i) => <RoomCard key={room.id} room={room} delay={i * 100} />)}
        </div>
        <div className="text-center mt-10">
          <Link href="/rooms" className="inline-flex items-center gap-2 bg-ink hover:bg-saffron text-white text-sm font-semibold px-8 py-3.5 rounded-lg transition-all duration-150">View All Room Details →</Link>
        </div>
      </div>
    </div>
  );
}

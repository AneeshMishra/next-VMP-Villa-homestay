import Link from "next/link";
import BookingBar from "@/components/BookingBar";

export default function Hero() {
  return (
    <>
      <section
        className="relative flex flex-col justify-end overflow-hidden"
        style={{ minHeight: "100svh", background: "var(--ink)" }}
        id="home"
      >
        {/* Background image + gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, rgba(26,23,20,0.2) 0%, rgba(26,23,20,0.1) 40%, rgba(26,23,20,0.75) 70%, rgba(26,23,20,0.95) 100%),
              url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=80') center/cover no-repeat
            `,
          }}
        />
        {/* Saffron radial glow */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(232,118,43,0.12) 0%, transparent 50%)",
          }}
        />

        {/* Floating rating badge */}
        <div
          className="absolute top-1/2 right-10 -translate-y-1/2 z-10 text-center rounded-2xl p-5 min-w-[120px] hidden md:block"
          style={{
            background: "rgba(26,23,20,0.85)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="text-saffron text-xl tracking-wide mb-1">★★★★★</div>
          <div className="font-display text-[36px] font-black text-white leading-none mb-1">9.4</div>
          <div className="text-[11px] font-medium text-white/50 tracking-wide">Guest Score</div>
          <div
            className="text-[10px] text-saffron font-semibold mt-2 pt-2 tracking-wide"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            Booking.com · TripAdvisor
          </div>
        </div>

        {/* Content */}
        <div
          className="relative z-10 w-full mx-auto"
          style={{ maxWidth: 1100, padding: "0 40px 60px" }}
        >
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 text-white/90 text-xs font-medium tracking-widest uppercase mb-6 rounded-full"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              padding: "7px 16px",
            }}
          >
            <span
              className="animate-pulse-dot rounded-full bg-saffron"
              style={{ width: 6, height: 6 }}
            />
            Agra&apos;s Favourite Homestay · Since 2015
          </div>

          <h1
            className="font-display font-black text-white mb-5 leading-[1.05]"
            style={{ fontSize: "clamp(36px, 6vw, 76px)", maxWidth: 780 }}
          >
            Where the{" "}
            <em className="not-italic text-saffron">Taj Mahal</em>
            <br />
            becomes your neighbour
          </h1>

          <p
            className="text-white/65 mb-9 leading-[1.7]"
            style={{ fontSize: "clamp(14px, 1.5vw, 16px)", maxWidth: 480 }}
          >
            A family-run eco-homestay in the heart of Agra. Real home-cooked food, a host who cares,
            and a terrace that turns golden at sunrise.
          </p>

          {/* Proximity strip */}
          <div
            className="flex max-w-[520px] mb-9 rounded-[10px] overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            {[
              { val: "4.2 km", label: "Taj Mahal" },
              { val: "2.8 km", label: "Agra Fort" },
              { val: "3.1 km", label: "Agra Cantt." },
              { val: "₹1,500", label: "Starting/night" },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                className="flex-1 text-center py-3.5 px-4"
                style={{
                  borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                <div className="font-display text-xl font-bold text-saffron leading-none mb-1">
                  {item.val}
                </div>
                <div className="text-[10px] font-medium tracking-wide text-white/50 uppercase">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex gap-3.5 flex-wrap max-md:justify-center">
            <Link
              href="#booking"
              className="hero-cta-primary inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white text-[15px] font-semibold px-8 py-4 rounded-lg transition-all duration-150 hover:-translate-y-0.5"
            >
              📅 Check Availability
            </Link>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 text-white/85 text-[15px] font-medium px-7 py-4 rounded-lg border transition-all duration-200 hover:border-white/60 hover:text-white"
              style={{
                border: "1px solid rgba(255,255,255,0.25)",
                background: "transparent",
              }}
            >
              🛏️ See Rooms
            </Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 600px) {
            section#home > div:last-of-type {
              padding: 0 20px 48px !important;
            }
          }
        `}</style>
      </section>

      <BookingBar />
    </>
  );
}

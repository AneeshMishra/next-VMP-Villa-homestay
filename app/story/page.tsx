import type { Metadata } from "next";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { ECO_STATS } from "@/lib/constants";
import { WA_CHAT_URL } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Meet Aneesh & Bhavna — the family behind VMP Villa Home Stay in Agra since 2015. A story of hospitality, eco-consciousness, and love for their city.",
};

const TIMELINE = [
  {
    year: "2015",
    title: "The Beginning",
    desc: "Aneesh & Bhavna opened their family home to their first guests — two backpackers from Germany who became lifelong friends. The idea was simple: share what you love.",
  },
  {
    year: "2017",
    title: "Going Green",
    desc: "Installed rainwater harvesting tanks and solar lighting across the property. Removed all single-use plastics from rooms — before it was fashionable.",
  },
  {
    year: "2019",
    title: "Growing the Nest",
    desc: "Expanded to 3 room types to welcome solo travellers, couples, and families alike. Bhavna’s legendary home-cooked breakfast service quietly became the most-mentioned thing in every review.",
  },
  {
    year: "2021",
    title: "Community Roots",
    desc: "Partnered with local auto-rickshaw drivers, Tajganj food stalls, and trusted guides — keeping every rupee of tourism spending inside the neighbourhood.",
  },
  {
    year: "2023",
    title: "9.4 Guest Score",
    desc: "Achieved a 9.4 average across Booking.com, TripAdvisor, Google & MakeMyTrip — built entirely on word-of-mouth and returning guests, zero advertising.",
  },
  {
    year: "2025",
    title: "The Next Chapter",
    desc: "Launching direct booking online — because every rupee saved on OTA commission goes back into what makes VMP Villa special: the people, the food, and the planet.",
  },
];

const VALUES = [
  {
    icon: "🏡",
    title: "Treat Every Guest as Family",
    desc: "No front desk, no chatbot — just Aneesh or Bhavna at the door, asking how your journey was and whether you’d like chai first.",
  },
  {
    icon: "🌿",
    title: "Tread Lightly on the Earth",
    desc: "Every decision at VMP Villa considers its footprint — from the toiletries we stock to the organic herbs growing in the kitchen garden.",
  },
  {
    icon: "🤝",
    title: "Support Local, Always",
    desc: "We source food from Tajganj’s morning market, recommend the chai wallah two streets over, and send guests to local restaurants — not hotel buffets.",
  },
  {
    icon: "🕌",
    title: "Share Agra’s Real Soul",
    desc: "Tourists see the Taj. Our guests find the sunrise spots, the hidden neighbourhoods, the families who’ve lived in Tajganj for generations.",
  },
];

export default function StoryPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
            Since 2015
          </div>
          <h1
            className="font-display font-black text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(36px, 6vw, 60px)" }}
          >
            A Home Built on{" "}
            <em className="not-italic text-saffron">Roots &amp; Responsibility</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[580px] leading-[1.7]">
            VMP Villa started with an open door and a spare room. Ten years on, it&apos;s a
            family-run eco-homestay that has hosted thousands of travellers from 60+ countries —
            and counting.
          </p>
        </div>
      </div>

      {/* Meet the family */}
      <div className="bg-cream" style={{ padding: "80px 40px" }}>
        <div
          className="max-w-[1100px] mx-auto grid gap-16 items-center"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          <div>
            <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
              The Hosts
            </div>
            <h2
              className="font-display font-bold text-ink mb-5 leading-tight"
              style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
            >
              Meet <em className="not-italic text-saffron">Aneesh &amp; Bhavna</em>
            </h2>
            <p className="text-muted text-[15px] leading-[1.8] mb-5">
              Aneesh grew up in Tajganj, within walking distance of the Taj Mahal — a neighbour so
              familiar you forget how extraordinary it is. He spent years working in Agra&apos;s
              hospitality industry before realising the best hospitality was already happening in
              his own home.
            </p>
            <p className="text-muted text-[15px] leading-[1.8] mb-5">
              Bhavna brings the kitchen. Her parathas, freshly made chutneys, and chai — brewed
              exactly as each guest likes it — have become the most-reviewed part of VMP Villa.
              Guests have been known to extend their stay just to have breakfast one more time.
            </p>
            <p className="text-muted text-[15px] leading-[1.8]">
              Together they manage every booking, every conversation, every early-morning airport
              run. There is no team. There is no outsourcing. There is just family.
            </p>
          </div>

          <ScrollReveal>
            <div
              className="rounded-2xl p-8 flex flex-col gap-6"
              style={{ background: "var(--marble)" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl font-black text-white shrink-0"
                  style={{ background: "var(--saffron)" }}
                >
                  A
                </div>
                <div>
                  <div className="font-bold text-ink text-lg">Aneesh Mishra</div>
                  <div className="text-muted text-sm">Co-founder &middot; Local guide &middot; Host</div>
                </div>
              </div>
              <blockquote className="text-muted text-[15px] leading-[1.8] italic border-l-4 border-saffron pl-4">
                &ldquo;I want every guest to leave Agra feeling like they didn&apos;t just see a
                monument — they understood a city. And maybe made a friend.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl font-black text-white shrink-0"
                  style={{ background: "var(--leaf)" }}
                >
                  B
                </div>
                <div>
                  <div className="font-bold text-ink text-lg">Bhavna Mishra</div>
                  <div className="text-muted text-sm">Co-founder &middot; Chef &middot; Heart of the home</div>
                </div>
              </div>
              <blockquote className="text-muted text-[15px] leading-[1.8] italic border-l-4 border-leaf pl-4">
                &ldquo;Good food is the easiest way to make someone feel at home. I cook every
                breakfast myself — that will never change, no matter how many rooms we have.&rdquo;
              </blockquote>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-ink" style={{ padding: "80px 40px" }}>
        <div className="max-w-[900px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3 text-center">
            A Decade of Hosting
          </div>
          <h2
            className="font-display font-bold text-white mb-12 text-center leading-tight"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Our <em className="not-italic text-saffron">Journey</em>
          </h2>

          <div className="relative">
            <div
              className="absolute left-[72px] top-0 bottom-0 w-px hidden md:block"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <div className="flex flex-col gap-8">
              {TIMELINE.map((item, i) => (
                <ScrollReveal key={item.year} delay={i * 80}>
                  <div className="flex gap-6 items-start">
                    <div
                      className="shrink-0 w-[72px] text-right hidden md:block"
                      style={{ paddingRight: 20 }}
                    >
                      <span className="font-display text-lg font-bold text-saffron">
                        {item.year}
                      </span>
                    </div>
                    <div
                      className="shrink-0 w-3 h-3 rounded-full mt-1.5 hidden md:block"
                      style={{ background: "var(--saffron)", marginLeft: -6 }}
                    />
                    <div className="flex-1 pb-2">
                      <div className="text-saffron text-xs font-bold tracking-wide mb-0.5 md:hidden">
                        {item.year}
                      </div>
                      <div className="font-semibold text-white text-[15px] mb-1.5">
                        {item.title}
                      </div>
                      <p className="text-white/50 text-sm leading-[1.7]">{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-marble" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3 text-center">
            What We Believe
          </div>
          <h2
            className="font-display font-bold text-ink mb-12 text-center leading-tight"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Our <em className="not-italic text-saffron">Values</em>
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-7 border border-marble">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <div className="font-display text-xl font-bold text-ink mb-3">{v.title}</div>
                  <p className="text-muted text-[15px] leading-[1.7]">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Eco stats */}
      <div className="bg-leaf-l" style={{ padding: "80px 40px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-leaf mb-3 text-center">
            Our Eco Impact
          </div>
          <h2
            className="font-display font-bold text-ink mb-10 text-center leading-tight"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            Numbers that <em className="not-italic text-leaf">matter</em>
          </h2>
          <div className="grid grid-cols-2 gap-5">
            {ECO_STATS.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 80}>
                <div
                  className="flex items-center gap-5 bg-white rounded-xl py-5 px-6"
                  style={{ borderLeft: "4px solid var(--leaf)" }}
                >
                  <div className="text-3xl shrink-0">{s.icon}</div>
                  <div>
                    <div className="font-display text-2xl font-bold text-leaf leading-none mb-0.5">
                      {s.value}
                    </div>
                    <div className="text-xs text-muted">{s.label}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-ink text-white text-center" style={{ padding: "64px 40px" }}>
        <h2 className="font-display text-[32px] font-bold mb-4">Come be part of the story</h2>
        <p className="text-white/60 mb-8 max-w-[480px] mx-auto text-[15px] leading-[1.7]">
          Every guest who walks through our door becomes part of VMP Villa&apos;s history.
          We&apos;d love you to be the next chapter.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href={WA_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white font-semibold px-10 py-4 rounded-lg transition-all duration-150"
          >
            💬 Chat with Aneesh
          </a>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-10 py-4 rounded-lg transition-all duration-150 border border-white/20"
          >
            🛏️ View Rooms
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top 5 Places to Visit in Agra Beyond the Taj Mahal — VMP Villa Blog",
  description:
    "Agra is far more than the Taj. From the mighty Agra Fort to the ghost city of Fatehpur Sikri, discover the five unmissable attractions most tourists miss — with insider tips from VMP Villa.",
};

const PLACES = [
  {
    rank: 1,
    name: "Taj Mahal",
    emoji: "🕌",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=80",
    imageAlt: "Taj Mahal reflecting in the central pool at sunrise",
    distance: "4.2 km from VMP Villa",
    timing: "Sunrise – 6:00 PM (closed Fridays)",
    entry: "₹50 Indians · ₹1,100 foreigners",
    tip: "Visit at sunrise — the marble glows orange-pink and the crowds are thinnest. Book your sunrise entry ticket online 2–3 days in advance to avoid queues at the gate.",
    description:
      "No list of Agra attractions would be complete without the world's greatest monument to love. Built by Mughal emperor Shah Jahan between 1631 and 1648 for his beloved wife Mumtaz Mahal, the Taj Mahal is a UNESCO World Heritage Site and one of the Seven Wonders of the World. The sheer scale is breath-taking in person — 73 metres tall, clad entirely in white Makrana marble inlaid with 28 types of semi-precious stone. Arrive at first light and watch the dome shift from pale grey to gold as the sun rises over the Yamuna river. Come back at full moon for the rare Taj by Moonlight experience (ticketed separately). From VMP Villa, you can walk to the South Gate in under an hour or take a tuk-tuk for ₹100.",
  },
  {
    rank: 2,
    name: "Agra Fort",
    emoji: "🏰",
    image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=900&q=80",
    imageAlt: "Red sandstone walls and towers of Agra Fort",
    distance: "6.5 km from VMP Villa",
    timing: "Sunrise – 6:00 PM (daily)",
    entry: "₹40 Indians · ₹600 foreigners",
    tip: "Climb the Musamman Burj tower — this is where Shah Jahan was imprisoned by his son Aurangzeb and spent his final years gazing at the Taj Mahal across the river. The view is heartbreaking and unforgettable.",
    description:
      "Two kilometres from the Taj Mahal, the great red-sandstone Agra Fort is often skipped by day-trippers — which is a massive mistake. This UNESCO-listed citadel was home to four Mughal emperors, and walking its walls is like stepping inside a history textbook. The fort covers 94 acres and took 4,000 builders eight years to construct under Akbar the Great. Inside are exquisite palaces — the Jahangiri Mahal, Khas Mahal, and the white marble Diwan-i-Khas where emperors received dignitaries. The fort is best explored over two hours with an audio guide (₹118 for Indians, ₹318 for foreigners) available at the Amar Singh Gate entrance.",
  },
  {
    rank: 3,
    name: "Fatehpur Sikri",
    emoji: "🏛️",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80",
    imageAlt: "The grand Buland Darwaza gateway of Fatehpur Sikri at dusk",
    distance: "37 km from VMP Villa (~45 min by car)",
    timing: "Sunrise – 6:00 PM (daily)",
    entry: "₹40 Indians · ₹610 foreigners",
    tip: "Hire a local guide at the entrance for ₹300–500. They bring the ghost stories to life — why the entire city was abandoned just 14 years after completion (water scarcity) and which room the emperor's Hindu queen Jodha Bai lived in.",
    description:
      "Akbar built an entire imperial capital here between 1571 and 1585 — and then abandoned it. Today, Fatehpur Sikri is one of the best-preserved Mughal cities in India and arguably more impressive than the Taj in its architectural ambition. The complex blends Persian, Indian, and Islamic styles in stunning red sandstone. Don't miss the Buland Darwaza (Victory Gate) — at 54 metres, it's the highest gateway in the world. Inside, the Jama Masjid is one of India's finest mosques, and the tomb of Sufi saint Salim Chishti with its intricate marble lattice screens is otherworldly. Pair this with a stop at Sikandra (Akbar's mausoleum) on the drive back to Agra.",
  },
  {
    rank: 4,
    name: "Mehtab Bagh (Moonlight Garden)",
    emoji: "🌙",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=900&q=80",
    imageAlt: "View of the Taj Mahal from across the Yamuna river at dusk from Mehtab Bagh",
    distance: "5.5 km from VMP Villa",
    timing: "Sunrise – 7:30 PM (daily)",
    entry: "₹30 Indians · ₹300 foreigners",
    tip: "Come 30–45 minutes before sunset. You'll watch the Taj slowly turn from white to gold to rose to deep violet — all with almost no other tourists around. Bring a telephoto lens if you have one.",
    description:
      "This is the local secret that most tourists miss completely. Mehtab Bagh (\"Moonlight Garden\") sits directly across the Yamuna river from the Taj Mahal and offers an unobstructed, crowd-free view of the monument at sunset. Shah Jahan originally planned to build a black marble Taj here as his own mausoleum — a mirror image facing the white Taj — but the project was halted when Aurangzeb imprisoned him. The garden has since been restored by the Archaeological Survey of India and the old octagonal pond, when still, perfectly reflects the Taj dome in its waters. Entry is a fraction of the Taj's price and visitor numbers are a fraction too. An absolute must-do.",
  },
  {
    rank: 5,
    name: "Itimad-ud-Daulah (Baby Taj)",
    emoji: "💎",
    image: "https://images.unsplash.com/photo-1532664189809-02133fee698d?w=900&q=80",
    imageAlt: "Ornate white marble tomb of Itimad-ud-Daulah with delicate pietra dura inlay work",
    distance: "7 km from VMP Villa",
    timing: "Sunrise – 6:00 PM (daily)",
    entry: "₹30 Indians · ₹310 foreigners",
    tip: "Touch the walls and look closely at the pietra dura inlay — you can see semi-precious stones (lapis lazuli, jasper, onyx) cut to hair-thin precision and set into the marble. The craftsmanship is even finer than the Taj up close.",
    description:
      "Often called the 'Baby Taj', Itimad-ud-Daulah was actually built before the Taj Mahal and is considered the prototype for it. Commissioned by Empress Nur Jahan between 1622 and 1628 for her father (Ghiyas Beg, the Prime Minister of Emperor Jahangir), this exquisite white marble mausoleum is the first Mughal building made entirely of marble instead of red sandstone. What makes it special is the pietra dura inlay work — intricate mosaic patterns made from coloured gemstones set flush into the marble. The motifs cover virtually every surface: wine bottles, cypress trees, geometric stars. The surrounding garden with its formal Charbagh layout is beautifully maintained and almost always quiet. A two-hour visit here paired with Mehtab Bagh makes a perfect afternoon.",
  },
];

export default function BlogPostPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-ink text-white" style={{ padding: "64px 40px 52px" }}>
        <div className="max-w-[760px] mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-saffron text-sm font-medium mb-6 hover:text-white transition-colors">
            ← Back to Blog
          </Link>
          <div
            className="inline-block text-white text-[10px] font-bold tracking-wide uppercase py-1 px-2.5 rounded mb-4"
            style={{ background: "#e8762b" }}
          >
            Travel Guide
          </div>
          <h1
            className="font-display font-black text-white mb-5 leading-tight"
            style={{ fontSize: "clamp(28px, 4.5vw, 48px)" }}
          >
            Top 5 Places to Visit in Agra{" "}
            <em className="not-italic text-saffron">Beyond the Taj Mahal</em>
          </h1>
          <p className="text-white/60 text-[15px] leading-[1.7] max-w-[600px]">
            Agra is far more than the Taj. From the mighty Agra Fort to the ghost city of Fatehpur Sikri,
            here are five unmissable experiences — with insider tips from your VMP Villa hosts.
          </p>
          <div className="flex items-center gap-4 mt-5 text-sm text-white/40">
            <span>By Aneesh &amp; Bhavna Mishra</span>
            <span>·</span>
            <span>July 1, 2026</span>
            <span>·</span>
            <span>6 min read</span>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative h-[340px] md:h-[480px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&q=80"
          alt="Taj Mahal at sunrise seen from the Yamuna riverbank"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream/40 to-transparent" />
      </div>

      {/* Article body */}
      <div className="bg-cream" style={{ padding: "60px 40px 80px" }}>
        <div className="max-w-[760px] mx-auto">

          {/* Intro */}
          <p className="text-[16px] text-ink leading-[1.85] mb-10">
            Most visitors arrive in Agra, spend a frantic few hours at the Taj Mahal, and leave on the same day.
            That&apos;s a shame — Agra rewards those who linger. This city was the heart of the Mughal Empire for over
            a century, and the monuments, gardens, and stories it holds go far deeper than one marble tomb.
            Here are our top five recommendations, with honest timing, entry cost, and insider tips from living here.
          </p>

          {/* Places */}
          <div className="space-y-16">
            {PLACES.map((place) => (
              <article key={place.rank}>
                {/* Rank + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-display text-5xl font-black leading-none"
                    style={{ color: "var(--marble)" }}
                  >
                    {place.rank}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-ink leading-tight">
                      {place.emoji} {place.name}
                    </h2>
                    <span className="text-xs text-stone">{place.distance}</span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative rounded-xl overflow-hidden mb-5" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={place.image}
                    alt={place.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 760px"
                  />
                </div>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <Chip icon="🕐" label={place.timing} />
                  <Chip icon="🎫" label={place.entry} />
                </div>

                {/* Body */}
                <p className="text-[15px] text-ink leading-[1.85] mb-5">{place.description}</p>

                {/* Insider tip */}
                <div className="bg-saffron/8 border-l-4 border-saffron rounded-r-xl p-4">
                  <div className="text-xs font-bold tracking-widest uppercase text-saffron mb-1">Insider Tip</div>
                  <p className="text-sm text-ink leading-relaxed">{place.tip}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Closing */}
          <div className="mt-16 pt-10 border-t border-marble">
            <h2 className="font-display text-xl font-bold text-ink mb-3">Planning Your Visit?</h2>
            <p className="text-[15px] text-ink leading-[1.85] mb-4">
              Most of these sites can be covered in 2–3 full days. Agra Fort and the Taj make a perfect Day 1 (do the
              Taj at sunrise, Agra Fort in the afternoon). Mehtab Bagh and Itimad-ud-Daulah fill a relaxed Day 2
              morning plus afternoon. Fatehpur Sikri with Sikandra deserves a full Day 3.
            </p>
            <p className="text-[15px] text-ink leading-[1.85] mb-8">
              At VMP Villa, we&apos;re happy to arrange tuk-tuks, taxis, and guided tours for all of these at local
              rates — just ask us at check-in. We&apos;re 4.2 km from the Taj South Gate, so you won&apos;t waste
              half your morning commuting.
            </p>

            <div className="bg-white rounded-2xl border border-marble p-8 text-center">
              <div className="text-3xl mb-3">🏡</div>
              <h3 className="font-display text-lg font-bold text-ink mb-2">
                Stay With Us in Agra
              </h3>
              <p className="text-sm text-muted mb-5 max-w-[380px] mx-auto">
                Book direct with VMP Villa and save 15–20% vs OTAs. Breakfast included, insider tips provided, WiFi guaranteed.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Link
                  href="/book"
                  className="bg-saffron hover:bg-saffron-d text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
                >
                  Book Your Stay →
                </Link>
                <Link
                  href="/rooms"
                  className="bg-marble hover:bg-stone/20 text-ink font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
                >
                  View Rooms
                </Link>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="mt-10 text-center">
            <Link href="/blog" className="text-saffron text-sm font-medium hover:text-saffron-d transition-colors">
              ← Back to all posts
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          div[style*="padding: 64px 40px"] { padding: 48px 20px 40px !important; }
          div[style*="padding: 60px 40px"] { padding: 40px 20px 60px !important; }
        }
        .bg-saffron\/8 { background: rgba(232,118,43,0.08); }
      `}</style>
    </div>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white border border-marble rounded-full text-xs text-muted px-3 py-1.5 font-medium">
      {icon} {label}
    </span>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

const BASE = "https://www.vmpvilla.in";
const SLUG = "top-5-places-to-visit-in-agra";
const PAGE_URL = `${BASE}/blog/${SLUG}`;
const OG_IMAGE = "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80";
const PUBLISHED = "2026-07-01";

export const metadata: Metadata = {
  title: "Top 5 Places to Visit in Agra Beyond the Taj Mahal",
  description:
    "Discover the top 5 must-visit attractions in Agra: Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh, and Itimad-ud-Daulah (Baby Taj). Entry fees, timings, and insider tips from local hosts.",
  keywords: [
    "places to visit in Agra",
    "top tourist places in Agra",
    "Agra tourist attractions",
    "Agra Fort entry fee timings",
    "Fatehpur Sikri visit guide",
    "Mehtab Bagh Agra",
    "Baby Taj Itimad-ud-Daulah",
    "things to do in Agra",
    "Agra travel guide 2026",
    "Agra beyond Taj Mahal",
    "best places Agra India",
    "Taj Mahal sunrise visit",
  ],
  authors: [{ name: "Aneesh & Bhavna Mishra", url: BASE }],
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title: "Top 5 Places to Visit in Agra Beyond the Taj Mahal",
    description:
      "Agra is far more than the Taj. From Agra Fort to the ghost city of Fatehpur Sikri — five unmissable attractions with entry fees, timings, and insider tips.",
    siteName: "VMP Villa Home Stay",
    locale: "en_IN",
    publishedTime: PUBLISHED,
    authors: ["Aneesh & Bhavna Mishra"],
    tags: ["Agra", "Travel", "India Tourism", "Taj Mahal", "Agra Fort", "Fatehpur Sikri"],
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Taj Mahal at sunrise, Agra, India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vmp_homestay_agra",
    title: "Top 5 Places to Visit in Agra — Local Insider Guide",
    description:
      "Beyond the Taj Mahal: Agra Fort, Fatehpur Sikri, Mehtab Bagh & Baby Taj with entry fees and insider tips.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": PAGE_URL,
      "headline": "Top 5 Places to Visit in Agra Beyond the Taj Mahal",
      "description": "Discover five unmissable Agra attractions beyond the Taj Mahal — with entry fees, timings, and insider tips from local hosts at VMP Villa Home Stay.",
      "image": {
        "@type": "ImageObject",
        "url": OG_IMAGE,
        "width": 1200,
        "height": 630,
      },
      "author": {
        "@type": "Person",
        "name": "Aneesh & Bhavna Mishra",
        "url": BASE,
      },
      "publisher": {
        "@type": "Organization",
        "name": "VMP Villa Home Stay",
        "url": BASE,
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE}/logo.png`,
        },
      },
      "datePublished": PUBLISHED,
      "dateModified": PUBLISHED,
      "mainEntityOfPage": PAGE_URL,
      "url": PAGE_URL,
      "inLanguage": "en-IN",
      "keywords": "places to visit in Agra, Agra tourist attractions, Taj Mahal, Agra Fort, Fatehpur Sikri",
      "articleSection": "Travel Guide",
      "wordCount": 1800,
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE}/blog` },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Top 5 Places to Visit in Agra",
          "item": PAGE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the top 5 places to visit in Agra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The top 5 places to visit in Agra are: 1) Taj Mahal — the iconic marble mausoleum best seen at sunrise; 2) Agra Fort — a UNESCO-listed Mughal fortress; 3) Fatehpur Sikri — a ghost Mughal city 37 km from Agra; 4) Mehtab Bagh — a garden with the best sunset view of the Taj Mahal with almost no crowds; and 5) Itimad-ud-Daulah (Baby Taj) — the marble prototype of the Taj with exquisite gemstone inlay work.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the entry fee for Agra Fort?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The entry fee for Agra Fort is ₹40 for Indian citizens and ₹600 for foreign nationals. It is open daily from sunrise to 6:00 PM. Audio guides are available at the Amar Singh Gate entrance for ₹118 (Indians) or ₹318 (foreigners).",
          },
        },
        {
          "@type": "Question",
          "name": "How far is Fatehpur Sikri from Agra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fatehpur Sikri is approximately 37 km from Agra city centre, about a 45-minute drive by car or taxi. It is open daily from sunrise to 6:00 PM. Entry is ₹40 for Indians and ₹610 for foreign nationals.",
          },
        },
        {
          "@type": "Question",
          "name": "What is Mehtab Bagh and why should I visit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mehtab Bagh (Moonlight Garden) is a Mughal garden directly across the Yamuna river from the Taj Mahal. It offers the best sunset view of the Taj Mahal with very few tourists. Entry is ₹30 for Indians and ₹300 for foreigners. Visit 30–45 minutes before sunset to watch the Taj turn from white to gold to violet.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the best time to visit the Taj Mahal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit the Taj Mahal is at sunrise. The marble dome glows orange-pink in the early light, crowds are thinnest, and the air is cooler. Book your sunrise entry ticket online 2–3 days in advance. The Taj is closed on Fridays.",
          },
        },
        {
          "@type": "Question",
          "name": "How many days do I need to see Agra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You need at least 2–3 days to see Agra properly. Day 1: Taj Mahal at sunrise + Agra Fort in the afternoon. Day 2: Mehtab Bagh + Itimad-ud-Daulah (Baby Taj). Day 3: Full day trip to Fatehpur Sikri with a stop at Sikandra (Akbar's Tomb) on the way back.",
          },
        },
      ],
    },
    {
      "@type": "TouristDestination",
      "@id": `${BASE}/location`,
      "name": "Agra, Uttar Pradesh, India",
      "description": "Home of the Taj Mahal, Agra Fort, and other UNESCO World Heritage Sites. A major destination for cultural tourism in India.",
      "touristType": ["Culture", "Heritage", "History"],
      "hasMap": "https://www.google.com/maps/place/Agra,+Uttar+Pradesh",
    },
  ],
};

const PLACES = [
  {
    rank: 1,
    name: "Taj Mahal",
    emoji: "🕌",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&q=85",
    imageAlt: "Taj Mahal at sunrise reflected in the central pool, Agra, India",
    distance: "4.2 km from VMP Villa",
    timing: "Sunrise – 6:00 PM (closed Fridays)",
    entry: "₹50 Indians · ₹1,100 foreigners",
    tip: "Visit at sunrise — the marble glows orange-pink and crowds are thinnest. Book your sunrise entry ticket online 2–3 days in advance to avoid queues at the gate.",
    description:
      "No list of Agra attractions would be complete without the world's greatest monument to love. Built by Mughal emperor Shah Jahan between 1631 and 1648 for his beloved wife Mumtaz Mahal, the Taj Mahal is a UNESCO World Heritage Site and one of the Seven Wonders of the World. The sheer scale is breath-taking in person — 73 metres tall, clad entirely in white Makrana marble inlaid with 28 types of semi-precious stone. Arrive at first light and watch the dome shift from pale grey to gold as the sun rises over the Yamuna river. Come back at full moon for the rare Taj by Moonlight experience (ticketed separately). From VMP Villa, you can walk to the South Gate in under an hour or take a tuk-tuk for ₹100.",
    schema: {
      "@type": "TouristAttraction",
      "name": "Taj Mahal",
      "description": "UNESCO World Heritage Site — a white marble mausoleum built by Mughal Emperor Shah Jahan for his wife Mumtaz Mahal.",
      "url": "https://en.wikipedia.org/wiki/Taj_Mahal",
      "address": { "@type": "PostalAddress", "addressLocality": "Agra", "addressRegion": "Uttar Pradesh", "addressCountry": "IN" },
      "openingHours": "Mo Tu We Th Sa Su 06:00-18:00",
    },
  },
  {
    rank: 2,
    name: "Agra Fort",
    emoji: "🏰",
    image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=1000&q=85",
    imageAlt: "Red sandstone walls and towers of Agra Fort, a UNESCO World Heritage Site",
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
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000&q=85",
    imageAlt: "The grand Buland Darwaza gateway of Fatehpur Sikri, the world's tallest gateway",
    distance: "37 km from VMP Villa (~45 min by car)",
    timing: "Sunrise – 6:00 PM (daily)",
    entry: "₹40 Indians · ₹610 foreigners",
    tip: "Hire a local guide at the entrance for ₹300–500. They bring the ghost stories to life — why the entire city was abandoned just 14 years after completion and which room the emperor's Hindu queen Jodha Bai lived in.",
    description:
      "Akbar built an entire imperial capital here between 1571 and 1585 — and then abandoned it. Today, Fatehpur Sikri is one of the best-preserved Mughal cities in India and arguably more impressive than the Taj in its architectural ambition. The complex blends Persian, Indian, and Islamic styles in stunning red sandstone. Don't miss the Buland Darwaza (Victory Gate) — at 54 metres, it's the highest gateway in the world. Inside, the Jama Masjid is one of India's finest mosques, and the tomb of Sufi saint Salim Chishti with its intricate marble lattice screens is otherworldly. Pair this with a stop at Sikandra (Akbar's mausoleum) on the drive back to Agra.",
  },
  {
    rank: 4,
    name: "Mehtab Bagh (Moonlight Garden)",
    emoji: "🌙",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000&q=85",
    imageAlt: "Sunset view of the Taj Mahal from across the Yamuna river at Mehtab Bagh garden",
    distance: "5.5 km from VMP Villa",
    timing: "Sunrise – 7:30 PM (daily)",
    entry: "₹30 Indians · ₹300 foreigners",
    tip: "Come 30–45 minutes before sunset. Watch the Taj slowly turn from white to gold to rose to deep violet — with almost no other tourists around. Bring a telephoto lens if you have one.",
    description:
      "This is the local secret that most tourists miss completely. Mehtab Bagh (\"Moonlight Garden\") sits directly across the Yamuna river from the Taj Mahal and offers an unobstructed, crowd-free view of the monument at sunset. Shah Jahan originally planned to build a black marble Taj here as his own mausoleum — a mirror image facing the white Taj — but the project was halted when Aurangzeb imprisoned him. The garden has since been restored by the Archaeological Survey of India and the old octagonal pond, when still, perfectly reflects the Taj dome in its waters. Entry is a fraction of the Taj's price and visitor numbers are a fraction too. An absolute must-do.",
  },
  {
    rank: 5,
    name: "Itimad-ud-Daulah (Baby Taj)",
    emoji: "💎",
    image: "https://images.unsplash.com/photo-1532664189809-02133fee698d?w=1000&q=85",
    imageAlt: "Ornate white marble tomb of Itimad-ud-Daulah with intricate pietra dura gemstone inlay, Agra",
    distance: "7 km from VMP Villa",
    timing: "Sunrise – 6:00 PM (daily)",
    entry: "₹30 Indians · ₹310 foreigners",
    tip: "Touch the walls and look closely at the pietra dura inlay — you can see semi-precious stones (lapis lazuli, jasper, onyx) cut to hair-thin precision and set into the marble. The craftsmanship is even finer than the Taj up close.",
    description:
      "Often called the 'Baby Taj', Itimad-ud-Daulah was actually built before the Taj Mahal and is considered the prototype for it. Commissioned by Empress Nur Jahan between 1622 and 1628 for her father (Ghiyas Beg, the Prime Minister of Emperor Jahangir), this exquisite white marble mausoleum is the first Mughal building made entirely of marble. What makes it special is the pietra dura inlay work — intricate mosaic patterns made from coloured gemstones set flush into the marble. The motifs cover virtually every surface: wine bottles, cypress trees, geometric stars. The surrounding garden with its formal Charbagh layout is beautifully maintained and almost always quiet. A two-hour visit here paired with Mehtab Bagh makes a perfect afternoon.",
  },
];

export default function BlogPostPage() {
  return (
    <>
      <Script
        id="ld-blog-post"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        {/* Breadcrumb */}
        <nav className="bg-white border-b border-marble" style={{ padding: "10px 40px" }} aria-label="Breadcrumb">
          <div className="max-w-[760px] mx-auto">
            <ol className="flex items-center gap-2 text-xs text-stone flex-wrap">
              <li><Link href="/" className="hover:text-saffron transition-colors">Home</Link></li>
              <li className="opacity-40">›</li>
              <li><Link href="/blog" className="hover:text-saffron transition-colors">Blog</Link></li>
              <li className="opacity-40">›</li>
              <li className="text-muted truncate">Top 5 Places to Visit in Agra</li>
            </ol>
          </div>
        </nav>

        {/* Header */}
        <div className="bg-ink text-white" style={{ padding: "52px 40px 44px" }}>
          <div className="max-w-[760px] mx-auto">
            <div
              className="inline-block text-white text-[10px] font-bold tracking-wide uppercase py-1 px-2.5 rounded mb-4"
              style={{ background: "#e8762b" }}
            >
              Travel Guide
            </div>
            <h1
              className="font-display font-black text-white mb-5 leading-tight"
              style={{ fontSize: "clamp(26px, 4vw, 44px)" }}
            >
              Top 5 Places to Visit in Agra{" "}
              <em className="not-italic text-saffron">Beyond the Taj Mahal</em>
            </h1>
            <p className="text-white/65 text-[15px] leading-[1.75] max-w-[600px]">
              Agra is far more than one marble tomb. From the mighty Mughal fort to a ghost city in the
              desert — five unmissable attractions with entry fees, timings, and insider tips from your local hosts.
            </p>
            <div className="flex items-center gap-4 mt-5 text-sm text-white/40 flex-wrap">
              <span>By Aneesh &amp; Bhavna Mishra · VMP Villa</span>
              <span>·</span>
              <time dateTime={PUBLISHED}>July 1, 2026</time>
              <span>·</span>
              <span>6 min read</span>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative h-[300px] md:h-[460px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&q=85"
            alt="Taj Mahal at sunrise seen from the Yamuna riverbank — Agra's most iconic attraction"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream/50 to-transparent" />
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-[10px] text-white/60 bg-ink/40 px-3 py-1 rounded-full">
              Taj Mahal, Agra · Photo via Unsplash
            </span>
          </div>
        </div>

        {/* Article body */}
        <div className="bg-cream" style={{ padding: "56px 40px 80px" }}>
          <div className="max-w-[760px] mx-auto">

            {/* Quick reference table */}
            <div className="bg-white rounded-xl border border-marble p-5 mb-10 overflow-x-auto">
              <h2 className="font-display font-bold text-ink text-base mb-3">At a Glance</h2>
              <table className="w-full text-xs text-muted" style={{ minWidth: 480 }}>
                <thead>
                  <tr className="border-b border-marble text-left">
                    <th className="pb-2 text-stone font-bold uppercase tracking-wide pr-4">#</th>
                    <th className="pb-2 text-stone font-bold uppercase tracking-wide pr-4">Place</th>
                    <th className="pb-2 text-stone font-bold uppercase tracking-wide pr-4">Distance from VMP Villa</th>
                    <th className="pb-2 text-stone font-bold uppercase tracking-wide pr-4">Entry (Indian)</th>
                    <th className="pb-2 text-stone font-bold uppercase tracking-wide">Entry (Foreign)</th>
                  </tr>
                </thead>
                <tbody>
                  {PLACES.map((p) => (
                    <tr key={p.rank} className="border-b border-marble/50 last:border-0">
                      <td className="py-2 pr-4 font-bold text-ink">{p.rank}</td>
                      <td className="py-2 pr-4 font-medium text-ink">{p.emoji} {p.name}</td>
                      <td className="py-2 pr-4">{p.distance}</td>
                      <td className="py-2 pr-4">{p.entry.split("·")[0].trim()}</td>
                      <td className="py-2">{p.entry.split("·")[1]?.trim()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Intro */}
            <p className="text-[16px] text-ink leading-[1.85] mb-10">
              Most visitors arrive in Agra, spend a frantic few hours at the Taj Mahal, and leave on the same day.
              That&apos;s a shame — Agra rewards those who linger. This city was the heart of the Mughal Empire for
              over a century, and the monuments, gardens, and stories it holds go far deeper than one marble tomb.
              Here are our top five recommendations, with honest timing, entry cost, and insider tips from living here.
            </p>

            {/* Places */}
            <div className="space-y-16">
              {PLACES.map((place) => (
                <article key={place.rank} itemScope itemType="https://schema.org/TouristAttraction">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="font-display text-5xl font-black leading-none select-none"
                      style={{ color: "var(--marble)" }}
                      aria-hidden
                    >
                      {place.rank}
                    </span>
                    <div>
                      <h2
                        className="font-display text-2xl font-bold text-ink leading-tight"
                        itemProp="name"
                      >
                        {place.emoji} {place.name}
                      </h2>
                      <span className="text-xs text-stone">{place.distance}</span>
                    </div>
                  </div>

                  <div className="relative rounded-xl overflow-hidden mb-5 shadow-sm" style={{ aspectRatio: "16/9" }}>
                    <Image
                      src={place.image}
                      alt={place.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 760px"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <Chip icon="🕐" label={place.timing} />
                    <Chip icon="🎫" label={place.entry} />
                  </div>

                  <p
                    className="text-[15px] text-ink leading-[1.85] mb-5"
                    itemProp="description"
                  >
                    {place.description}
                  </p>

                  <div className="bg-amber-50 border-l-4 border-saffron rounded-r-xl p-4">
                    <div className="text-xs font-bold tracking-widest uppercase text-saffron mb-1.5">
                      ✨ Insider Tip from VMP Villa
                    </div>
                    <p className="text-sm text-ink leading-relaxed">{place.tip}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* FAQ Section — helps get Google FAQ rich snippets */}
            <section className="mt-16 pt-10 border-t border-marble">
              <h2 className="font-display text-xl font-bold text-ink mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "How many days do I need to see all of Agra properly?",
                    a: "You need 2–3 days. Day 1: Taj Mahal at sunrise + Agra Fort in the afternoon. Day 2: Mehtab Bagh sunset + Itimad-ud-Daulah in the morning. Day 3: full day trip to Fatehpur Sikri with a stop at Sikandra on the way back.",
                  },
                  {
                    q: "What is the cheapest way to travel between Agra's monuments?",
                    a: "Tuk-tuks (auto rickshaws) are cheapest at ₹80–150 per short hop. For a full day covering multiple sites, hire a taxi/cab for ₹800–1,200. You can also rent a cycle rickshaw near the Taj South Gate area.",
                  },
                  {
                    q: "Is Fatehpur Sikri worth visiting from Agra?",
                    a: "Absolutely. It's 37 km away (45 min by car) and entry is inexpensive. Most tourists skip it and miss one of India's finest Mughal complexes. Combine it with Sikandra (Akbar's Tomb) on the same day.",
                  },
                  {
                    q: "Can I visit all 5 places in one day?",
                    a: "Not recommended. Taj Mahal alone deserves 2–3 hours, Agra Fort another 2 hours, and Fatehpur Sikri a half day. Rushing through all five would leave you exhausted and without time to appreciate the details.",
                  },
                ].map(({ q, a }) => (
                  <details
                    key={q}
                    className="bg-white border border-marble rounded-xl overflow-hidden group"
                  >
                    <summary className="p-4 font-semibold text-sm text-ink cursor-pointer list-none flex justify-between items-center hover:bg-cream/50 transition-colors">
                      {q}
                      <span className="text-saffron ml-3 shrink-0 group-open:rotate-45 transition-transform text-lg">+</span>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-muted leading-relaxed">{a}</div>
                  </details>
                ))}
              </div>
            </section>

            {/* Closing / CTA */}
            <div className="mt-14 pt-10 border-t border-marble">
              <h2 className="font-display text-xl font-bold text-ink mb-3">
                Planning Your Agra Visit?
              </h2>
              <p className="text-[15px] text-ink leading-[1.85] mb-8">
                At VMP Villa, we&apos;re happy to arrange tuk-tuks, taxis, and guided tours for all these sites at
                local rates — just ask at check-in. We&apos;re just 4.2 km from the Taj South Gate, meaning you can be
                at sunrise entry before most hotel guests have had breakfast.
              </p>

              <div className="bg-white rounded-2xl border border-marble p-8 text-center">
                <div className="text-3xl mb-3">🏡</div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">Stay With Us in Agra</h3>
                <p className="text-sm text-muted mb-5 max-w-[380px] mx-auto">
                  Book direct with VMP Villa and save 15–20% vs OTAs. Breakfast, WiFi, and local tips included.
                  Just 4.2 km from the Taj Mahal.
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

            <div className="mt-10 text-center">
              <Link href="/blog" className="text-saffron text-sm font-medium hover:text-saffron-d transition-colors">
                ← Back to all posts
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 600px) {
            div[style*="padding: 52px 40px"] { padding: 40px 20px 32px !important; }
            div[style*="padding: 56px 40px"] { padding: 36px 20px 60px !important; }
            nav[style*="padding: 10px 40px"] { padding: 10px 20px !important; }
          }
        `}</style>
      </div>
    </>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white border border-marble rounded-full text-xs text-muted px-3 py-1.5 font-medium">
      {icon} {label}
    </span>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Travel Blog — VMP Villa Home Stay, Agra",
  description:
    "Insider guides to Agra's best attractions, hidden gems, food, and travel tips from your hosts at VMP Villa Home Stay — 4.2 km from the Taj Mahal.",
};

const POSTS = [
  {
    slug: "top-5-places-to-visit-in-agra",
    title: "Top 5 Places to Visit in Agra Beyond the Taj Mahal",
    excerpt:
      "Agra is far more than the Taj. From the mighty Agra Fort to the ghost city of Fatehpur Sikri, here are five unmissable experiences that most tourists miss.",
    cover: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    coverAlt: "Taj Mahal at sunrise reflected in the Yamuna river",
    date: "July 1, 2026",
    readTime: "6 min read",
    category: "Travel Guide",
    categoryColor: "#e8762b",
  },
];

export default function BlogPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-ink text-white" style={{ padding: "64px 40px 56px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
            Stories & Guides
          </div>
          <h1
            className="font-display font-black text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(32px, 5vw, 52px)" }}
          >
            The VMP Villa <em className="not-italic text-saffron">Travel Blog</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[540px] leading-[1.7]">
            Insider guides, hidden gems, food tips, and local secrets from Aneesh &amp; Bhavna —
            your hosts in the heart of Agra.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="bg-cream" style={{ padding: "60px 40px 80px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-white rounded-2xl overflow-hidden border border-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] h-full flex flex-col">
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <Image
                      src={post.cover}
                      alt={post.coverAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div
                      className="absolute top-3 left-3 text-white text-[10px] font-bold tracking-wide uppercase py-1 px-2.5 rounded"
                      style={{ background: post.categoryColor }}
                    >
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-xs text-stone mb-2">
                      {post.date} · {post.readTime}
                    </div>
                    <h2 className="font-display text-lg font-bold text-ink mb-2 group-hover:text-saffron transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed flex-1">{post.excerpt}</p>
                    <div className="mt-4 text-saffron text-sm font-semibold">
                      Read more →
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-white rounded-2xl border border-marble p-10">
            <div className="text-3xl mb-3">🏡</div>
            <h2 className="font-display text-xl font-bold text-ink mb-2">
              Staying in Agra? We&apos;d love to host you.
            </h2>
            <p className="text-muted text-sm mb-5 max-w-[400px] mx-auto">
              Book direct with us and save 15–20% vs OTAs. Free WiFi, home-cooked breakfast, and insider tips included.
            </p>
            <Link
              href="/book"
              className="inline-block bg-saffron hover:bg-saffron-d text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
            >
              Book Your Stay →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          div[style*="padding: 64px 40px"] { padding: 48px 20px 40px !important; }
          div[style*="padding: 60px 40px"] { padding: 40px 20px 60px !important; }
        }
      `}</style>
    </div>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import Script from "next/script";

const BASE = "https://www.vmpvilla.in";

export const metadata: Metadata = {
  title: "Travel Blog — Agra Travel Guides & Tips",
  description:
    "Insider travel guides to Agra's best attractions, food, and hidden gems — written by local hosts Aneesh & Bhavna at VMP Villa Home Stay, 6 km from the Taj Mahal East Gate.",
  keywords: [
    "Agra travel blog",
    "Agra travel guide",
    "things to do in Agra",
    "Agra tourist places",
    "Taj Mahal travel tips",
    "Agra local guide",
    "Agra food guide",
    "best homestay Agra blog",
    "VMP Villa blog",
    "Agra India tourism",
  ],
  openGraph: {
    type: "website",
    url: `${BASE}/blog`,
    title: "Travel Blog — Agra Travel Guides & Tips | VMP Villa",
    description:
      "Insider guides to Agra's top attractions, hidden gems, and local tips from your VMP Villa hosts — 6 km from the Taj Mahal East Gate.",
    siteName: "VMP Villa Home Stay",
    locale: "en_IN",
    images: [
      {
        url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Taj Mahal at sunrise — Agra travel blog by VMP Villa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vmp_homestay_agra",
    title: "VMP Villa Travel Blog — Agra Insider Guides",
    description: "Local travel guides from hosts who actually live in Agra. Taj Mahal tips, hidden gems, itineraries.",
    images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80"],
  },
  alternates: { canonical: `${BASE}/blog` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const blogListJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": `${BASE}/blog`,
      "name": "VMP Villa Travel Blog",
      "description": "Insider travel guides to Agra's best attractions, food, and hidden gems.",
      "url": `${BASE}/blog`,
      "publisher": {
        "@type": "Organization",
        "name": "VMP Villa Home Stay",
        "url": BASE,
        "logo": { "@type": "ImageObject", "url": `${BASE}/logo.png` },
      },
      "inLanguage": "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE}/blog` },
      ],
    },
    {
      "@type": "Organization",
      "name": "VMP Villa Home Stay",
      "url": BASE,
      "logo": `${BASE}/logo.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "email": "hello@vmpvilla.in",
        "availableLanguage": ["English", "Hindi"],
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Tajganj",
        "addressLocality": "Agra",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "282001",
        "addressCountry": "IN",
      },
      "sameAs": [
        "https://www.instagram.com/vmp_homestay_agra",
        "https://www.booking.com",
      ],
    },
  ],
};

const POST_META = [
  {
    slug: "top-5-places-to-visit-in-agra",
    cover: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    coverAlt: "Taj Mahal at sunrise reflected in the central pool, Agra India",
    dateISO: "2026-07-01",
    categoryColor: "#e8762b",
  },
];

export default async function BlogPage() {
  const t = await getTranslations("blog");

  return (
    <>
      <Script
        id="ld-blog-list"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
      />

      <div>
        {/* Breadcrumb */}
        <nav className="bg-white border-b border-marble" style={{ padding: "10px 40px" }} aria-label="Breadcrumb">
          <div className="max-w-[1100px] mx-auto">
            <ol className="flex items-center gap-2 text-xs text-stone">
              <li><Link href="/" className="hover:text-saffron transition-colors">{t("breadcrumbHome")}</Link></li>
              <li className="opacity-40">›</li>
              <li className="text-muted">{t("eyebrow").split(" ")[2] ?? "Blog"}</li>
            </ol>
          </div>
        </nav>

        {/* Header */}
        <div className="bg-ink text-white" style={{ padding: "56px 40px 48px" }}>
          <div className="max-w-[1100px] mx-auto">
            <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
              {t("eyebrow")}
            </div>
            <h1
              className="font-display font-black text-white mb-4 leading-tight"
              style={{ fontSize: "clamp(30px, 5vw, 50px)" }}
            >
              {t("heading")} <em className="not-italic text-saffron">{t("headingAccent")}</em>
            </h1>
            <p className="text-white/60 text-[15px] max-w-[540px] leading-[1.7]">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Posts grid */}
        <div className="bg-cream" style={{ padding: "56px 40px 80px" }}>
          <div className="max-w-[1100px] mx-auto">
            <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
              {POST_META.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <article
                    className="bg-white rounded-2xl overflow-hidden border border-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] h-full flex flex-col"
                    itemScope
                    itemType="https://schema.org/BlogPosting"
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                      <Image
                        src={post.cover}
                        alt={post.coverAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        itemProp="image"
                      />
                      <div
                        className="absolute top-3 left-3 text-white text-[10px] font-bold tracking-wide uppercase py-1 px-2.5 rounded"
                        style={{ background: post.categoryColor }}
                      >
                        {t(`p${i}category`)}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-xs text-stone mb-2">
                        <time dateTime={post.dateISO} itemProp="datePublished">{t(`p${i}date`)}</time>
                        {" · "}{t(`p${i}readTime`)}
                      </div>
                      <h2
                        className="font-display text-lg font-bold text-ink mb-2 group-hover:text-saffron transition-colors leading-snug"
                        itemProp="headline"
                      >
                        {t(`p${i}title`)}
                      </h2>
                      <p className="text-sm text-muted leading-relaxed flex-1" itemProp="description">
                        {t(`p${i}excerpt`)}
                      </p>
                      <div className="mt-4 text-saffron text-sm font-semibold">
                        {t("readMore")}
                      </div>
                    </div>
                    <meta itemProp="url" content={`${BASE}/blog/${post.slug}`} />
                    <meta itemProp="author" content="Aneesh & Bhavna Mishra" />
                  </article>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center bg-white rounded-2xl border border-marble p-10">
              <div className="text-3xl mb-3">🏡</div>
              <h2 className="font-display text-xl font-bold text-ink mb-2">
                {t("ctaTitle")}
              </h2>
              <p className="text-muted text-sm mb-5 max-w-[420px] mx-auto">
                {t("ctaSub")}
              </p>
              <Link
                href="/book"
                className="inline-block bg-saffron hover:bg-saffron-d text-white font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
              >
                {t("ctaBtn")}
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 600px) {
            div[style*="padding: 56px 40px 48px"] { padding: 40px 20px 36px !important; }
            div[style*="padding: 56px 40px 80px"] { padding: 36px 20px 60px !important; }
            nav[style*="padding: 10px 40px"] { padding: 10px 20px !important; }
          }
        `}</style>
      </div>
    </>
  );
}

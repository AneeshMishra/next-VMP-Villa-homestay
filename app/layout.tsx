import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PushBanner from "@/components/PushBanner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vmpvilla.in"),
  title: {
    default: "VMP Villa Home Stay — Agra | Where Agra Feels Like Home",
    template: "%s | VMP Villa Home Stay Agra",
  },
  description:
    "A peaceful eco-conscious homestay in Agra, just 4.2 km from the Taj Mahal. Book directly and save. 3 room types, home-cooked meals, and heartfelt hospitality.",
  keywords: [
    "VMP Villa",
    "homestay Agra",
    "stay near Taj Mahal",
    "eco homestay Agra",
    "budget stay Agra",
    "bed and breakfast Agra",
    "family homestay Agra",
    "places to visit Agra",
    "Agra travel guide",
    "Taj Mahal hotel",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "VMP Villa Home Stay",
    url: "https://www.vmpvilla.in",
    title: "VMP Villa Home Stay — Agra",
    description:
      "A family-run eco-homestay 4.2 km from the Taj Mahal. Book direct and save on OTA commissions.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "VMP Villa Home Stay near the Taj Mahal, Agra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vmp_homestay_agra",
    title: "VMP Villa Home Stay — Agra",
    description: "Eco-conscious homestay near the Taj Mahal. Real hospitality. Direct booking.",
    images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "https://www.vmpvilla.in" },
  verification: {
    google: "add-your-google-search-console-verification-code-here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable}`}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 pt-[var(--nav-h)]">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <PushBanner />
      </body>
    </html>
  );
}

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
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "VMP Villa Home Stay",
    title: "VMP Villa Home Stay — Agra",
    description:
      "A family-run eco-homestay 4.2 km from the Taj Mahal. Book direct and save on OTA commissions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VMP Villa Home Stay — Agra",
    description: "Eco-conscious homestay near the Taj Mahal. Real hospitality. Direct booking.",
  },
  robots: { index: true, follow: true },
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

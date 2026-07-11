import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PushBanner from "@/components/PushBanner";
import { CurrencyProvider } from "@/context/CurrencyContext";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CurrencyProvider>
        <Nav />
        <main className="flex-1 pt-[var(--nav-h)]">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <PushBanner />
      </CurrencyProvider>
    </NextIntlClientProvider>
  );
}

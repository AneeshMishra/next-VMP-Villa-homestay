"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import CurrencySelector from "@/components/CurrencySelector";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Nav() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const NAV_LINKS = [
    { href: "/rooms" as const, label: t("rooms") },
    { href: "/facilities" as const, label: t("facilities") },
    { href: "/location" as const, label: t("location") },
    { href: "/offers" as const, label: t("offers") },
    { href: "/reviews" as const, label: t("reviews") },
    { href: "/blog" as const, label: t("blog") },
    { href: "/contact" as const, label: t("contact") },
  ];

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center px-10 transition-all duration-300"
        style={{ height: "var(--nav-h)", background: scrolled ? undefined : "transparent" }}
        id="mainNav"
      >
        {scrolled && <div className="nav-scrolled absolute inset-0 -z-10" />}

        <Link href="/" className="font-display text-xl font-black text-white tracking-tight shrink-0">
          VMP<span className="text-saffron">Villa</span>
        </Link>

        <div className="hidden md:flex gap-8 ml-auto mr-8">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-white/70 text-sm font-medium tracking-wide hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Language + Currency selectors — desktop */}
        <div className="hidden md:flex items-center gap-3 mr-3">
          <LanguageSwitcher variant="nav" />
          <CurrencySelector variant="nav" />
        </div>

        <Link href="/book" className="hidden md:block bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-all duration-150 hover:-translate-y-px shrink-0">
          {t("bookDirect")}
        </Link>

        <button className="md:hidden ml-auto p-2 flex flex-col gap-1.5 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span className="block w-6 h-0.5 bg-white rounded" />
          <span className="block w-6 h-0.5 bg-white rounded" />
          <span className="block w-6 h-0.5 bg-white rounded" />
        </button>
      </nav>

      <div className={`fixed inset-0 bg-ink z-[500] flex flex-col items-center justify-center gap-8 text-white transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <button className="absolute top-6 right-7 text-white/60 text-3xl cursor-pointer bg-transparent border-none" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        <Link href="/" className="text-white text-2xl font-medium hover:text-saffron transition-colors" onClick={() => setMenuOpen(false)}>
          {t("home")}
        </Link>
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="text-white text-2xl font-medium hover:text-saffron transition-colors" onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/book" className="text-saffron text-2xl font-bold" onClick={() => setMenuOpen(false)}>Book Now →</Link>
        {/* Language + Currency — mobile */}
        <div className="flex flex-col items-center gap-4 mt-2">
          <LanguageSwitcher variant="inline" />
          <CurrencySelector variant="inline" />
        </div>
      </div>
    </>
  );
}

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
  const [langOpen, setLangOpen] = useState(false);
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
    setLangOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || langOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, langOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center px-5 md:px-10 transition-all duration-300"
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

        {/* Mobile nav controls — globe always visible */}
        <div className="md:hidden ml-auto flex items-center gap-1">
          <button
            onClick={() => setLangOpen(true)}
            className="p-2.5 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Change language"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </button>
          <button className="p-2 flex flex-col gap-1.5 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span className="block w-6 h-0.5 bg-white rounded" />
            <span className="block w-6 h-0.5 bg-white rounded" />
            <span className="block w-6 h-0.5 bg-white rounded" />
          </button>
        </div>
      </nav>

      {/* Full-screen nav menu */}
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
        <div className="mt-2">
          <CurrencySelector variant="inline" />
        </div>
      </div>

      {/* Language picker bottom sheet — opens directly from globe icon */}
      <div
        className={`fixed inset-0 z-[600] transition-all duration-300 ${langOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        onClick={() => setLangOpen(false)}
      >
        {/* Backdrop */}
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${langOpen ? "opacity-100" : "opacity-0"}`} />

        {/* Bottom sheet */}
        <div
          className={`absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden transition-transform duration-300 ${langOpen ? "translate-y-0" : "translate-y-full"}`}
          style={{ background: "#1a1714", border: "1px solid rgba(255,255,255,0.1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          <div className="px-5 pb-2 pt-1">
            <p className="text-white/40 text-xs font-bold tracking-widest uppercase text-center mb-4">
              {t("language")}
            </p>
            <LanguageSwitcher variant="inline" onSelect={() => setLangOpen(false)} />
          </div>

          {/* Safe area spacer */}
          <div style={{ height: "max(20px, env(safe-area-inset-bottom))" }} />
        </div>
      </div>
    </>
  );
}

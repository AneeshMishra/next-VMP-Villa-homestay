"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/rooms", label: "Rooms" },
  { href: "/facilities", label: "Facilities" },
  { href: "/location", label: "Location" },
  { href: "/offers", label: "Offers" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

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

        <Link href="/#booking" className="hidden md:block bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-all duration-150 hover:-translate-y-px shrink-0">
          Book Direct — Save More
        </Link>

        <button className="md:hidden ml-auto p-2 flex flex-col gap-1.5 cursor-pointer" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span className="block w-6 h-0.5 bg-white rounded" />
          <span className="block w-6 h-0.5 bg-white rounded" />
          <span className="block w-6 h-0.5 bg-white rounded" />
        </button>
      </nav>

      <div className={`fixed inset-0 bg-ink z-[99] flex flex-col items-center justify-center gap-8 transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <button className="absolute top-6 right-7 text-white/60 text-3xl cursor-pointer bg-transparent border-none" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="text-white/85 text-2xl font-medium hover:text-saffron transition-colors" onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/#booking" className="text-saffron text-2xl font-bold" onClick={() => setMenuOpen(false)}>Book Now →</Link>
      </div>
    </>
  );
}

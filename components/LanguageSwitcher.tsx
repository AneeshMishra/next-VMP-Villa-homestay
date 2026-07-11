"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LANGUAGE_NAMES: Record<string, { label: string; native: string; flag: string }> = {
  en: { label: "English", native: "English", flag: "🇬🇧" },
  ar: { label: "Arabic", native: "العربية", flag: "🇸🇦" },
  hi: { label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  fr: { label: "French", native: "Français", flag: "🇫🇷" },
  de: { label: "German", native: "Deutsch", flag: "🇩🇪" },
  ja: { label: "Japanese", native: "日本語", flag: "🇯🇵" },
  zh: { label: "Chinese", native: "中文", flag: "🇨🇳" },
  ko: { label: "Korean", native: "한국어", flag: "🇰🇷" },
  es: { label: "Spanish", native: "Español", flag: "🇪🇸" },
  ru: { label: "Russian", native: "Русский", flag: "🇷🇺" },
};

export default function LanguageSwitcher({ variant = "nav" }: { variant?: "nav" | "inline" }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function switchLocale(next: string) {
    router.push(pathname, { locale: next });
    setOpen(false);
  }

  const current = LANGUAGE_NAMES[locale] ?? LANGUAGE_NAMES.en;

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {routing.locales.map((loc) => {
          const lang = LANGUAGE_NAMES[loc];
          return (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                loc === locale
                  ? "bg-saffron text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.native}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors cursor-pointer"
        aria-label="Switch language"
      >
        <span>{current.flag}</span>
        <span className="hidden lg:inline">{current.native}</span>
        <span className="text-white/40 text-xs">▾</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-[200] min-w-[160px]"
          style={{
            background: "rgba(26,23,20,0.97)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {routing.locales.map((loc) => {
            const lang = LANGUAGE_NAMES[loc];
            return (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                  loc === locale
                    ? "text-saffron bg-saffron/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.native}</span>
                {loc === locale && <span className="ml-auto text-saffron text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

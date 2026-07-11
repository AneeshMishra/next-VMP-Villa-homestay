"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { CURRENCIES } from "@/lib/currency";

export default function CurrencySelector({ variant = "nav" }: { variant?: "nav" | "inline" }) {
  const { currency, setCurrency, loading } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const isNav = variant === "nav";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg transition-all ${
          isNav
            ? "text-white/80 hover:text-white text-sm px-2.5 py-1.5 hover:bg-white/10"
            : "border border-marble bg-white text-ink text-sm px-3 py-2 hover:border-stone"
        }`}
        aria-label="Select currency"
      >
        <span>{currency.flag}</span>
        <span className="font-semibold">{currency.code}</span>
        {loading && <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />}
        <svg className={`w-3 h-3 opacity-60 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-marble z-[200] overflow-hidden">
          <div className="px-3 py-2 border-b border-marble">
            <p className="text-[10px] font-bold tracking-widest uppercase text-stone">Select Currency</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-cream transition-colors text-left ${
                  c.code === currency.code ? "bg-cream font-semibold text-saffron" : "text-ink"
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="font-semibold w-8 shrink-0">{c.code}</span>
                <span className="text-muted text-xs truncate">{c.name}</span>
                {c.code === currency.code && <span className="ml-auto text-saffron">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CURRENCIES, type Currency, detectLocalCurrency, formatAmount } from "@/lib/currency";

const LS_CURRENCY_KEY = "vmp_currency";
const LS_RATES_KEY = "vmp_exchange_rates";
const LS_RATES_TTL = 24 * 60 * 60 * 1000; // 24 h

type CurrencyCtx = {
  currency: Currency;
  rates: Record<string, number>;
  loading: boolean;
  setCurrency: (code: string) => void;
  /** Convert an INR amount to the selected currency */
  convert: (inr: number) => number;
  /** Format an INR amount in the selected currency */
  format: (inr: number) => string;
};

const Ctx = createContext<CurrencyCtx | null>(null);

export function useCurrency(): CurrencyCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}

function getCurrencyObj(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

function loadCachedRates(): Record<string, number> | null {
  try {
    const raw = localStorage.getItem(LS_RATES_KEY);
    if (!raw) return null;
    const { rates, fetchedAt } = JSON.parse(raw);
    if (Date.now() - fetchedAt > LS_RATES_TTL) return null;
    return rates;
  } catch {
    return null;
  }
}

function saveCachedRates(rates: Record<string, number>) {
  try {
    localStorage.setItem(LS_RATES_KEY, JSON.stringify({ rates, fetchedAt: Date.now() }));
  } catch {}
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState("INR");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Restore persisted currency + rates on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(LS_CURRENCY_KEY);
    const detected = saved ?? detectLocalCurrency();
    setCurrencyCode(detected);

    const cached = loadCachedRates();
    if (cached) {
      setRates(cached);
    } else {
      fetchRates();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/exchange-rates");
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setRates(data.rates ?? {});
      saveCachedRates(data.rates ?? {});
    } catch {
      // keep empty rates — will fall back to INR display
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSetCurrency = useCallback((code: string) => {
    setCurrencyCode(code);
    try { localStorage.setItem(LS_CURRENCY_KEY, code); } catch {}
    if (Object.keys(rates).length === 0) fetchRates();
  }, [rates, fetchRates]);

  const currency = getCurrencyObj(currencyCode);

  const convert = useCallback((inr: number): number => {
    if (currencyCode === "INR") return inr;
    const rate = rates[currencyCode];
    if (!rate) return inr;
    return inr * rate;
  }, [currencyCode, rates]);

  const format = useCallback((inr: number): string => {
    const converted = convert(inr);
    return formatAmount(converted, currency);
  }, [convert, currency]);

  // Avoid hydration mismatch — render INR on server, real value after mount
  if (!mounted) {
    return (
      <Ctx.Provider value={{ currency: CURRENCIES[0], rates: {}, loading: false, setCurrency: () => {}, convert: (n) => n, format: (n) => `₹${Math.round(n).toLocaleString("en-IN")}` }}>
        {children}
      </Ctx.Provider>
    );
  }

  return (
    <Ctx.Provider value={{ currency, rates, loading, setCurrency: handleSetCurrency, convert, format }}>
      {children}
    </Ctx.Provider>
  );
}

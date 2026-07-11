import { NextResponse } from "next/server";

// open.er-api.com — free, no key, supports Gulf currencies (OMR, KWD, SAR, BHD, QAR, AED)
const TARGETS = [
  "USD", "EUR", "GBP", "AED", "OMR", "SAR", "KWD", "BHD", "QAR",
  "AUD", "CAD", "SGD", "MYR", "THB", "JPY", "HKD", "KRW", "CNY",
  "NZD", "CHF", "SEK", "NOK", "DKK", "ZAR",
];

let cached: { rates: Record<string, number>; fetchedAt: number } | null = null;
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
  const now = Date.now();
  if (cached && now - cached.fetchedAt < TTL_MS) {
    return NextResponse.json({ rates: cached.rates, base: "INR" });
  }
  try {
    // Fetch all rates from INR base — returns every supported currency
    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error("upstream failed");
    const data = await res.json();
    if (data.result !== "success") throw new Error("upstream error");

    // Pick only the currencies we expose
    const all: Record<string, number> = data.rates ?? {};
    const rates: Record<string, number> = {};
    for (const code of TARGETS) {
      if (all[code] !== undefined) rates[code] = all[code];
    }

    cached = { rates, fetchedAt: now };
    return NextResponse.json({ rates: cached.rates, base: "INR" });
  } catch {
    if (cached) {
      return NextResponse.json({ rates: cached.rates, base: "INR", stale: true });
    }
    // Hard-coded fallback rates (approx, Jul 2025)
    return NextResponse.json({
      base: "INR",
      fallback: true,
      rates: {
        USD: 0.012,  EUR: 0.011,  GBP: 0.0094,
        AED: 0.044,  OMR: 0.0046, SAR: 0.045,
        KWD: 0.0037, BHD: 0.0045, QAR: 0.0437,
        AUD: 0.018,  CAD: 0.016,  SGD: 0.016,
        MYR: 0.053,  THB: 0.41,   JPY: 1.78,
        HKD: 0.094,  KRW: 16.5,   CNY: 0.087,
        NZD: 0.020,  CHF: 0.010,  SEK: 0.12,
        NOK: 0.13,   DKK: 0.082,  ZAR: 0.22,
      },
    });
  }
}

import { NextResponse } from "next/server";

const TARGETS = "USD,EUR,GBP,AUD,CAD,SGD,AED,JPY,NZD,CHF";
let cached: { rates: Record<string, number>; fetchedAt: number } | null = null;
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
  const now = Date.now();
  if (cached && now - cached.fetchedAt < TTL_MS) {
    return NextResponse.json({ rates: cached.rates, base: "INR" });
  }
  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=INR&to=${TARGETS}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) throw new Error("upstream failed");
    const data = await res.json();
    cached = { rates: data.rates as Record<string, number>, fetchedAt: now };
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
        USD: 0.012, EUR: 0.011, GBP: 0.0094,
        AUD: 0.018, CAD: 0.016, SGD: 0.016,
        AED: 0.044, JPY: 1.78, NZD: 0.02, CHF: 0.010,
      },
    });
  }
}

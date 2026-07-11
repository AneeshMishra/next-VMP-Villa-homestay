export type Currency = {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  decimals: number;
};

export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹",    name: "Indian Rupee",       flag: "🇮🇳", decimals: 0 },
  { code: "USD", symbol: "$",    name: "US Dollar",           flag: "🇺🇸", decimals: 2 },
  { code: "EUR", symbol: "€",    name: "Euro",                flag: "🇪🇺", decimals: 2 },
  { code: "GBP", symbol: "£",    name: "British Pound",       flag: "🇬🇧", decimals: 2 },
  { code: "AUD", symbol: "A$",   name: "Australian Dollar",   flag: "🇦🇺", decimals: 2 },
  { code: "CAD", symbol: "C$",   name: "Canadian Dollar",     flag: "🇨🇦", decimals: 2 },
  { code: "SGD", symbol: "S$",   name: "Singapore Dollar",    flag: "🇸🇬", decimals: 2 },
  { code: "AED", symbol: "AED ", name: "UAE Dirham",          flag: "🇦🇪", decimals: 2 },
  { code: "JPY", symbol: "¥",    name: "Japanese Yen",        flag: "🇯🇵", decimals: 0 },
  { code: "NZD", symbol: "NZ$",  name: "New Zealand Dollar",  flag: "🇳🇿", decimals: 2 },
  { code: "CHF", symbol: "CHF ", name: "Swiss Franc",         flag: "🇨🇭", decimals: 2 },
];

// Map browser region code → currency code
const REGION_TO_CURRENCY: Record<string, string> = {
  IN: "INR",
  US: "USD", PR: "USD", GU: "USD",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  SG: "SGD",
  JP: "JPY",
  NZ: "NZD",
  CH: "CHF",
  AE: "AED", SA: "AED", QA: "AED", KW: "AED", BH: "AED", OM: "AED",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR",
  BE: "EUR", AT: "EUR", PT: "EUR", GR: "EUR", FI: "EUR",
  IE: "EUR", LU: "EUR", MT: "EUR", CY: "EUR", SK: "EUR",
  SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR",
};

export function detectLocalCurrency(): string {
  if (typeof window === "undefined") return "INR";
  try {
    const locale = navigator.language || "en-IN";
    const region = locale.split("-")[1]?.toUpperCase() ?? "";
    return REGION_TO_CURRENCY[region] ?? "USD";
  } catch {
    return "USD";
  }
}

export function formatAmount(amount: number, currency: Currency): string {
  if (currency.code === "INR") {
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
  }
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    }).format(amount);
  } catch {
    return `${currency.symbol}${amount.toFixed(currency.decimals)}`;
  }
}

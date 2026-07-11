export type Currency = {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  decimals: number;
};

export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹",    name: "Indian Rupee",         flag: "🇮🇳", decimals: 0 },
  { code: "USD", symbol: "$",    name: "US Dollar",             flag: "🇺🇸", decimals: 2 },
  { code: "EUR", symbol: "€",    name: "Euro",                  flag: "🇪🇺", decimals: 2 },
  { code: "GBP", symbol: "£",    name: "British Pound",         flag: "🇬🇧", decimals: 2 },
  { code: "AED", symbol: "AED ", name: "UAE Dirham",            flag: "🇦🇪", decimals: 2 },
  { code: "OMR", symbol: "OMR ", name: "Omani Rial",            flag: "🇴🇲", decimals: 3 },
  { code: "SAR", symbol: "SAR ", name: "Saudi Riyal",           flag: "🇸🇦", decimals: 2 },
  { code: "KWD", symbol: "KWD ", name: "Kuwaiti Dinar",         flag: "🇰🇼", decimals: 3 },
  { code: "BHD", symbol: "BHD ", name: "Bahraini Dinar",        flag: "🇧🇭", decimals: 3 },
  { code: "QAR", symbol: "QAR ", name: "Qatari Riyal",          flag: "🇶🇦", decimals: 2 },
  { code: "AUD", symbol: "A$",   name: "Australian Dollar",     flag: "🇦🇺", decimals: 2 },
  { code: "CAD", symbol: "C$",   name: "Canadian Dollar",       flag: "🇨🇦", decimals: 2 },
  { code: "SGD", symbol: "S$",   name: "Singapore Dollar",      flag: "🇸🇬", decimals: 2 },
  { code: "MYR", symbol: "RM",   name: "Malaysian Ringgit",     flag: "🇲🇾", decimals: 2 },
  { code: "THB", symbol: "฿",    name: "Thai Baht",             flag: "🇹🇭", decimals: 2 },
  { code: "JPY", symbol: "¥",    name: "Japanese Yen",          flag: "🇯🇵", decimals: 0 },
  { code: "HKD", symbol: "HK$",  name: "Hong Kong Dollar",      flag: "🇭🇰", decimals: 2 },
  { code: "KRW", symbol: "₩",    name: "South Korean Won",      flag: "🇰🇷", decimals: 0 },
  { code: "CNY", symbol: "¥",    name: "Chinese Yuan",          flag: "🇨🇳", decimals: 2 },
  { code: "NZD", symbol: "NZ$",  name: "New Zealand Dollar",    flag: "🇳🇿", decimals: 2 },
  { code: "CHF", symbol: "CHF ", name: "Swiss Franc",           flag: "🇨🇭", decimals: 2 },
  { code: "SEK", symbol: "kr",   name: "Swedish Krona",         flag: "🇸🇪", decimals: 2 },
  { code: "NOK", symbol: "kr",   name: "Norwegian Krone",       flag: "🇳🇴", decimals: 2 },
  { code: "DKK", symbol: "kr",   name: "Danish Krone",          flag: "🇩🇰", decimals: 2 },
  { code: "ZAR", symbol: "R",    name: "South African Rand",    flag: "🇿🇦", decimals: 2 },
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
  AE: "AED",
  OM: "OMR",
  SA: "SAR",
  KW: "KWD",
  BH: "BHD",
  QA: "QAR",
  MY: "MYR",
  TH: "THB",
  HK: "HKD",
  KR: "KRW",
  CN: "CNY", TW: "CNY",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  ZA: "ZAR",
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

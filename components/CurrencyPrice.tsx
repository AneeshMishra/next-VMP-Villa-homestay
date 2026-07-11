"use client";

import { useCurrency } from "@/context/CurrencyContext";

interface Props {
  /** Base price in INR */
  amountInr: number;
  /** e.g. "/ night", "/ bed" */
  unit?: string;
  /** Size variant for different contexts */
  size?: "sm" | "md" | "lg";
  /** Show INR as secondary below converted price */
  showInrSecondary?: boolean;
}

export default function CurrencyPrice({
  amountInr,
  unit = "/ night",
  size = "md",
  showInrSecondary = true,
}: Props) {
  const { currency, format } = useCurrency();
  const isInr = currency.code === "INR";

  const priceClass =
    size === "lg"
      ? "font-display text-[40px] font-bold text-ink leading-none"
      : size === "sm"
      ? "font-display text-2xl font-bold text-saffron leading-none"
      : "font-display text-[26px] font-bold text-saffron leading-none";

  const unitClass = "text-muted text-sm ml-1";

  if (isInr) {
    return (
      <span>
        <span className={priceClass}>₹{amountInr.toLocaleString("en-IN")}</span>
        {unit && <span className={unitClass}>{unit}</span>}
      </span>
    );
  }

  const formatted = format(amountInr);

  return (
    <span className="flex flex-col">
      <span>
        <span className={priceClass}>{formatted}</span>
        {unit && <span className={unitClass}>{unit}</span>}
      </span>
      {showInrSecondary && (
        <span className="text-[11px] text-stone mt-0.5">
          ≈ ₹{amountInr.toLocaleString("en-IN")} INR
        </span>
      )}
    </span>
  );
}

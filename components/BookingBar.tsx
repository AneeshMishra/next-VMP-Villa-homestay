"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

function getDefaultDates() {
  const today = new Date();
  const checkin = new Date(today);
  checkin.setDate(today.getDate() + 1);
  const checkout = new Date(today);
  checkout.setDate(today.getDate() + 3);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { checkin: fmt(checkin), checkout: fmt(checkout) };
}

function Counter({
  label,
  sub,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sub?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-marble last:border-b-0">
      <div>
        <div className="font-semibold text-ink text-[15px]">{label}</div>
        {sub && <div className="text-xs text-muted mt-0.5">{sub}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-9 h-9 rounded-full border-2 border-marble flex items-center justify-center text-xl font-bold text-saffron disabled:opacity-30 disabled:cursor-not-allowed hover:border-saffron transition-colors"
        >
          −
        </button>
        <span className="w-6 text-center font-bold text-ink text-[16px]">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-9 h-9 rounded-full border-2 border-marble flex items-center justify-center text-xl font-bold text-saffron disabled:opacity-30 disabled:cursor-not-allowed hover:border-saffron transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function BookingBar() {
  const t = useTranslations("bookingBar");
  const router = useRouter();
  const defaults = getDefaultDates();

  const [checkin, setCheckin] = useState(defaults.checkin);
  const [checkout, setCheckout] = useState(defaults.checkout);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep childAges array in sync with children count
  useEffect(() => {
    setChildAges((prev) => {
      if (children > prev.length) {
        return [...prev, ...Array(children - prev.length).fill("1")];
      }
      return prev.slice(0, children);
    });
  }, [children]);

  // Close panel when clicking outside
  useEffect(() => {
    if (!panelOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [panelOpen]);

  function guestSummary() {
    const roomLabel = rooms === 1 ? t("room") : t("rooms");
    const adultLabel = adults === 1 ? t("adult") : t("adults");
    const childPart =
      children > 0
        ? ` · ${children} ${children === 1 ? t("child") : t("children")}`
        : "";
    return `${rooms} ${roomLabel} · ${adults} ${adultLabel}${childPart}`;
  }

  function handleCheck() {
    if (!checkin || !checkout) {
      alert(t("alertDates"));
      return;
    }
    const params = new URLSearchParams();
    params.set("checkin", checkin);
    params.set("checkout", checkout);
    params.set("rooms", String(rooms));
    params.set("adults", String(adults));
    params.set("children", String(children));
    if (children > 0 && childAges.length > 0) {
      params.set("childAges", childAges.join(","));
    }
    router.push(`/book?${params.toString()}`);
  }

  const ageOptions = [
    { value: "0", label: t("underOneYr") },
    ...Array.from({ length: 17 }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1} ${i === 0 ? t("yr") : t("yrs")}`,
    })),
  ];

  const labelCls =
    "text-[10px] font-bold tracking-widest text-stone uppercase mb-1.5 flex items-center gap-1.5 max-md:justify-center";
  const fieldCls =
    "w-full border-none outline-none text-[15px] font-medium text-ink bg-transparent py-1 cursor-pointer font-body";

  return (
    <div id="booking" className="bg-cream" style={{ paddingTop: 0 }}>
      <div
        className="booking-bar-wrap mx-auto bg-white rounded-2xl relative z-10 flex flex-wrap items-end gap-0"
        style={{
          maxWidth: 1020,
          margin: "-40px auto 0",
          padding: "24px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* Check-in */}
        <div className="flex-1 px-5 border-r border-marble min-w-[140px] max-md:border-r-0 max-md:border-b max-md:border-marble max-md:pb-3.5 max-md:px-0 max-md:text-center">
          <div className={labelCls}>📅 {t("checkIn")}</div>
          <input
            type="date"
            className={fieldCls + " max-md:text-center"}
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            style={{ colorScheme: "light" }}
          />
        </div>

        {/* Check-out */}
        <div className="flex-1 px-5 border-r border-marble min-w-[140px] max-md:border-r-0 max-md:border-b max-md:border-marble max-md:pb-3.5 max-md:px-0 max-md:text-center">
          <div className={labelCls}>📅 {t("checkOut")}</div>
          <input
            type="date"
            className={fieldCls + " max-md:text-center"}
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            style={{ colorScheme: "light" }}
          />
        </div>

        {/* Rooms & Guests */}
        <div
          ref={panelRef}
          className="flex-1 px-5 min-w-[200px] relative max-md:px-0 max-md:border-b max-md:border-marble max-md:pb-3.5 max-md:text-center"
        >
          <div className={labelCls}>👥 {t("roomsGuests")}</div>
          <button
            type="button"
            onClick={() => setPanelOpen((o) => !o)}
            className="w-full text-left flex items-center justify-between gap-1 border-none outline-none bg-transparent py-1 cursor-pointer max-md:justify-center"
          >
            <span className="text-[15px] font-medium text-ink">{guestSummary()}</span>
            <span className="text-stone text-[11px] ml-1 shrink-0">{panelOpen ? "▲" : "▼"}</span>
          </button>

          {/* Dropdown panel */}
          {panelOpen && (
            <div
              className="guest-panel absolute top-full left-0 mt-2 bg-white rounded-2xl border border-marble z-50"
              style={{
                width: 300,
                boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
                padding: "4px 20px 0",
              }}
            >
              <Counter
                label={t("rooms")}
                value={rooms}
                min={1}
                max={5}
                onChange={setRooms}
              />
              <Counter
                label={t("adults")}
                value={adults}
                min={1}
                max={10}
                onChange={setAdults}
              />
              <Counter
                label={t("children")}
                sub={t("childAgeNote")}
                value={children}
                min={0}
                max={6}
                onChange={setChildren}
              />

              {children > 0 && (
                <div className="pt-3 pb-1">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-stone mb-3">
                    {t("ageOfChildren")}
                  </div>
                  <div className="flex flex-col gap-3 pb-2">
                    {childAges.map((age, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[14px] font-semibold text-ink">
                          {t("child")} {i + 1}
                        </span>
                        <select
                          value={age}
                          onChange={(e) => {
                            const next = [...childAges];
                            next[i] = e.target.value;
                            setChildAges(next);
                          }}
                          className="border border-marble rounded-lg px-3 py-2 text-[13px] font-medium text-ink bg-white outline-none focus:border-saffron transition-colors"
                        >
                          {ageOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="py-4"
                style={{ borderTop: "1px solid var(--marble)", marginTop: children > 0 ? 4 : 0 }}
              >
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="w-full bg-saffron hover:bg-saffron-d text-white font-bold py-3 rounded-xl transition-colors text-[15px]"
                >
                  {t("done")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleCheck}
          className="ml-5 shrink-0 bg-saffron hover:bg-saffron-d text-white text-[15px] font-bold px-8 py-4 rounded-[10px] cursor-pointer border-none transition-all duration-150 hover:-translate-y-px whitespace-nowrap max-md:w-full max-md:ml-0 max-md:mt-2"
        >
          {t("checkAvailability")}
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .booking-bar-wrap {
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            width: calc(100vw - 32px) !important;
            max-width: none !important;
            margin-top: -32px !important;
            margin-left: 16px !important;
            margin-right: 16px !important;
            margin-bottom: 0 !important;
            padding: 24px 20px !important;
            box-sizing: border-box;
          }
          .booking-bar-wrap > div {
            width: 100%;
          }
          .guest-panel {
            width: calc(100vw - 72px) !important;
            left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

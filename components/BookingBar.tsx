"use client";

import { useState } from "react";
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

export default function BookingBar() {
  const t = useTranslations("bookingBar");
  const router = useRouter();
  const defaults = getDefaultDates();
  const [checkin, setCheckin] = useState(defaults.checkin);
  const [checkout, setCheckout] = useState(defaults.checkout);
  const [guests, setGuests] = useState("2");
  const [roomType, setRoomType] = useState("any");

  function handleCheck() {
    if (!checkin || !checkout) {
      alert(t("alertDates"));
      return;
    }
    const params = new URLSearchParams();
    params.set("checkin", checkin);
    params.set("checkout", checkout);
    params.set("guests", guests);
    if (roomType !== "any") params.set("room", roomType);
    router.push(`/book?${params.toString()}`);
  }

  const fieldCls = "w-full border-none outline-none text-[15px] font-medium text-ink bg-transparent py-1 cursor-pointer font-body max-md:text-center";
  const labelCls = "text-[10px] font-bold tracking-widest text-stone uppercase mb-1.5 flex items-center gap-1.5 max-md:justify-center";

  return (
    <div
      id="booking"
      className="bg-cream"
      style={{ paddingTop: 0 }}
    >
      <div
        className="booking-bar-wrap mx-auto bg-white rounded-2xl mt-[-40px] relative z-10 flex flex-wrap items-end gap-0"
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
            className={fieldCls}
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
            className={fieldCls}
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            style={{ colorScheme: "light" }}
          />
        </div>

        {/* Guests */}
        <div className="flex-1 px-5 border-r border-marble min-w-[120px] max-md:border-r-0 max-md:border-b max-md:border-marble max-md:pb-3.5 max-md:px-0 max-md:text-center">
          <div className={labelCls}>👥 {t("guests")}</div>
          <select className={fieldCls} value={guests} onChange={(e) => setGuests(e.target.value)}>
            <option value="1">{t("guest1")}</option>
            <option value="2">{t("guest2")}</option>
            <option value="3">{t("guest3")}</option>
            <option value="4">{t("guest4")}</option>
          </select>
        </div>

        {/* Room Type */}
        <div className="flex-1 px-5 min-w-[150px] max-md:px-0 max-md:pb-3.5 max-md:text-center">
          <div className={labelCls}>🛏️ {t("roomType")}</div>
          <select className={fieldCls} value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option value="any">{t("anyRoom")}</option>
            <option value="deluxe-ac">Deluxe AC Room</option>
            <option value="standard-ac">Standard AC Room</option>
            <option value="dormitory">Dormitory Bed</option>
          </select>
        </div>

        {/* CTA */}
        <button
          onClick={handleCheck}
          className="ml-5 shrink-0 bg-saffron hover:bg-saffron-d text-white text-[15px] font-bold px-8 py-4 rounded-[10px] cursor-pointer border-none transition-all duration-150 hover:-translate-y-px whitespace-nowrap max-md:w-full max-md:ml-0"
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
            text-align: center;
            width: 100%;
          }
          .booking-bar-wrap > div > div {
            justify-content: center;
          }
          .booking-bar-wrap input,
          .booking-bar-wrap select {
            text-align: center;
            text-align-last: center;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

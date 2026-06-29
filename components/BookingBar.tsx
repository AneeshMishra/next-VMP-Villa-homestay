"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROOM_ID_MAP: Record<string, string> = {
  "Deluxe AC Room": "deluxe-ac",
  "Standard AC Room": "standard-ac",
  "Dormitory Bed": "dormitory",
};

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
  const router = useRouter();
  const defaults = getDefaultDates();
  const [checkin, setCheckin] = useState(defaults.checkin);
  const [checkout, setCheckout] = useState(defaults.checkout);
  const [guests, setGuests] = useState("2 Guests");
  const [roomType, setRoomType] = useState("Any Room");

  function handleCheck() {
    if (!checkin || !checkout) {
      alert("Please select your check-in and check-out dates.");
      return;
    }
    const params = new URLSearchParams();
    params.set("checkin", checkin);
    params.set("checkout", checkout);
    params.set("guests", guests.replace(/\D/g, "") || "2");
    const roomId = ROOM_ID_MAP[roomType];
    if (roomId) params.set("room", roomId);
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
          <div className={labelCls}>📅 Check-in</div>
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
          <div className={labelCls}>📅 Check-out</div>
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
          <div className={labelCls}>👥 Guests</div>
          <select className={fieldCls} value={guests} onChange={(e) => setGuests(e.target.value)}>
            <option>1 Guest</option>
            <option>2 Guests</option>
            <option>3 Guests</option>
            <option>4+ Guests</option>
          </select>
        </div>

        {/* Room Type */}
        <div className="flex-1 px-5 min-w-[150px] max-md:px-0 max-md:pb-3.5 max-md:text-center">
          <div className={labelCls}>🛏️ Room Type</div>
          <select className={fieldCls} value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option>Any Room</option>
            <option>Deluxe AC Room</option>
            <option>Standard AC Room</option>
            <option>Dormitory Bed</option>
          </select>
        </div>

        {/* CTA */}
        <button
          onClick={handleCheck}
          className="ml-5 shrink-0 bg-saffron hover:bg-saffron-d text-white text-[15px] font-bold px-8 py-4 rounded-[10px] cursor-pointer border-none transition-all duration-150 hover:-translate-y-px whitespace-nowrap max-md:w-full max-md:ml-0"
        >
          Check Availability →
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

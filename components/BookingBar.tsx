"use client";
import { useState } from "react";
import { buildWhatsAppUrl, bookingMessage } from "@/lib/whatsapp";

function getDefaultDates() {
  const today = new Date();
  const checkin = new Date(today); checkin.setDate(today.getDate() + 1);
  const checkout = new Date(today); checkout.setDate(today.getDate() + 3);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { checkin: fmt(checkin), checkout: fmt(checkout) };
}

export default function BookingBar() {
  const defaults = getDefaultDates();
  const [checkin, setCheckin] = useState(defaults.checkin);
  const [checkout, setCheckout] = useState(defaults.checkout);
  const [guests, setGuests] = useState("2 Guests");
  const [roomType, setRoomType] = useState("Any Room");

  function handleCheck() {
    if (!checkin || !checkout) { alert("Please select your check-in and check-out dates."); return; }
    window.open(buildWhatsAppUrl(bookingMessage(checkin, checkout, guests, roomType)), "_blank");
  }

  const fieldCls = "w-full border-none outline-none text-[15px] font-medium text-ink bg-transparent py-1 cursor-pointer";
  const labelCls = "text-[10px] font-bold tracking-widest text-stone uppercase mb-1.5 flex items-center gap-1.5";

  return (
    <div id="booking" className="bg-cream" style={{ paddingTop: 0 }}>
      <div className="booking-bar-wrap mx-auto bg-white rounded-2xl relative z-10" style={{ maxWidth: 1020, margin: "-40px auto 0", padding: "24px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)" }}>
        <div className="flex flex-wrap items-end gap-0">
          <div className="flex-1 px-5 border-r border-marble min-w-[140px]"><div className={labelCls}>📅 Check-in</div><input type="date" className={fieldCls} value={checkin} onChange={(e) => setCheckin(e.target.value)} style={{ colorScheme: "light" }} /></div>
          <div className="flex-1 px-5 border-r border-marble min-w-[140px]"><div className={labelCls}>📅 Check-out</div><input type="date" className={fieldCls} value={checkout} onChange={(e) => setCheckout(e.target.value)} style={{ colorScheme: "light" }} /></div>
          <div className="flex-1 px-5 border-r border-marble min-w-[120px]"><div className={labelCls}>👥 Guests</div><select className={fieldCls} value={guests} onChange={(e) => setGuests(e.target.value)}><option>1 Guest</option><option>2 Guests</option><option>3 Guests</option><option>4+ Guests</option></select></div>
          <div className="flex-1 px-5 min-w-[150px]"><div className={labelCls}>🛏️ Room Type</div><select className={fieldCls} value={roomType} onChange={(e) => setRoomType(e.target.value)}><option>Any Room</option><option>Deluxe AC Room</option><option>Standard AC Room</option><option>Dormitory Bed</option></select></div>
          <button onClick={handleCheck} className="ml-5 shrink-0 bg-saffron hover:bg-saffron-d text-white text-[15px] font-bold px-8 py-4 rounded-[10px] cursor-pointer border-none transition-all duration-150 hover:-translate-y-px whitespace-nowrap">Check Availability →</button>
        </div>
      </div>
    </div>
  );
}

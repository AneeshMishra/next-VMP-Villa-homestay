"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import Script from "next/script";
import { ROOMS, ROOM_CAPACITY } from "@/lib/constants";
import { ROOM_PRICES, GST_RATE, ROOM_UNITS } from "@/lib/booking-config";
import { useCurrency } from "@/context/CurrencyContext";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, any>) => { open(): void; on(event: string, cb: () => void): void };
  }
}

type Field = "name" | "email" | "phone";
type UnitAvail = { available: boolean; availableUnits: number; totalUnits: number };
type AllAvail = Record<string, UnitAvail>;

const ROOM_OPTIONS = ROOMS.map((r) => ({
  id: r.id,
  name: r.name,
  price: ROOM_PRICES[r.id as keyof typeof ROOM_PRICES] ?? 0,
  priceUnit: r.priceUnit,
  amenities: r.amenities.slice(0, 3) as readonly string[],
}));

function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}
function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000));
}
function fmtDate(iso: string) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // qty per room type — multiple can be > 0 simultaneously
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [checkIn, setCheckIn]   = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults]     = useState(2);
  const [children, setChildren] = useState(0);
  const [searchedRooms, setSearchedRooms] = useState(1);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [special, setSpecial] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [allAvail, setAllAvail]   = useState<AllAvail>({});
  const [availLoading, setAvailLoading] = useState(false);

  // Pre-fill from URL params
  useEffect(() => {
    const room = searchParams.get("room");
    const ci   = searchParams.get("checkin");
    const co   = searchParams.get("checkout");
    const r    = searchParams.get("rooms");
    const a    = searchParams.get("adults");
    const ch   = searchParams.get("children");

    if (ci) setCheckIn(ci);
    if (co) setCheckOut(co);
    if (a)  setAdults(Math.max(1, parseInt(a, 10)));
    if (ch) setChildren(Math.max(0, parseInt(ch, 10)));

    const parsedRooms = r ? Math.max(1, parseInt(r, 10)) : 1;
    setSearchedRooms(parsedRooms);

    // Pre-select room from URL if provided
    const defaultId = (room && ROOM_PRICES[room as keyof typeof ROOM_PRICES]) ? room : "deluxe-ac";
    setSelections({ [defaultId]: parsedRooms });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { currency, format: formatCurrency } = useCurrency();

  const nights = nightsBetween(checkIn, checkOut);
  const minCheckIn  = todayStr();
  const minCheckOut = checkIn ? addDays(checkIn, 1) : addDays(todayStr(), 1);

  // Derived billing across all selected room types
  const selectedEntries = Object.entries(selections).filter(([, qty]) => qty > 0);
  const hasSelection    = selectedEntries.length > 0;
  const pricePerNight   = selectedEntries.reduce(
    (sum, [id, qty]) => sum + (ROOM_PRICES[id as keyof typeof ROOM_PRICES] ?? 0) * qty,
    0
  );
  const baseAmount  = pricePerNight * nights;
  const gstAmount   = Math.round(baseAmount * GST_RATE);
  const totalAmount = baseAmount + gstAmount;

  // Availability fetch when dates change
  useEffect(() => {
    if (!checkIn || !checkOut || nights === 0) { setAllAvail({}); return; }
    setAvailLoading(true);
    const ctrl = new AbortController();
    fetch(`/api/availability?checkin=${checkIn}&checkout=${checkOut}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data: AllAvail) => {
        setAllAvail(data);
        // Drop any selections that are now fully booked
        setSelections((prev) => {
          const next = { ...prev };
          for (const id of Object.keys(next)) {
            if (data[id] && !data[id].available) delete next[id];
          }
          return next;
        });
      })
      .catch(() => {})
      .finally(() => setAvailLoading(false));
    return () => ctrl.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, nights]);

  const handleCheckInChange = useCallback(
    (v: string) => {
      setCheckIn(v);
      if (checkOut && checkOut <= v) setCheckOut(addDays(v, 1));
    },
    [checkOut]
  );

  function maxUnitsFor(id: string) {
    const avail = allAvail[id];
    if (avail) return avail.availableUnits;
    return ROOM_UNITS[id as keyof typeof ROOM_UNITS] ?? 1;
  }

  function addRoom(id: string) {
    const max = maxUnitsFor(id);
    const defaultQty = Math.min(searchedRooms, max);
    setSelections((prev) => ({ ...prev, [id]: Math.max(1, defaultQty) }));
  }

  function changeQty(id: string, delta: number) {
    setSelections((prev) => {
      const next = { ...prev };
      const newQty = (next[id] ?? 0) + delta;
      if (newQty <= 0) {
        delete next[id];
      } else {
        next[id] = Math.min(newQty, maxUnitsFor(id));
      }
      return next;
    });
  }

  const touch = (f: Field) => setTouched((p) => ({ ...p, [f]: true }));
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = /^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").replace(/^91/, ""));

  const formValid =
    checkIn && checkOut && nights > 0 &&
    hasSelection &&
    name.trim().length >= 2 && emailValid && phoneValid;

  // Build serialised selections for API
  function buildSelections() {
    return selectedEntries.map(([id, qty]) => ({
      roomId: id,
      qty,
      price: ROOM_PRICES[id as keyof typeof ROOM_PRICES] ?? 0,
    }));
  }
  // Primary room = highest-value selection (for Razorpay description / legacy roomId field)
  function primaryRoomId() {
    return selectedEntries.sort(
      ([a], [b]) => (ROOM_PRICES[b as keyof typeof ROOM_PRICES] ?? 0) - (ROOM_PRICES[a as keyof typeof ROOM_PRICES] ?? 0)
    )[0]?.[0] ?? "deluxe-ac";
  }

  async function handlePayOnline() {
    if (!formValid || isLoading) return;
    if (!scriptReady) { setError("Payment script not loaded yet — please try again."); return; }
    setIsLoading(true);
    setError("");

    const selList = buildSelections();
    const primId  = primaryRoomId();
    const primQty = selections[primId] ?? 1;
    const primName = ROOMS.find((r) => r.id === primId)?.name ?? primId;

    try {
      const orderRes = await fetch("/api/bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: primId, roomCount: primQty, selections: selList,
          checkIn, checkOut, nights, adults, children,
          name: name.trim(), email: email.trim(), phone: phone.trim(), special: special.trim(),
          baseAmount, gstAmount, amount: totalAmount,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error ?? "Failed to create order");

      const { orderId, bookingId, keyId } = orderData;
      const desc = selList.length > 1
        ? `${selList.length} room types — ${nights} night${nights > 1 ? "s" : ""}`
        : `${primQty > 1 ? `${primQty}× ` : ""}${primName} — ${nights} night${nights > 1 ? "s" : ""}`;

      const rzp = new window.Razorpay({
        key: keyId,
        amount: totalAmount * 100,
        currency: "INR",
        name: "VMP Villa Home Stay",
        description: desc,
        order_id: orderId,
        prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
        theme: { color: "#e8762b" },
        handler: async (response: {
          razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string;
        }) => {
          try {
            const confirmRes = await fetch("/api/bookings/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bookingId, ...response }),
            });
            if (confirmRes.ok) {
              router.push(`/booking-confirmed?id=${bookingId}`);
            } else {
              const d = await confirmRes.json();
              setError(d.error ?? "Payment received but confirmation failed. WhatsApp Aneesh with your payment ID.");
              setIsLoading(false);
            }
          } catch {
            setError("Payment received but we hit an error. WhatsApp Aneesh with payment ID: " + response.razorpay_payment_id);
            setIsLoading(false);
          }
        },
        modal: { ondismiss: () => setIsLoading(false) },
      });
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again or use a different method.");
        setIsLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  async function handlePayAtProperty() {
    if (!formValid || isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: primaryRoomId(), roomCount: selections[primaryRoomId()] ?? 1,
          selections: buildSelections(),
          checkIn, checkOut, nights, adults, children,
          name: name.trim(), email: email.trim(), phone: phone.trim(), special: special.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit booking request");
      router.push(`/booking-confirmed?id=${data.bookingId}&mode=request`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setScriptReady(true)} />

      <div className="max-w-[1100px] mx-auto px-5 py-12 grid gap-10 items-start booking-form-grid">

        {/* ── Left: form ────────────────────────────── */}
        <div className="flex flex-col gap-8">

          {/* Step 1: Dates */}
          <section>
            <h2 className="font-display text-lg font-bold text-ink mb-1">1. Choose Your Dates</h2>
            <p className="text-sm text-muted mb-4">Select check-in and check-out to see availability.</p>

            <div className="grid gap-4 mb-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1.5">
                  Check-in
                </label>
                <input
                  type="date"
                  min={minCheckIn}
                  value={checkIn}
                  onChange={(e) => handleCheckInChange(e.target.value)}
                  className="w-full border border-marble rounded-lg px-4 py-3 text-ink text-sm bg-white focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1.5">
                  Check-out
                </label>
                <input
                  type="date"
                  min={minCheckOut}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border border-marble rounded-lg px-4 py-3 text-ink text-sm bg-white focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition"
                />
              </div>
            </div>

            {/* Nights display */}
            {checkIn && checkOut && nights > 0 && (
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm"
                style={{ background: "var(--leaf-l)", border: "1px solid rgba(58,107,74,0.2)" }}
              >
                <span className="text-leaf font-bold text-base">🌙</span>
                <span className="font-semibold text-ink">{nights} Night{nights > 1 ? "s" : ""}</span>
                <span className="text-muted">·</span>
                <span className="text-muted">{fmtDate(checkIn)}</span>
                <span className="text-stone">→</span>
                <span className="text-muted">{fmtDate(checkOut)}</span>
              </div>
            )}

            {/* Guest summary from search */}
            {(adults !== 2 || children > 0 || searchedRooms > 1) && (
              <div className="flex items-center justify-between mt-3 px-4 py-2.5 rounded-lg text-sm bg-white border border-marble">
                <span className="text-muted">
                  {searchedRooms} Room{searchedRooms > 1 ? "s" : ""} · {adults} Adult{adults > 1 ? "s" : ""}
                  {children > 0 ? ` · ${children} Child${children > 1 ? "ren" : ""}` : ""}
                </span>
                <a href="/#booking" className="text-saffron text-xs font-bold hover:underline shrink-0">
                  Modify ↗
                </a>
              </div>
            )}
          </section>

          {/* Step 2: Room selection — independent ADD per type */}
          <section>
            <h2 className="font-display text-lg font-bold text-ink mb-1">2. Select Rooms</h2>
            <p className="text-sm text-muted mb-4">
              You can add multiple room types. Use <strong>+ ADD</strong> on each card.
            </p>

            <div className="flex flex-col gap-3">
              {ROOM_OPTIONS.map((room) => {
                const avail      = allAvail[room.id];
                const totalUnits = ROOM_UNITS[room.id as keyof typeof ROOM_UNITS] ?? 1;
                const fullyBooked = avail ? !avail.available : false;
                const availUnits  = avail ? avail.availableUnits : totalUnits;
                const datesSet    = !!(checkIn && checkOut && nights > 0);
                const qty         = selections[room.id] ?? 0;
                const isSelected  = qty > 0;
                const cap         = ROOM_CAPACITY[room.id as keyof typeof ROOM_CAPACITY];

                return (
                  <div
                    key={room.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      fullyBooked
                        ? "border-marble bg-marble/40 opacity-60"
                        : isSelected
                        ? "border-saffron bg-white shadow-sm"
                        : "border-marble bg-white hover:border-stone/60"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Room info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="font-semibold text-ink text-[15px]">{room.name}</span>
                          <span
                            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                            style={{ background: "var(--marble)", color: "var(--muted)" }}
                          >
                            Max {cap.maxTotal} guests
                          </span>
                          {isSelected && (
                            <span className="text-[11px] font-bold text-white bg-saffron px-2 py-0.5 rounded-full">
                              Selected
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2">
                          {room.amenities.map((a) => (
                            <span key={a} className="text-xs text-muted">{a}</span>
                          ))}
                        </div>

                        {/* Availability */}
                        {datesSet && (
                          availLoading ? (
                            <span className="text-[11px] text-stone animate-pulse">checking…</span>
                          ) : fullyBooked ? (
                            <span className="text-[11px] font-semibold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                              Fully Booked
                            </span>
                          ) : availUnits === 1 ? (
                            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              Only 1 left!
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-leaf bg-leaf-l border border-leaf/20 px-2 py-0.5 rounded-full">
                              {availUnits} of {totalUnits} available
                            </span>
                          )
                        )}
                      </div>

                      {/* Price + ADD / counter */}
                      <div className="shrink-0 flex flex-col items-end gap-2.5">
                        <div className="text-right">
                          <span className="font-bold text-saffron text-[15px]">
                            {formatCurrency(room.price)}
                          </span>
                          <span className="text-stone font-normal text-xs ml-1">/night</span>
                          {isSelected && qty > 1 && (
                            <div className="text-[11px] text-muted mt-0.5">
                              {qty} rooms · {formatCurrency(room.price * qty)}/night
                            </div>
                          )}
                          {isSelected && nights > 0 && (
                            <div className="text-[11px] text-leaf font-semibold mt-0.5">
                              {formatCurrency(room.price * qty * nights)} total
                            </div>
                          )}
                        </div>

                        {isSelected ? (
                          /* − qty + counter */
                          <div
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                            style={{ border: "2px solid var(--saffron)" }}
                          >
                            <button
                              type="button"
                              onClick={() => changeQty(room.id, -1)}
                              className="w-7 h-7 flex items-center justify-center font-bold text-xl text-saffron hover:text-saffron-d transition-colors"
                              title="Remove one room (tap to 0 to deselect)"
                            >
                              −
                            </button>
                            <span className="font-bold text-ink text-[16px] min-w-[1.25rem] text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeQty(room.id, 1)}
                              disabled={qty >= availUnits}
                              className="w-7 h-7 flex items-center justify-center font-bold text-xl text-saffron disabled:opacity-30 disabled:cursor-not-allowed hover:text-saffron-d transition-colors"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          /* ADD button */
                          <button
                            type="button"
                            disabled={fullyBooked}
                            onClick={() => !fullyBooked && addRoom(room.id)}
                            className={`text-[13px] font-bold px-4 py-2 rounded-lg transition-all ${
                              fullyBooked
                                ? "bg-marble text-stone cursor-not-allowed"
                                : "bg-saffron hover:bg-saffron-d text-white cursor-pointer hover:-translate-y-px active:scale-95"
                            }`}
                          >
                            + ADD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selection summary strip */}
            {hasSelection && (
              <div
                className="mt-4 px-4 py-3 rounded-xl text-sm flex flex-col gap-1"
                style={{ background: "var(--cream)", border: "1px solid var(--marble)" }}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone mb-1">
                  Your Selection
                </div>
                {selectedEntries.map(([id, qty]) => {
                  const opt = ROOM_OPTIONS.find((r) => r.id === id)!;
                  return (
                    <div key={id} className="flex justify-between items-center">
                      <span className="text-ink font-medium">
                        {qty > 1 ? `${qty}× ` : ""}{opt.name}
                      </span>
                      <span className="text-muted text-[12px]">
                        {formatCurrency(opt.price * qty)}/night
                        {nights > 0 && (
                          <span className="text-leaf font-semibold ml-1">
                            · {formatCurrency(opt.price * qty * nights)} total
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
                {selectedEntries.length > 1 && (
                  <div
                    className="flex justify-between items-center pt-2 mt-1 font-semibold text-ink"
                    style={{ borderTop: "1px dashed var(--marble)" }}
                  >
                    <span>Combined</span>
                    <span>
                      {formatCurrency(pricePerNight)}/night
                      {nights > 0 && (
                        <span className="text-saffron ml-1">
                          · {formatCurrency(baseAmount)} total
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Step 3: Guest details */}
          <section>
            <h2 className="font-display text-lg font-bold text-ink mb-4">3. Your Details</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => touch("name")}
                  className="w-full border border-marble rounded-lg px-4 py-3 text-ink text-sm bg-white focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition"
                />
                {touched.name && name.trim().length < 2 && (
                  <p className="text-xs text-red-500 mt-1">Please enter your full name</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => touch("email")}
                  className="w-full border border-marble rounded-lg px-4 py-3 text-ink text-sm bg-white focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition"
                />
                {touched.email && !emailValid && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid email</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1.5">
                  Phone Number *{" "}
                  <span className="text-muted normal-case font-normal">(WhatsApp preferred)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => touch("phone")}
                  className="w-full border border-marble rounded-lg px-4 py-3 text-ink text-sm bg-white focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition"
                />
                {touched.phone && !phoneValid && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid 10-digit Indian mobile number</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1.5">
                  Special Requests{" "}
                  <span className="text-muted normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Early check-in, anniversary setup, dietary requirements, extra bed…"
                  value={special}
                  onChange={(e) => setSpecial(e.target.value)}
                  className="w-full border border-marble rounded-lg px-4 py-3 text-ink text-sm bg-white focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── Right: summary + pay ────────────────────── */}
        <div className="booking-summary-sticky">
          <div className="bg-white rounded-2xl border border-marble p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-ink mb-5">Booking Summary</h3>

            {nights > 0 && hasSelection ? (
              <>
                {/* Room lines */}
                <div className="flex flex-col gap-2 text-sm mb-3">
                  {selectedEntries.map(([id, qty]) => {
                    const opt = ROOM_OPTIONS.find((r) => r.id === id)!;
                    return (
                      <div key={id} className="flex justify-between">
                        <span className="text-muted">{qty > 1 ? `${qty}× ` : ""}{opt.name}</span>
                        <span className="font-medium text-ink">{formatCurrency(opt.price * qty)}/night</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between">
                    <span className="text-muted">Check-in</span>
                    <span className="font-medium text-ink">{fmtDate(checkIn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Check-out</span>
                    <span className="font-medium text-ink">{fmtDate(checkOut)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Guests</span>
                    <span className="font-medium text-ink">
                      {adults} adult{adults !== 1 ? "s" : ""}
                      {children > 0 ? ` · ${children} child${children !== 1 ? "ren" : ""}` : ""}
                    </span>
                  </div>
                </div>

                {/* Bill */}
                <div className="bg-cream rounded-xl p-4 flex flex-col gap-2 text-sm mb-4">
                  <div className="text-[10px] font-bold tracking-[2px] uppercase text-stone mb-1">Bill Breakdown</div>
                  {selectedEntries.map(([id, qty]) => {
                    const opt = ROOM_OPTIONS.find((r) => r.id === id)!;
                    return (
                      <div key={id} className="flex justify-between">
                        <span className="text-muted text-[12px]">
                          {qty > 1 ? `${qty}× ` : ""}{opt.name} × {nights}n
                        </span>
                        <span className="font-medium text-ink">{formatCurrency(opt.price * qty * nights)}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between">
                    <span className="text-muted">GST (5%)</span>
                    <span className="font-medium text-ink">{formatCurrency(gstAmount)}</span>
                  </div>
                  <div
                    className="flex justify-between pt-2.5 mt-0.5"
                    style={{ borderTop: "1px dashed var(--marble)" }}
                  >
                    <span className="font-bold text-ink">Total Payable</span>
                    <div className="text-right">
                      <div className="font-black text-saffron text-[17px] leading-none">
                        {formatCurrency(totalAmount)}
                      </div>
                      {currency.code !== "INR" && (
                        <div className="text-[11px] text-stone mt-0.5">
                          ≈ INR ₹{totalAmount.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {currency.code !== "INR" && (
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 mb-3">
                    <span className="text-base">{currency.flag}</span>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Prices in {currency.name}. Razorpay charges{" "}
                      <strong>INR ₹{totalAmount.toLocaleString("en-IN")}</strong> — your bank converts at the live rate.
                    </p>
                  </div>
                )}

                <p className="text-[11px] text-muted mb-4 leading-relaxed">
                  * GST @ 5% applicable on accommodation as per Government of India norms.
                </p>
              </>
            ) : (
              <div className="text-center py-6 text-muted text-sm">
                {!checkIn || !checkOut
                  ? "Select dates to see price"
                  : "Select at least one room to continue"}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handlePayOnline}
              disabled={!formValid || isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all ${
                formValid && !isLoading
                  ? "bg-saffron hover:bg-saffron-d active:scale-[0.98] cursor-pointer"
                  : "bg-stone/50 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Processing…" : nights > 0 && hasSelection ? `Pay ${formatCurrency(totalAmount)} Online →` : "Select dates & rooms"}
            </button>

            <div className="mt-2 flex items-center gap-2 justify-center text-xs text-muted">
              <span>🔒</span>
              <span>Razorpay · UPI · Cards · Net Banking</span>
            </div>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 border-t border-marble" />
              <span className="text-xs text-muted">or</span>
              <div className="flex-1 border-t border-marble" />
            </div>

            <button
              onClick={handlePayAtProperty}
              disabled={!formValid || isLoading}
              className={`w-full py-3.5 rounded-xl font-semibold text-base border-2 transition-all ${
                formValid && !isLoading
                  ? "border-ink text-ink hover:bg-ink hover:text-white cursor-pointer"
                  : "border-marble text-stone cursor-not-allowed"
              }`}
            >
              Reserve · Pay at Property
            </button>
            <p className="text-xs text-muted text-center mt-2">
              No payment now — Aneesh will confirm within 2 hrs
            </p>

            <div className="mt-5 pt-4 border-t border-marble text-xs text-muted space-y-1">
              <div>✅ Instant booking confirmation</div>
              <div>✅ Free cancellation up to 48 hrs before check-in</div>
              <div>✅ Best price — no OTA commission</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .booking-form-grid { grid-template-columns: 1fr 380px; }
        .booking-summary-sticky { position: sticky; top: calc(var(--nav-h) + 24px); }
        @media (max-width: 860px) {
          .booking-form-grid { grid-template-columns: 1fr !important; }
          .booking-summary-sticky { position: static !important; }
        }
      `}</style>
    </>
  );
}

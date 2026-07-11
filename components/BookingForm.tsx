"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import Script from "next/script";
import { ROOMS } from "@/lib/constants";
import { ROOM_PRICES, MAX_GUESTS, GST_RATE, ROOM_UNITS } from "@/lib/booking-config";
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
  priceLabel: r.price,
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
  return Math.max(
    0,
    Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000)
  );
}

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [roomId, setRoomId] = useState("deluxe-ac");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [special, setSpecial] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [allAvail, setAllAvail] = useState<AllAvail>({});
  const [availLoading, setAvailLoading] = useState(false);

  // Pre-fill from URL params (passed from BookingBar)
  useEffect(() => {
    const room = searchParams.get("room");
    const ci = searchParams.get("checkin");
    const co = searchParams.get("checkout");
    const g = searchParams.get("guests");
    if (room && ROOM_PRICES[room as keyof typeof ROOM_PRICES]) setRoomId(room);
    if (ci) setCheckIn(ci);
    if (co) setCheckOut(co);
    if (g) {
      const gNum = parseInt(g, 10);
      const maxG = MAX_GUESTS[(room ?? "deluxe-ac") as keyof typeof MAX_GUESTS] ?? 3;
      if (gNum > 0) setGuests(Math.min(gNum, maxG));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { currency, format: formatCurrency } = useCurrency();
  const selectedRoom = ROOM_OPTIONS.find((r) => r.id === roomId)!;
  const nights = nightsBetween(checkIn, checkOut);
  const baseAmount = nights * selectedRoom.price;
  const gstAmount = Math.round(baseAmount * GST_RATE);
  const totalAmount = baseAmount + gstAmount;

  const minCheckIn = todayStr();
  const minCheckOut = checkIn ? addDays(checkIn, 1) : addDays(todayStr(), 1);

  // Batch availability check for all rooms when dates change
  useEffect(() => {
    if (!checkIn || !checkOut || nights === 0) {
      setAllAvail({});
      return;
    }
    setAvailLoading(true);
    const ctrl = new AbortController();
    fetch(`/api/availability?checkin=${checkIn}&checkout=${checkOut}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data: AllAvail) => {
        setAllAvail(data);
        // Auto-switch to first available room if current is fully booked
        if (data[roomId] && !data[roomId].available) {
          const firstAvail = Object.entries(data).find(([, v]) => v.available)?.[0];
          if (firstAvail) setRoomId(firstAvail);
        }
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

  const handleRoomChange = useCallback(
    (id: string) => {
      setRoomId(id);
      const max = MAX_GUESTS[id as keyof typeof MAX_GUESTS] ?? 2;
      if (guests > max) setGuests(max);
    },
    [guests]
  );

  const touch = (field: Field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = /^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").replace(/^91/, ""));

  const currentRoomAvail = allAvail[roomId];
  const roomFullyBooked = currentRoomAvail ? !currentRoomAvail.available : false;

  const formValid =
    checkIn &&
    checkOut &&
    nights > 0 &&
    !roomFullyBooked &&
    name.trim().length >= 2 &&
    emailValid &&
    phoneValid;

  async function handlePayOnline() {
    if (!formValid || isLoading) return;
    if (!scriptReady) {
      setError("Payment script not loaded yet — please try again in a moment.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const orderRes = await fetch("/api/bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkIn,
          checkOut,
          nights,
          guests,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          special: special.trim(),
          baseAmount,
          gstAmount,
          amount: totalAmount,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error ?? "Failed to create order");

      const { orderId, bookingId, keyId } = orderData;

      const rzp = new window.Razorpay({
        key: keyId,
        amount: totalAmount * 100,
        currency: "INR",
        name: "VMP Villa Home Stay",
        description: `${selectedRoom.name} — ${nights} night${nights > 1 ? "s" : ""}`,
        order_id: orderId,
        prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
        theme: { color: "#e8762b" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
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
              setError(
                d.error ??
                  "Payment received but confirmation failed. Please WhatsApp Aneesh with your payment ID."
              );
              setIsLoading(false);
            }
          } catch {
            setError(
              "Payment received but we hit an error. Please WhatsApp Aneesh with your payment ID: " +
                response.razorpay_payment_id
            );
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again or use a different payment method.");
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
          roomId,
          checkIn,
          checkOut,
          nights,
          guests,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          special: special.trim(),
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
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptReady(true)}
      />

      <div className="max-w-[1100px] mx-auto px-5 py-12 grid gap-10 items-start booking-form-grid">
        {/* ── Left: form ─────────────────────────────────── */}
        <div className="flex flex-col gap-8">

          {/* Step 1: Room */}
          <section>
            <h2 className="font-display text-lg font-bold text-ink mb-4">1. Choose Your Room</h2>
            <div className="flex flex-col gap-3">
              {ROOM_OPTIONS.map((room) => {
                const avail = allAvail[room.id];
                const totalUnits = ROOM_UNITS[room.id] ?? 1;
                const fullyBooked = avail ? !avail.available : false;
                const availUnits = avail ? avail.availableUnits : totalUnits;
                const datesSelected = checkIn && checkOut && nights > 0;

                return (
                  <label
                    key={room.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                      fullyBooked
                        ? "border-marble bg-marble/40 opacity-60 cursor-not-allowed"
                        : roomId === room.id
                        ? "border-saffron bg-white shadow-sm cursor-pointer"
                        : "border-marble bg-white hover:border-stone cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="room"
                      value={room.id}
                      checked={roomId === room.id}
                      disabled={fullyBooked}
                      onChange={() => !fullyBooked && handleRoomChange(room.id)}
                      className="mt-1 accent-[#e8762b]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-ink text-[15px]">{room.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Availability badge — only show when dates are selected */}
                          {datesSelected && (
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
                          <span className="font-bold text-saffron text-[15px]">
                            {formatCurrency(room.price)}
                            <span className="text-stone font-normal text-xs ml-1">{room.priceUnit}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                        {room.amenities.map((a) => (
                          <span key={a} className="text-xs text-muted">{a}</span>
                        ))}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Step 2: Dates + Guests */}
          <section>
            <h2 className="font-display text-lg font-bold text-ink mb-4">2. Pick Your Dates</h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
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

            {checkIn && checkOut && nights > 0 && currentRoomAvail && (
              <div className="mt-2">
                {currentRoomAvail.available ? (
                  <span className="text-xs font-semibold text-leaf">
                    ✓ {currentRoomAvail.availableUnits} of {currentRoomAvail.totalUnits} unit{currentRoomAvail.totalUnits > 1 ? "s" : ""} available for your dates
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-500">✗ Fully booked for these dates — please choose different dates or another room</span>
                )}
              </div>
            )}

            <div className="mt-4">
              <label className="block text-xs font-semibold text-stone uppercase tracking-wider mb-1.5">
                Number of Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full border border-marble rounded-lg px-4 py-3 text-ink text-sm bg-white focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition"
              >
                {Array.from({ length: MAX_GUESTS[roomId as keyof typeof MAX_GUESTS] ?? 2 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
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
                  Phone Number * <span className="text-muted normal-case font-normal">(WhatsApp preferred)</span>
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
                  Special Requests <span className="text-muted normal-case font-normal">(optional)</span>
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

        {/* ── Right: price summary + pay buttons ─────────── */}
        <div className="booking-summary-sticky">
          <div className="bg-white rounded-2xl border border-marble p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-ink mb-5">Booking Summary</h3>

            {nights > 0 ? (
              <>
                {/* Stay details */}
                <div className="flex flex-col gap-2.5 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted">Room</span>
                    <span className="font-medium text-ink text-right max-w-[60%]">{selectedRoom.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Check-in</span>
                    <span className="font-medium text-ink">{checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Check-out</span>
                    <span className="font-medium text-ink">{checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Guests</span>
                    <span className="font-medium text-ink">{guests}</span>
                  </div>
                </div>

                {/* Bill breakdown */}
                <div className="bg-cream rounded-xl p-4 flex flex-col gap-2.5 text-sm mb-4">
                  <div className="text-[10px] font-bold tracking-[2px] uppercase text-stone mb-1">Bill Breakdown</div>
                  <div className="flex justify-between">
                    <span className="text-muted">
                      {nights} night{nights > 1 ? "s" : ""} × {formatCurrency(selectedRoom.price)}
                    </span>
                    <span className="font-medium text-ink">{formatCurrency(baseAmount)}</span>
                  </div>
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

                {/* Currency note */}
                {currency.code !== "INR" && (
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 mb-3">
                    <span className="text-base">{currency.flag}</span>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Prices in {currency.name}. Razorpay charges <strong>INR ₹{totalAmount.toLocaleString("en-IN")}</strong> — your bank converts at the live rate.
                    </p>
                  </div>
                )}

                <p className="text-[11px] text-muted mb-4 leading-relaxed">
                  * GST @ 5% applicable on accommodation as per Government of India norms. A GST invoice will be provided on request.
                </p>
              </>
            ) : (
              <div className="text-center py-6 text-muted text-sm">
                Select dates to see price
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {roomFullyBooked && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                This room is fully booked for your selected dates. Please choose different dates or another room type.
              </div>
            )}

            {/* Primary: Pay Online via Razorpay */}
            <button
              onClick={handlePayOnline}
              disabled={!formValid || isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all ${
                formValid && !isLoading
                  ? "bg-saffron hover:bg-saffron-d active:scale-[0.98] cursor-pointer"
                  : "bg-stone/50 cursor-not-allowed"
              }`}
            >
              {isLoading
                ? "Processing…"
                : nights > 0
                ? `Pay ${formatCurrency(totalAmount)} Online →`
                : "Select dates to continue"}
            </button>

            <div className="mt-2 flex items-center gap-2 justify-center text-xs text-muted">
              <span>🔒</span>
              <span>Razorpay · UPI · Cards · Net Banking</span>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 border-t border-marble" />
              <span className="text-xs text-muted">or</span>
              <div className="flex-1 border-t border-marble" />
            </div>

            {/* Secondary: Pay at Property */}
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

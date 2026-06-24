"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { ROOMS } from "@/lib/constants";
import { ROOM_PRICES, MAX_GUESTS } from "@/lib/booking-config";

// Razorpay type shim
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, any>) => { open(): void; on(event: string, cb: () => void): void };
  }
}

type Field = "name" | "email" | "phone";

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

  const selectedRoom = ROOM_OPTIONS.find((r) => r.id === roomId)!;
  const nights = nightsBetween(checkIn, checkOut);
  const totalAmount = nights * selectedRoom.price;

  const minCheckIn = todayStr();
  const minCheckOut = checkIn ? addDays(checkIn, 1) : addDays(todayStr(), 1);

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

  const formValid =
    checkIn &&
    checkOut &&
    nights > 0 &&
    name.trim().length >= 2 &&
    emailValid &&
    phoneValid;

  async function handlePay() {
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
                  "Payment received but confirmation failed. Please WhatsApp Aneesh immediately with your payment ID."
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
              {ROOM_OPTIONS.map((room) => (
                <label
                  key={room.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    roomId === room.id
                      ? "border-saffron bg-white shadow-sm"
                      : "border-marble bg-white hover:border-stone"
                  }`}
                >
                  <input
                    type="radio"
                    name="room"
                    value={room.id}
                    checked={roomId === room.id}
                    onChange={() => handleRoomChange(room.id)}
                    className="mt-1 accent-[#e8762b]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-semibold text-ink text-[15px]">{room.name}</span>
                      <span className="font-bold text-saffron text-[15px] shrink-0">
                        {room.priceLabel}
                        <span className="text-stone font-normal text-xs ml-1">{room.priceUnit}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                      {room.amenities.map((a) => (
                        <span key={a} className="text-xs text-muted">{a}</span>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
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

        {/* ── Right: price summary + pay button ─────────── */}
        <div className="booking-summary-sticky">
          <div className="bg-white rounded-2xl border border-marble p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-ink mb-5">Booking Summary</h3>

            {nights > 0 ? (
              <>
                <div className="flex flex-col gap-3 text-sm mb-5">
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
                    <span className="text-muted">{nights} night{nights > 1 ? "s" : ""} × ₹{selectedRoom.price.toLocaleString("en-IN")}</span>
                    <span className="font-medium text-ink">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Guests</span>
                    <span className="font-medium text-ink">{guests}</span>
                  </div>
                </div>
                <div className="border-t border-marble pt-4 mb-5 flex justify-between items-center">
                  <span className="font-bold text-ink">Total</span>
                  <span className="font-black text-saffron text-xl">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
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

            <button
              onClick={handlePay}
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
                ? `Pay ₹${totalAmount.toLocaleString("en-IN")} →`
                : "Select dates to continue"}
            </button>

            <div className="mt-4 flex items-center gap-2 justify-center text-xs text-muted">
              <span>🔒</span>
              <span>Secured by Razorpay · UPI · Cards · Net Banking</span>
            </div>

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

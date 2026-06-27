"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { WA_CHAT_URL } from "@/lib/whatsapp";

type BookingData = {
  id: string;
  room_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  guest_name: string;
  guest_email: string;
  amount_paise: number;
  status: string;
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function BookingDetails() {
  const params = useSearchParams();
  const id = params.get("id");
  const isRequest = params.get("mode") === "request";
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No booking ID provided.");
      setLoading(false);
      return;
    }
    fetch(`/api/bookings/status?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setBooking(data);
      })
      .catch(() => setError("Failed to load booking details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center text-muted">
          <div className="text-3xl mb-3 animate-pulse">⏳</div>
          <p className="text-sm">Loading your booking…</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex items-center justify-center py-24 px-5">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="font-display text-xl font-bold text-ink mb-2">Booking Not Found</h1>
          <p className="text-muted text-sm mb-6">
            {error || "We couldn't find your booking. Please check your confirmation email."}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-saffron text-white font-semibold px-6 py-3 rounded-lg text-sm"
          >
            Contact Aneesh
          </Link>
        </div>
      </div>
    );
  }

  const amount = booking.amount_paise / 100;
  const payAtProperty = isRequest || booking.status === "pending";

  return (
    <>
      {/* Hero banner */}
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[700px] mx-auto text-center">
          <div className="text-6xl mb-4">{payAtProperty ? "🏡" : "🎉"}</div>
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
            {payAtProperty ? "Booking Request Received" : "Booking Confirmed"}
          </div>
          <h1
            className="font-display font-black text-white mb-3 leading-tight"
            style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
          >
            {payAtProperty ? "Request received," : "See you in Agra,"}&nbsp;
            <em className="not-italic text-saffron">
              {booking.guest_name.split(" ")[0]}!
            </em>
          </h1>
          <p className="text-white/60 text-[15px] leading-[1.7]">
            {payAtProperty
              ? "Aneesh will confirm your booking within 2 hours via WhatsApp or email."
              : "Your room is reserved. A confirmation email has been sent to"}{" "}
            {!payAtProperty && <strong className="text-white/80">{booking.guest_email}</strong>}
            {payAtProperty && <>(sent to <strong className="text-white/80">{booking.guest_email}</strong>)</>}
          </p>
          <div
            className="inline-block mt-4 px-4 py-2 rounded-full text-xs font-bold"
            style={{
              background: "rgba(58,107,74,0.2)",
              border: "1px solid rgba(58,107,74,0.35)",
              color: "#6FCF97",
            }}
          >
            Booking ID: {booking.id.slice(-8).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "48px 20px 80px" }}>
        <div className="max-w-[600px] mx-auto flex flex-col gap-5">

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-marble p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-ink mb-5">Booking Summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: "Room", value: booking.room_name },
                { label: "Check-in", value: `${fmtDate(booking.check_in)} · 12:00 PM` },
                { label: "Check-out", value: `${fmtDate(booking.check_out)} · 11:00 AM` },
                { label: "Duration", value: `${booking.nights} night${booking.nights > 1 ? "s" : ""}` },
                { label: "Guests", value: String(booking.guests) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-muted">{label}</span>
                  <span className="font-medium text-ink text-right">{value}</span>
                </div>
              ))}
              <div className="flex justify-between gap-2 pt-3 mt-1 border-t border-marble">
                <span className="font-bold text-ink text-base">
                  {payAtProperty ? "Amount Due at Property" : "Total Paid"}
                </span>
                <span className="font-black text-saffron text-xl">
                  ₹{amount.toLocaleString("en-IN")}
                </span>
              </div>
              {payAtProperty && (
                <p className="text-xs text-muted mt-2">
                  Pay by cash, UPI, or card when you arrive. No advance payment required.
                </p>
              )}
            </div>
          </div>

          {/* What's next */}
          <div className="bg-white rounded-2xl border border-marble p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-ink mb-4">Before You Arrive</h2>
            <ul className="text-sm text-muted space-y-2">
              {[
                "Carry a valid government-issued photo ID (Aadhaar, Passport, or Driving Licence)",
                "Check-in from 12:00 PM — WhatsApp us if you expect to arrive early",
                "Check-out by 11:00 AM to avoid an extra night charge",
                "Free parking available for cars and bikes",
                "Breakfast (₹200/person) can be added on arrival — highly recommended!",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-saffron shrink-0 mt-0.5">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-marble p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-ink mb-2">
              Questions? Talk to Aneesh
            </h2>
            <p className="text-sm text-muted mb-5">
              Need to change dates, add a request, or ask anything about your
              stay? Aneesh replies within 30 minutes on WhatsApp.
            </p>
            <a
              href={WA_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              💬 WhatsApp Aneesh
            </a>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-saffron text-sm font-medium hover:underline"
            >
              ← Back to VMP Villa homepage
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center text-muted">
              <div className="text-3xl mb-3 animate-pulse">⏳</div>
              <p className="text-sm">Loading…</p>
            </div>
          </div>
        }
      >
        <BookingDetails />
      </Suspense>
    </div>
  );
}

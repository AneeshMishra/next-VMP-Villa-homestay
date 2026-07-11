import { Suspense } from "react";
import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book a Room — VMP Villa Home Stay, Agra",
  description:
    "Book your stay at VMP Villa directly and save 15–20% vs OTAs. Instant confirmation, secure Razorpay payment, free cancellation up to 48 hours.",
};

export default function BookPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
            Book Direct — Save More
          </div>
          <h1
            className="font-display font-black text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(36px, 6vw, 60px)" }}
          >
            Reserve Your Room at{" "}
            <em className="not-italic text-saffron">VMP Villa</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            Book directly with us and save 15–20% compared to Booking.com or
            MakeMyTrip. Secure payment via Razorpay. Instant confirmation email
            and WhatsApp message.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {[
              "✅ Free cancellation up to 48 hrs",
              "🔒 Secure Razorpay payment",
              "📧 Instant email confirmation",
              "💬 WhatsApp notification",
            ].map((badge) => (
              <span
                key={badge}
                className="text-[12px] font-medium px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-cream">
        <Suspense fallback={
          <div className="flex items-center justify-center py-24">
            <div className="text-center text-muted">
              <div className="text-3xl mb-3 animate-pulse">⏳</div>
              <p className="text-sm">Loading booking form…</p>
            </div>
          </div>
        }>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}

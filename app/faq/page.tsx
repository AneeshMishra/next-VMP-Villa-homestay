import type { Metadata } from "next";
import FaqSection from "@/components/sections/FaqSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Check-in times, cancellation policy, pet policy, transfers, and more. Everything you need to know before booking at VMP Villa, Agra.",
};

export default function FaqPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
            Help
          </div>
          <h1
            className="font-display font-black text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(36px, 6vw, 60px)" }}
          >
            Frequently Asked{" "}
            <em className="not-italic text-saffron">Questions</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            Everything you want to know before booking. Can&apos;t find what you&apos;re looking for?
            WhatsApp us — we reply in under 30 minutes.
          </p>
        </div>
      </div>

      <FaqSection />

      {/* Still have questions CTA */}
      <div className="bg-marble text-center" style={{ padding: "60px 40px" }}>
        <h2 className="font-display text-[28px] font-bold mb-4">Still have a question?</h2>
        <p className="text-muted mb-8 max-w-[480px] mx-auto">
          Aneesh and Bhavna are on WhatsApp every day from 7 AM to 10 PM and reply within 30 minutes.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-saffron hover:bg-saffron-d text-white font-semibold px-8 py-4 rounded-lg transition-all duration-150"
          >
            💬 Chat on WhatsApp
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white border border-marble text-ink hover:border-saffron font-semibold px-8 py-4 rounded-lg transition-all duration-150"
          >
            📧 Send Enquiry
          </Link>
        </div>
      </div>
    </div>
  );
}

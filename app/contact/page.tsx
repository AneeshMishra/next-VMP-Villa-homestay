import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";
import ReviewsSection from "@/components/sections/ReviewsSection";

export const metadata: Metadata = {
  title: "Contact & Enquiry",
  description:
    "Contact VMP Villa via WhatsApp, phone, or email. Send a booking enquiry and get a reply within 30 minutes. We reply to WhatsApp fastest.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">
            Contact Us
          </div>
          <h1
            className="font-display font-black text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(36px, 6vw, 60px)" }}
          >
            We&apos;re just a{" "}
            <em className="not-italic text-saffron">WhatsApp away</em>
          </h1>
          <p className="text-white/60 text-[15px] max-w-[560px] leading-[1.7]">
            Aneesh and Bhavna personally manage all communications. No chatbots. No call centres.
            Just real people who love hosting.
          </p>
        </div>
      </div>

      <ContactSection />
      <div id="reviews">
        <ReviewsSection />
      </div>
    </div>
  );
}

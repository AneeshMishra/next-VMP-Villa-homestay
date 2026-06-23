import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL, PHONE_DISPLAY, ADDRESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for staying at VMP Villa Home Stay, Agra.",
};

const SECTIONS = [
  { title: "1. Booking & Confirmation", body: "A booking is confirmed only after Aneesh or Bhavna has explicitly confirmed availability via WhatsApp, email, or phone. VMP Villa reserves the right to decline any booking at its discretion." },
  { title: "2. Check-in & Check-out", body: "Standard check-in time is 12:00 PM (noon). Standard check-out time is 11:00 AM. Early check-in or late check-out may be possible subject to availability — please request at least 24 hours in advance via WhatsApp." },
  { title: "3. House Rules", body: "Guests are expected to treat the property and all other guests with respect. Noise levels must be kept reasonable between 10:00 PM and 7:00 AM. Smoking is not permitted inside any room or enclosed area. Visitors from outside the property are not permitted in rooms after 9:00 PM without prior consent." },
  { title: "4. Identification", body: "All guests are required to provide a valid government-issued photo ID (Aadhaar, Passport, Driving Licence) at check-in, as required under Indian law." },
  { title: "5. Liability", body: "VMP Villa accepts no responsibility for loss, theft, or damage to guests’ personal belongings during their stay. We strongly recommend travel insurance." },
  { title: "6. Damage", body: "Guests are liable for any damage caused to the property, fixtures, or fittings during their stay. The cost of repairs or replacement will be charged to the guest and must be paid before checkout." },
  { title: "7. Right of Refusal", body: "VMP Villa reserves the right to ask any guest to vacate the premises immediately if they are found to be in serious breach of these terms or acting disrespectfully. No refund will be issued in such cases." },
  { title: "8. Governing Law", body: "These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts of Agra, Uttar Pradesh." },
  { title: "9. Contact", body: `VMP Villa Home Stay · ${ADDRESS} · ${PHONE_DISPLAY} · ${EMAIL}` },
];

export default function TermsPage() {
  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[760px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">Legal</div>
          <h1 className="font-display font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>Terms &amp; Conditions</h1>
          <p className="text-white/60 text-[14px]">Last updated: June 2025</p>
        </div>
      </div>
      <div className="bg-cream" style={{ padding: "64px 40px 80px" }}>
        <div className="max-w-[760px] mx-auto">
          {SECTIONS.map((s) => (
            <div key={s.title} className="mb-8">
              <h2 className="font-display text-xl font-bold text-ink mb-3">{s.title}</h2>
              <p className="text-muted text-[15px] leading-[1.8]">{s.body}</p>
            </div>
          ))}
          <div className="mt-10 pt-8 border-t border-marble flex gap-6">
            <Link href="/cancellation" className="text-saffron hover:underline font-medium text-sm">Read Cancellation Policy →</Link>
            <Link href="/contact" className="text-saffron hover:underline font-medium text-sm">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

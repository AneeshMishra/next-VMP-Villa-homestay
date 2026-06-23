import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for VMP Villa Home Stay, Agra.",
};

const SECTIONS = [
  { title: "1. Information We Collect", body: "When you contact us or make a booking, we may collect your name, phone number, email address, WhatsApp number, check-in and check-out dates, room preferences, and any special requests you share with us. We do not collect payment card details — all payments, when available, are processed securely through Razorpay." },
  { title: "2. How We Use Your Information", body: "We use your information solely to manage your booking, respond to enquiries, send booking confirmations, and provide the services you request. We may also use your contact details to send you pre-arrival tips or post-checkout follow-ups directly relevant to your stay." },
  { title: "3. WhatsApp & Messaging", body: "When you contact us via WhatsApp, your messages are subject to WhatsApp’s own privacy policy. We do not store WhatsApp conversations on third-party servers beyond the WhatsApp platform. We will not add you to any broadcast list without your explicit consent." },
  { title: "4. Sharing Your Information", body: "We do not sell, rent, or share your personal information with third parties except where required by law, or where necessary to fulfil your booking. We do not share data with OTA platforms unless you book through them directly." },
  { title: "5. Data Retention", body: "We retain booking records for up to 3 years for accounting and tax compliance purposes under Indian law. You may request deletion of your personal data at any time by contacting us at the email below, subject to any legal retention requirements." },
  { title: "6. Cookies & Analytics", body: "Our website may use Google Analytics to understand visitor behaviour. This data is anonymised and not linked to your personal identity. You can disable cookies in your browser settings at any time." },
  { title: "7. Your Rights", body: "You have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, please contact us at the email address below." },
  { title: "8. Contact", body: `For any privacy-related queries, email us at ${EMAIL}. We aim to respond within 3 business days.` },
];

export default function PrivacyPage() {
  return (
    <div>
      <div className="bg-ink text-white" style={{ padding: "64px 40px 48px" }}>
        <div className="max-w-[760px] mx-auto">
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-3">Legal</div>
          <h1 className="font-display font-black text-white mb-4 leading-tight" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>Privacy Policy</h1>
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
          <div className="mt-10 pt-8 border-t border-marble">
            <Link href="/contact" className="text-saffron hover:underline font-medium text-sm">← Back to Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

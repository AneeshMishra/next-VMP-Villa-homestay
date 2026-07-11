"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { buildWhatsAppUrl, enquiryMessage } from "@/lib/whatsapp";
import {
  EMAIL,
  INSTAGRAM_URL,
  INSTAGRAM,
  PHONE_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/constants";

export default function ContactSection() {
  const t = useTranslations("contact");
  const tBar = useTranslations("bookingBar");
  const tBook = useTranslations("booking");

  const CHANNELS = [
    {
      icon: "💬",
      iconBg: "#25D366",
      name: "WhatsApp (Fastest)",
      value: `${PHONE_DISPLAY} · Usually replies in < 30 min`,
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20room%20at%20VMP%20Villa`,
    },
    {
      icon: "📞",
      iconBg: "#e8762b",
      name: "Call Us",
      value: `${PHONE_DISPLAY} · 7 AM – 10 PM daily`,
      href: `tel:+${WHATSAPP_NUMBER}`,
    },
    {
      icon: "✉️",
      iconBg: "#2b7bb9",
      name: "Email",
      value: `${EMAIL} · We reply within 4 hours`,
      href: `mailto:${EMAIL}`,
    },
    {
      icon: "📸",
      iconBg: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
      name: "Instagram DM",
      value: `${INSTAGRAM} · DM us for real-time photos`,
      href: INSTAGRAM_URL,
    },
  ];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    checkin: "",
    checkout: "",
    room: "Any / Let me suggest",
    guests: "2",
    special: "",
  });

  function update(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const msg = enquiryMessage(
      form.name || "Guest",
      form.phone,
      form.checkin,
      form.checkout,
      form.room,
      form.guests,
      form.special
    );
    window.open(buildWhatsAppUrl(msg), "_blank");
  }

  const inputCls =
    "w-full border border-marble rounded-lg px-3.5 py-3 text-sm text-ink bg-white outline-none focus:border-saffron transition-colors";

  return (
    <div className="bg-marble" style={{ padding: "80px 40px" }} id="contact">
      <div
        className="max-w-[1100px] mx-auto grid gap-20 items-start"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {/* Channels */}
        <div>
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-2.5">
            {t("eyebrow")}
          </div>
          <h2
            className="font-display font-bold text-ink mb-3.5 leading-tight"
            style={{ fontSize: "clamp(24px, 4vw, 44px)" }}
          >
            {t("talkTitle")}
          </h2>
          <p className="text-muted text-[15px] leading-[1.7] mb-8">
            {t("talkSubtitle")}
          </p>

          <div className="flex flex-col gap-4">
            {CHANNELS.map((ch) => (
              <a
                key={ch.name}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-xl transition-shadow duration-200 hover:shadow-md"
                style={{ padding: "18px 20px" }}
              >
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xl shrink-0"
                  style={{ background: ch.iconBg }}
                >
                  {ch.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-ink">{ch.name}</div>
                  <div className="text-[13px] text-muted break-words">{ch.value}</div>
                </div>
                <span className="text-stone text-lg">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Enquiry form */}
        <div>
          <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-2.5">
            {t("eyebrow")}
          </div>
          <h3 className="font-display text-[22px] font-bold mb-6">{t("enquiryTitle")}</h3>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wide text-muted uppercase">{t("name")}</label>
                <input
                  type="text"
                  placeholder={t("namePlaceholder")}
                  className={inputCls}
                  value={form.name}
                  onChange={update("name")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wide text-muted uppercase">{t("phone")}</label>
                <input
                  type="tel"
                  placeholder="+91 / +968 ..."
                  className={inputCls}
                  value={form.phone}
                  onChange={update("phone")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wide text-muted uppercase">{tBar("checkIn")}</label>
                <input
                  type="date"
                  className={inputCls}
                  value={form.checkin}
                  onChange={update("checkin")}
                  style={{ colorScheme: "light" }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wide text-muted uppercase">{tBar("checkOut")}</label>
                <input
                  type="date"
                  className={inputCls}
                  value={form.checkout}
                  onChange={update("checkout")}
                  style={{ colorScheme: "light" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wide text-muted uppercase">{tBar("roomType")}</label>
                <select className={inputCls} value={form.room} onChange={update("room")}>
                  <option>{tBar("anyRoom")}</option>
                  <option>Deluxe AC Room</option>
                  <option>Standard AC Room</option>
                  <option>Dormitory Bed</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wide text-muted uppercase">{tBar("guests")}</label>
                <select className={inputCls} value={form.guests} onChange={update("guests")}>
                  <option value="1">{tBar("guest1")}</option>
                  <option value="2">{tBar("guest2")}</option>
                  <option value="3">{tBar("guest3")}</option>
                  <option value="4">{tBar("guest4")}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wide text-muted uppercase">{tBook("special")}</label>
              <textarea
                className={`${inputCls} resize-y`}
                style={{ minHeight: 100 }}
                placeholder={tBook("specialPlaceholder")}
                value={form.special}
                onChange={update("special")}
              />
            </div>

            <p className="text-[11px] text-stone">{t("privacy")}</p>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-saffron hover:bg-saffron-d text-white text-[15px] font-semibold py-4 px-8 rounded-lg transition-all duration-150 hover:-translate-y-px cursor-pointer border-none"
            >
              {t("sendEnquiry")}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 600px) {
          #contact { padding: 60px 20px !important; }
          #contact form .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

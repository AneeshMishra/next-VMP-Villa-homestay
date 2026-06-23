"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/constants";

export default function FaqSection({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = limit ? FAQ_ITEMS.slice(0, limit) : FAQ_ITEMS;

  return (
    <div style={{ padding: "80px 40px" }} id="faq">
      <div className="max-w-[760px] mx-auto">
        <div className="text-[11px] font-bold tracking-[2.5px] uppercase text-saffron mb-2.5">
          Questions Answered
        </div>
        <h2
          className="font-display font-bold text-ink mb-3.5"
          style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
        >
          Frequently Asked <em className="not-italic text-saffron">Questions</em>
        </h2>
        <p className="text-muted text-[15px] leading-[1.7] mb-10">
          Everything you want to know before booking. Still have a question?{" "}
          <a href="/contact" className="text-saffron hover:underline font-medium">
            WhatsApp us
          </a>{" "}
          — we reply fast.
        </p>

        <div className="flex flex-col">
          {items.map((item, i) => (
            <div
              key={i}
              className="border-b border-marble"
            >
              <button
                className="w-full flex items-center justify-between py-5 text-left cursor-pointer bg-transparent border-none font-semibold text-[15px] text-ink hover:text-saffron transition-colors gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{item.q}</span>
                <span
                  className="text-stone text-lg shrink-0 transition-all duration-300"
                  style={{ transform: open === i ? "rotate(180deg)" : "none", color: open === i ? "var(--saffron)" : undefined }}
                >
                  ▾
                </span>
              </button>
              <div className={`faq-answer ${open === i ? "open" : ""} text-sm text-muted leading-[1.8]`}>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          #faq { padding: 60px 20px !important; }
        }
      `}</style>
    </div>
  );
}

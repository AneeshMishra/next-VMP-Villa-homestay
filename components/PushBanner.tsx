"use client";
import { useEffect, useState } from "react";

export default function PushBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("pushDismissed")) return;
    const t = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(t);
  }, []);

  function dismiss() { setVisible(false); localStorage.setItem("pushDismissed", "1"); }

  async function allow() {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") new Notification("VMP Villa 🏡", { body: "You're all set! We'll notify you about deals and travel tips." });
    }
    dismiss();
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-8 z-[998] text-white rounded-2xl p-5 max-w-[300px] animate-slide-up" style={{ background: "var(--ink)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2.5 mb-2.5"><span className="text-[22px]">🔔</span><span className="font-bold text-sm">Stay in the loop</span></div>
      <p className="text-xs text-white/55 leading-relaxed mb-3.5">Get notified about seasonal deals, last-minute availability, and Agra travel tips from Aneesh & Bhavna.</p>
      <div className="flex gap-2">
        <button onClick={allow} className="flex-1 bg-saffron hover:bg-saffron-d text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer border-none">Yes, notify me</button>
        <button onClick={dismiss} className="px-3.5 py-2 text-[13px] text-white/65 rounded-lg cursor-pointer border-none" style={{ background: "rgba(255,255,255,0.08)" }}>Not now</button>
      </div>
    </div>
  );
}

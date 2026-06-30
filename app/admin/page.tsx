"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  total_bookings: number;
  confirmed_bookings: number;
  pending_bookings: number;
  revenue_paise: number;
  today_checkins: number;
  bookings_last_30d: number;
};

function StatCard({ label, value, sub, href, color }: {
  label: string; value: string | number; sub?: string; href?: string; color?: string;
}) {
  const inner = (
    <div className={`bg-white rounded-xl p-5 border border-marble hover:shadow-md transition-shadow ${href ? "cursor-pointer" : ""}`}>
      <div className="text-xs font-bold tracking-widest uppercase text-stone mb-3">{label}</div>
      <div className={`text-3xl font-display font-bold ${color ?? "text-ink"}`}>{value}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const fmtRupees = (paise: number) =>
    `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Overview of VMP Villa activity</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-marble animate-pulse h-24" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Bookings"
            value={stats.total_bookings}
            sub="All time"
            href="/admin/bookings"
          />
          <StatCard
            label="Confirmed"
            value={stats.confirmed_bookings}
            sub="Paid / approved"
            href="/admin/bookings?status=confirmed"
            color="text-leaf"
          />
          <StatCard
            label="Pending"
            value={stats.pending_bookings}
            sub="Awaiting action"
            href="/admin/bookings?status=pending"
            color={stats.pending_bookings > 0 ? "text-saffron" : "text-ink"}
          />
          <StatCard
            label="Revenue"
            value={fmtRupees(stats.revenue_paise)}
            sub="From confirmed bookings"
          />
          <StatCard
            label="Today's Check-ins"
            value={stats.today_checkins}
            sub={new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            color={stats.today_checkins > 0 ? "text-saffron" : "text-ink"}
          />
          <StatCard
            label="Last 30 Days"
            value={stats.bookings_last_30d}
            sub="New bookings"
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 border border-marble text-center text-muted">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-sm">Could not load stats. Check Supabase configuration.</p>
        </div>
      )}

      {/* Quick links */}
      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-ink mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: "/admin/bookings?status=pending", label: "Review Pending Bookings", icon: "🛏️", color: "bg-amber-50 border-amber-200" },
            { href: "/admin/rooms", label: "Update Room Prices", icon: "💰", color: "bg-blue-50 border-blue-200" },
            { href: "/admin/blog", label: "Write a Blog Post", icon: "✍️", color: "bg-green-50 border-green-200" },
            { href: "/admin/settings", label: "Site Settings", icon: "⚙️", color: "bg-purple-50 border-purple-200" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-4 rounded-xl border ${item.color} hover:shadow-sm transition-shadow`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium text-ink">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

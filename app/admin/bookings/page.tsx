"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Booking = {
  id: string;
  room_name: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  amount_paise: number;
  status: "pending" | "confirmed" | "cancelled";
  special_requests: string | null;
  created_at: string;
  razorpay_payment_id: string | null;
};

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtRupees(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function BookingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusFilter = searchParams.get("status") ?? "all";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (statusFilter !== "all") params.set("status", statusFilter);
    fetch(`/api/admin/bookings?${params}`)
      .then((r) => r.json())
      .then((d) => { setBookings(d.bookings ?? []); setTotal(d.total ?? 0); setLoading(false); });
  }, [page, statusFilter]);

  async function updateStatus(id: string, status: string) {
    setUpdating(true);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(false);
    setSelected(null);
    setLoading(true);
    fetch(`/api/admin/bookings?page=${page}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`)
      .then((r) => r.json())
      .then((d) => { setBookings(d.bookings ?? []); setTotal(d.total ?? 0); setLoading(false); });
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Bookings</h1>
          <p className="text-muted text-sm mt-1">{total} total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => { setPage(1); router.push(`/admin/bookings?status=${s}`); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${statusFilter === s ? "bg-saffron text-white" : "bg-white border border-marble text-muted hover:text-ink"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-marble animate-pulse h-20" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-marble text-center text-muted">
          <div className="text-4xl mb-3">🛏️</div>
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-marble p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => setSelected(b)}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold text-ink text-sm">{b.guest_name}</div>
                  <div className="text-xs text-muted mt-0.5">{b.guest_email} · {b.guest_phone}</div>
                  <div className="text-xs text-stone mt-1">
                    {b.room_name} · {fmtDate(b.check_in)} → {fmtDate(b.check_out)} · {b.nights}N · {b.guests} guest{b.guests !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[b.status]}`}>
                    {b.status}
                  </span>
                  <div className="text-sm font-bold text-ink mt-1">{fmtRupees(b.amount_paise)}</div>
                  <div className="text-[11px] text-stone">{fmtDate(b.created_at)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 rounded-lg bg-white border border-marble text-sm disabled:opacity-40">← Prev</button>
          <span className="px-4 py-2 text-sm text-muted">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-lg bg-white border border-marble text-sm disabled:opacity-40">Next →</button>
        </div>
      )}

      {/* Booking detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-display text-lg font-bold text-ink">Booking Detail</h2>
                <button onClick={() => setSelected(null)} className="text-muted text-xl">✕</button>
              </div>

              <div className="space-y-3 text-sm">
                <Row label="Guest" value={selected.guest_name} />
                <Row label="Email" value={selected.guest_email} />
                <Row label="Phone" value={selected.guest_phone} />
                <Row label="Room" value={selected.room_name} />
                <Row label="Check-in" value={fmtDate(selected.check_in)} />
                <Row label="Check-out" value={fmtDate(selected.check_out)} />
                <Row label="Nights" value={String(selected.nights)} />
                <Row label="Guests" value={String(selected.guests)} />
                <Row label="Amount" value={fmtRupees(selected.amount_paise)} />
                <Row label="Payment ID" value={selected.razorpay_payment_id ?? "—"} />
                <Row label="Special Requests" value={selected.special_requests ?? "None"} />
                <Row label="Status" value={selected.status} />
                <Row label="Booked On" value={fmtDate(selected.created_at)} />
                <Row label="ID" value={selected.id} mono />
              </div>

              <div className="flex gap-2 mt-6 flex-wrap">
                {selected.status !== "confirmed" && (
                  <button
                    onClick={() => updateStatus(selected.id, "confirmed")}
                    disabled={updating}
                    className="flex-1 bg-leaf text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60"
                  >
                    ✓ Confirm
                  </button>
                )}
                {selected.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(selected.id, "cancelled")}
                    disabled={updating}
                    className="flex-1 bg-red-500 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60"
                  >
                    ✗ Cancel
                  </button>
                )}
                {selected.status !== "pending" && (
                  <button
                    onClick={() => updateStatus(selected.id, "pending")}
                    disabled={updating}
                    className="flex-1 bg-amber-500 text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60"
                  >
                    ↩ Set Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-4">
      <span className="text-stone w-32 shrink-0">{label}</span>
      <span className={`text-ink font-medium flex-1 ${mono ? "font-mono text-xs break-all" : ""}`}>{value}</span>
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div className="text-muted p-8">Loading…</div>}>
      <BookingsContent />
    </Suspense>
  );
}

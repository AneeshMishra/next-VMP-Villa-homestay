"use client";

import { useEffect, useState, useCallback } from "react";

type Booking = {
  id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  status: string;
  nights: number;
};

type RoomData = {
  id: string;
  name: string;
  totalUnits: number;
  bookings: Booking[];
};

type InventoryData = {
  rooms: RoomData[];
  from: string;
  to: string;
};

// Returns how many units of a room are booked on a given date
function bookedOnDate(room: RoomData, dateStr: string): number {
  return room.bookings.filter((b) => b.check_in <= dateStr && b.check_out > dateStr).length;
}

// Generate array of date strings [from, to)
function dateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const cur = new Date(from);
  const end = new Date(to);
  while (cur < end) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function occupancyColor(booked: number, total: number): string {
  if (total === 0) return "#f4f4f6";
  const pct = booked / total;
  if (booked === 0) return "#ebf5ee"; // leaf-l: fully free
  if (pct < 0.5) return "#fef9c3"; // yellow-100
  if (pct < 1) return "#fed7aa"; // orange-200
  return "#fecaca"; // red-200: fully booked
}

function occupancyLabel(booked: number, total: number): string {
  if (booked === 0) return `${total} free`;
  if (booked >= total) return "Full";
  return `${total - booked} free`;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function UnitsEditor({
  room,
  onSaved,
}: {
  room: RoomData;
  onSaved: (id: string, units: number) => void;
}) {
  const [val, setVal] = useState(room.totalUnits);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    if (val === room.totalUnits) return;
    setSaving(true);
    const res = await fetch("/api/admin/inventory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: room.id, totalUnits: val }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      onSaved(room.id, val);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setVal((v) => Math.max(1, v - 1))}
        className="w-7 h-7 rounded-full border border-marble text-ink hover:bg-marble flex items-center justify-center text-base font-bold transition-colors"
      >
        −
      </button>
      <span className="w-8 text-center font-bold text-ink text-lg tabular-nums">{val}</span>
      <button
        onClick={() => setVal((v) => v + 1)}
        className="w-7 h-7 rounded-full border border-marble text-ink hover:bg-marble flex items-center justify-center text-base font-bold transition-colors"
      >
        +
      </button>
      {val !== room.totalUnits && (
        <button
          onClick={save}
          disabled={saving}
          className="ml-1 text-xs bg-saffron hover:bg-saffron-d text-white font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      )}
      {saved && <span className="text-xs text-leaf font-semibold">✓ Saved</span>}
    </div>
  );
}

export default function InventoryPage() {
  const [data, setData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const today = todayStr();

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/inventory")
      .then((r) => (r.ok ? r.json() : Promise.reject("Failed")))
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Could not load inventory. Check Supabase config."); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleUnitsSaved(id: string, units: number) {
    setData((prev) =>
      prev
        ? { ...prev, rooms: prev.rooms.map((r) => (r.id === id ? { ...r, totalUnits: units } : r)) }
        : prev
    );
  }

  // Summary stats
  const totalUnitsAll = data?.rooms.reduce((s, r) => s + r.totalUnits, 0) ?? 0;
  const bookedTodayAll = data?.rooms.reduce((s, r) => s + bookedOnDate(r, today), 0) ?? 0;
  const availTodayAll = totalUnitsAll - bookedTodayAll;

  const dates = data ? dateRange(data.from, data.to) : [];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Room Inventory</h1>
          <p className="text-muted text-sm mt-1">Manage room units and view 30-day occupancy</p>
        </div>
        <button
          onClick={load}
          className="text-sm text-muted hover:text-ink border border-marble rounded-lg px-4 py-2 transition-colors"
        >
          ↺ Refresh
        </button>
      </div>

      {/* Summary cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Units", value: totalUnitsAll, color: "#e8762b", icon: "🏠" },
            { label: "Booked Today", value: bookedTodayAll, color: "#c4601e", icon: "🛏️" },
            { label: "Available Today", value: availTodayAll, color: "#3a6b4a", icon: "✅" },
            { label: "Room Types", value: data.rooms.length, color: "#2b7bb9", icon: "📋" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-marble p-4">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-display text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-stone mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-marble p-6 h-56 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm mb-4">{error}</div>
      )}

      {/* Per-room cards */}
      {data && (
        <div className="space-y-6">
          {data.rooms.map((room) => {
            const bookedToday = bookedOnDate(room, today);
            const availToday = room.totalUnits - bookedToday;
            const upcomingBookings = room.bookings.filter((b) => b.check_in >= today);

            return (
              <div key={room.id} className="bg-white rounded-xl border border-marble overflow-hidden">
                {/* Room header */}
                <div className="flex items-center justify-between gap-4 p-5 border-b border-marble flex-wrap">
                  <div>
                    <h2 className="font-display text-lg font-bold text-ink">{room.name}</h2>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-stone font-mono">{room.id}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          availToday > 0
                            ? "text-leaf bg-leaf-l"
                            : "text-red-600 bg-red-50"
                        }`}
                      >
                        {availToday > 0 ? `${availToday} available today` : "Fully booked today"}
                      </span>
                    </div>
                  </div>

                  {/* Units editor */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-stone mb-1">
                      Total Units
                    </div>
                    <UnitsEditor room={room} onSaved={handleUnitsSaved} />
                  </div>
                </div>

                {/* 30-day heatmap */}
                <div className="p-5">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-stone mb-3">
                    30-Day Occupancy Calendar
                  </div>
                  <div className="overflow-x-auto pb-2">
                    <div className="flex gap-1 min-w-max">
                      {dates.map((d) => {
                        const booked = bookedOnDate(room, d);
                        const bg = occupancyColor(booked, room.totalUnits);
                        const label = occupancyLabel(booked, room.totalUnits);
                        const dayNum = parseInt(d.split("-")[2]);
                        const isToday = d === today;
                        const isPast = d < today;
                        return (
                          <div
                            key={d}
                            title={`${d}: ${booked}/${room.totalUnits} booked — ${label}`}
                            className={`flex flex-col items-center gap-0.5 ${isPast ? "opacity-40" : ""}`}
                          >
                            <div
                              className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-semibold transition-all ${
                                isToday ? "ring-2 ring-saffron ring-offset-1" : ""
                              }`}
                              style={{
                                background: bg,
                                color: booked > 0 ? "#1a1714" : "#7a6e65",
                              }}
                            >
                              {dayNum}
                            </div>
                            <div className="text-[9px] text-stone leading-none">{label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    {[
                      { color: "#ebf5ee", label: "Free" },
                      { color: "#fef9c3", label: "Partial" },
                      { color: "#fed7aa", label: "Almost full" },
                      { color: "#fecaca", label: "Full" },
                    ].map((l) => (
                      <div key={l.label} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded" style={{ background: l.color }} />
                        <span className="text-xs text-stone">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming bookings */}
                {upcomingBookings.length > 0 && (
                  <div className="border-t border-marble px-5 pb-5 pt-4">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-stone mb-3">
                      Upcoming Bookings ({upcomingBookings.length})
                    </div>
                    <div className="space-y-2">
                      {upcomingBookings.slice(0, 5).map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between gap-3 bg-cream rounded-lg px-4 py-2.5 text-sm flex-wrap"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                b.status === "confirmed" ? "bg-leaf" : "bg-amber-400"
                              }`}
                            />
                            <span className="font-medium text-ink">{b.guest_name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-muted text-xs">
                            <span>
                              {b.check_in} → {b.check_out}
                            </span>
                            <span>{b.nights} night{b.nights > 1 ? "s" : ""}</span>
                            <span
                              className={`font-semibold ${
                                b.status === "confirmed" ? "text-leaf" : "text-amber-600"
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {upcomingBookings.length > 5 && (
                        <p className="text-xs text-muted text-center pt-1">
                          +{upcomingBookings.length - 5} more — view in Bookings
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {upcomingBookings.length === 0 && (
                  <div className="border-t border-marble px-5 py-4 text-center text-sm text-muted">
                    No upcoming bookings in the next 30 days
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SQL migration notice */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm">
        <div className="font-semibold text-amber-800 mb-2">⚠️ One-time SQL migration required</div>
        <p className="text-amber-700 mb-3">
          Run the following in your Supabase SQL Editor to add the <code className="bg-amber-100 px-1 rounded">total_units</code> column to <code className="bg-amber-100 px-1 rounded">room_config</code>:
        </p>
        <pre className="bg-amber-100 rounded-lg p-3 text-xs text-amber-900 overflow-x-auto">{`ALTER TABLE room_config ADD COLUMN IF NOT EXISTS total_units INTEGER NOT NULL DEFAULT 1;

UPDATE room_config SET total_units = CASE
  WHEN id = 'deluxe-ac'    THEN 4
  WHEN id = 'standard-ac'  THEN 2
  WHEN id = '2bhk-flat'    THEN 1
  WHEN id = '1bhk-flat'    THEN 1
  WHEN id = 'dormitory'    THEN 1
  ELSE 1
END;`}</pre>
        <p className="text-amber-600 text-xs mt-2">
          Until this runs, the page uses the default values from <code>booking-config.ts</code>.
        </p>
      </div>
    </div>
  );
}

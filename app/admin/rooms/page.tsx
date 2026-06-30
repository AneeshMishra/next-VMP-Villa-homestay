"use client";

import { useEffect, useState } from "react";

type Room = {
  id: string;
  name: string;
  description: string;
  price_inr: number;
  max_guests: number;
  amenities: string[];
  badge: string | null;
  badge_color: string | null;
  is_active: boolean;
  sort_order: number;
};

function AmenityTag({ tag, onRemove }: { tag: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-cream border border-marble rounded-full text-xs px-2.5 py-1 text-muted">
      {tag}
      <button onClick={onRemove} className="text-stone hover:text-ink ml-0.5">×</button>
    </span>
  );
}

function RoomEditor({ room, onSave }: { room: Room; onSave: (updated: Room) => void }) {
  const [form, setForm] = useState<Room>(room);
  const [newAmenity, setNewAmenity] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(key: keyof Room, val: unknown) {
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/rooms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setSaved(true);
      onSave(updated);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-marble p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">{room.name}</h3>
          <span className="text-xs text-stone font-mono">{room.id}</span>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => set("is_active", e.target.checked)}
            className="w-4 h-4 accent-saffron"
          />
          Active
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="field-label">Room Name</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className="field-input" />
        </div>
        <div>
          <label className="field-label">Price (₹/night)</label>
          <input
            type="number"
            value={form.price_inr}
            onChange={(e) => set("price_inr", parseInt(e.target.value))}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label">Max Guests</label>
          <input
            type="number"
            value={form.max_guests}
            onChange={(e) => set("max_guests", parseInt(e.target.value))}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label">Badge Text (optional)</label>
          <input
            value={form.badge ?? ""}
            onChange={(e) => set("badge", e.target.value || null)}
            placeholder="e.g. Most Popular"
            className="field-input"
          />
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="field-input resize-none"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="field-label">Amenities</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.amenities.map((a, i) => (
            <AmenityTag
              key={i}
              tag={a}
              onRemove={() => set("amenities", form.amenities.filter((_, j) => j !== i))}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newAmenity.trim()) {
                set("amenities", [...form.amenities, newAmenity.trim()]);
                setNewAmenity("");
              }
            }}
            placeholder="Add amenity and press Enter"
            className="field-input flex-1"
          />
          <button
            onClick={() => { if (newAmenity.trim()) { set("amenities", [...form.amenities, newAmenity.trim()]); setNewAmenity(""); } }}
            className="px-4 py-2 bg-marble rounded-lg text-sm text-ink hover:bg-stone/20 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60 transition-colors"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span className="text-sm text-leaf font-medium">✓ Saved</span>}
      </div>

      <style>{`
        .field-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--stone); margin-bottom: 6px; }
        .field-input { width: 100%; border: 1px solid var(--marble); border-radius: 8px; padding: 10px 12px; font-size: 14px; color: var(--ink); outline: none; background: var(--cream); }
        .field-input:focus { border-color: var(--saffron); }
      `}</style>
    </div>
  );
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/rooms")
      .then((r) => (r.ok ? r.json() : Promise.reject("Failed")))
      .then((d) => { setRooms(d); setLoading(false); })
      .catch(() => { setError("Could not load rooms. Check Supabase config."); setLoading(false); });
  }, []);

  function handleSave(updated: Room) {
    setRooms((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Rooms</h1>
        <p className="text-muted text-sm mt-1">Edit room prices, descriptions, and amenities</p>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-xl border border-marble p-6 h-48 animate-pulse" />)}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">{error}</div>
      )}
      <div className="space-y-4">
        {rooms.map((room) => (
          <RoomEditor key={room.id} room={room} onSave={handleSave} />
        ))}
      </div>
    </div>
  );
}

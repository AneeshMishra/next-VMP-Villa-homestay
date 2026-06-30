"use client";

import { useEffect, useState } from "react";

type Setting = {
  key: string;
  value: string;
  label: string;
  description: string | null;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Setting[]) => {
        setSettings(data);
        const v: Record<string, string> = {};
        data.forEach((s) => { v[s.key] = s.value; });
        setValues(v);
        setLoading(false);
      })
      .catch(() => { setError("Could not load settings. Check Supabase config."); setLoading(false); });
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError("");
    const updates = Object.entries(values).map(([key, value]) => ({ key, value }));
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
    else setError("Save failed. Check permissions.");
  }

  if (loading) return <div className="p-8 text-muted text-sm">Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>
          <p className="text-muted text-sm mt-1">Site-wide configuration (Admin+)</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-leaf font-medium">✓ Saved</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            onClick={save}
            disabled={saving}
            className="bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-marble divide-y divide-marble">
        {settings.map((s) => (
          <div key={s.key} className="p-5">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor={s.key} className="block font-semibold text-sm text-ink mb-0.5">
                  {s.label}
                </label>
                {s.description && (
                  <p className="text-xs text-muted">{s.description}</p>
                )}
              </div>
              <input
                id={s.key}
                value={values[s.key] ?? ""}
                onChange={(e) => { setValues({ ...values, [s.key]: e.target.value }); setSaved(false); }}
                className="w-full sm:w-72 border border-marble rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:border-saffron bg-cream"
              />
            </div>
          </div>
        ))}
        {settings.length === 0 && (
          <div className="p-8 text-center text-muted text-sm">No settings found.</div>
        )}
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <strong>Note:</strong> Some settings (like WhatsApp number and host email) are also stored as environment variables in Vercel. After updating here, also update your Vercel environment variables for full consistency.
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

const ROLES = ["staff", "maintainer", "admin", "super_admin"];
const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  maintainer: "Maintainer",
  staff: "Staff",
};
const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  maintainer: "bg-green-100 text-green-800",
  staff: "bg-gray-100 text-gray-700",
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newUser, setNewUser] = useState({ email: "", password: "", full_name: "", role: "staff" });

  const reload = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status === 403 ? "forbidden" : "error")))
      .then((d) => { setUsers(d); setLoading(false); })
      .catch((e) => { setError(e === "forbidden" ? "Access denied. Super Admin only." : "Could not load users."); setLoading(false); });
  };

  useEffect(reload, []);

  async function createUser() {
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      setCreateError("All fields required");
      return;
    }
    setCreating(true);
    setCreateError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const body = await res.json();
    setCreating(false);
    if (!res.ok) { setCreateError(body.error ?? "Failed"); return; }
    setShowCreate(false);
    setNewUser({ email: "", password: "", full_name: "", role: "staff" });
    reload();
  }

  async function updateUser(id: string, patch: Partial<User>) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Users</h1>
          <p className="text-muted text-sm mt-1">Super Admin only — manage admin accounts</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          + Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm mb-4">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-xl border border-marble p-4 h-16 animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-marble overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-marble">
                <th className="text-left px-4 py-3 text-xs font-bold tracking-wider text-stone uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-bold tracking-wider text-stone uppercase hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-bold tracking-wider text-stone uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-bold tracking-wider text-stone uppercase hidden md:table-cell">Joined</th>
                <th className="px-4 py-3 text-xs font-bold tracking-wider text-stone uppercase">Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-marble last:border-0 hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{u.full_name}</td>
                  <td className="px-4 py-3 text-muted hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateUser(u.id, { role: e.target.value })}
                      className={`text-xs font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${ROLE_COLORS[u.role] ?? "bg-gray-100"}`}
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-stone text-xs hidden md:table-cell">{fmtDate(u.created_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={u.is_active}
                      onChange={(e) => updateUser(u.id, { is_active: e.target.checked })}
                      className="w-4 h-4 accent-saffron cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-8 text-center text-muted text-sm">No users found.</div>
          )}
        </div>
      )}

      {/* Role guide */}
      <div className="mt-6 bg-white rounded-xl border border-marble p-5">
        <h3 className="font-semibold text-sm text-ink mb-3">Role Permissions</h3>
        <div className="space-y-2 text-xs text-muted">
          <p><span className="font-bold text-purple-700">Super Admin</span> — full access including user management and data deletion</p>
          <p><span className="font-bold text-blue-700">Admin</span> — bookings, rooms, blog, settings; no user management</p>
          <p><span className="font-bold text-green-700">Maintainer</span> — can edit rooms and blog posts; read-only bookings</p>
          <p><span className="font-bold text-gray-600">Staff</span> — read-only dashboard and bookings</p>
        </div>
      </div>

      {/* Create user modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-ink">Add New User</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted text-xl">✕</button>
            </div>

            {createError && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{createError}</div>}

            <div className="space-y-3">
              <div>
                <label className="field-label">Full Name</label>
                <input value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} className="field-input" placeholder="Aneesh Mishra" />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="field-input" placeholder="user@vmpvilla.in" />
              </div>
              <div>
                <label className="field-label">Password</label>
                <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="field-input" placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="field-label">Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="field-input">
                  {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-lg border border-marble text-sm text-muted hover:text-ink transition-colors">Cancel</button>
              <button onClick={createUser} disabled={creating} className="flex-1 bg-saffron hover:bg-saffron-d text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60 transition-colors">
                {creating ? "Creating…" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .field-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--stone); margin-bottom: 6px; }
        .field-input { width: 100%; border: 1px solid var(--marble); border-radius: 8px; padding: 10px 12px; font-size: 14px; color: var(--ink); outline: none; background: var(--cream); }
        .field-input:focus { border-color: var(--saffron); }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AdminUser } from "@/lib/admin-auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: "🛏️" },
  { href: "/admin/inventory", label: "Inventory", icon: "📦" },
  { href: "/admin/rooms", label: "Rooms", icon: "🏠" },
  { href: "/admin/blog", label: "Blog", icon: "✍️" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  { href: "/admin/users", label: "Users", icon: "👥", minRole: "super_admin" },
];

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  maintainer: "Maintainer",
  staff: "Staff",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMe(data));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const visibleNav = NAV.filter(
    (n) => !n.minRole || me?.role === n.minRole || me?.role === "super_admin"
  );

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-marble">
        <Link href="/" className="font-display text-xl font-black text-ink">
          VMP<span className="text-saffron">Villa</span>
        </Link>
        <div className="text-[11px] text-stone mt-0.5">Admin Panel</div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href, item.exact)
                ? "bg-saffron text-white"
                : "text-muted hover:bg-marble hover:text-ink"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-marble">
        {me && (
          <div className="mb-3 px-2">
            <div className="text-sm font-semibold text-ink truncate">{me.full_name}</div>
            <div className="text-xs text-stone">{ROLE_LABELS[me.role] ?? me.role}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-muted hover:bg-marble hover:text-ink transition-colors"
        >
          🚪 Sign out
        </button>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 mt-1 px-4 py-2.5 rounded-lg text-sm text-muted hover:bg-marble hover:text-ink transition-colors"
        >
          🌐 View website ↗
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f6] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-marble shrink-0 fixed inset-y-0 left-0 z-40">
        <Sidebar />
      </aside>

      {/* Mobile overlay sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-white border-r border-marble flex flex-col">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-ink/40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-4 bg-white border-b border-marble px-4 py-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-ink p-1"
            aria-label="Open menu"
          >
            <span className="block w-5 h-0.5 bg-ink rounded mb-1" />
            <span className="block w-5 h-0.5 bg-ink rounded mb-1" />
            <span className="block w-5 h-0.5 bg-ink rounded" />
          </button>
          <span className="font-display font-bold text-ink">
            VMP<span className="text-saffron">Villa</span>
          </span>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

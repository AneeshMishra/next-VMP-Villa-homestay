import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export type AdminRole = "super_admin" | "admin" | "maintainer" | "staff";

export type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
};

export const ROLE_RANK: Record<AdminRole, number> = {
  super_admin: 4,
  admin: 3,
  maintainer: 2,
  staff: 1,
};

export function hasRole(user: AdminUser, min: AdminRole) {
  return ROLE_RANK[user.role] >= ROLE_RANK[min];
}

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getAdminUser(token?: string): Promise<AdminUser | null> {
  try {
    const t = token ?? (await cookies()).get("admin-token")?.value;
    if (!t) return null;

    const supabase = getAdminSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(t);
    if (error || !user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role, is_active")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.is_active) return null;

    return {
      id: user.id,
      email: user.email!,
      full_name: profile.full_name,
      role: profile.role as AdminRole,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(minRole: AdminRole = "staff"): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (!hasRole(user, minRole)) throw new Error("FORBIDDEN");
  return user;
}

export function adminUnauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function adminForbidden() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}

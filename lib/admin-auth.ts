import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-token";

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

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const token = (await cookies()).get("admin-token")?.value;
    if (!token) return null;

    const payload = verifyAdminToken(token);
    if (!payload) return null;

    return {
      id: (payload.email as string) ?? "admin",
      email: payload.email as string,
      full_name: (payload.name as string) ?? "Admin",
      role: (payload.role as AdminRole) ?? "super_admin",
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

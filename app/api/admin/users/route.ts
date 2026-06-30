import { NextRequest } from "next/server";
import { getAdminUser, adminUnauthorized, adminForbidden, hasRole } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function GET() {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  if (!hasRole(user, "super_admin")) return adminForbidden();

  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, is_active, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return Response.json(data);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  if (!hasRole(user, "super_admin")) return adminForbidden();

  const { email, password, full_name, role } = await req.json();
  if (!email || !password || !full_name || !role) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role },
    });
    if (error) throw error;

    await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name,
      role,
    });

    return Response.json({ id: data.user.id }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  if (!hasRole(user, "super_admin")) return adminForbidden();

  const { id, role, is_active, full_name } = await req.json();
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  try {
    const supabase = getAdminSupabase();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (role) patch.role = role;
    if (typeof is_active === "boolean") patch.is_active = is_active;
    if (full_name) patch.full_name = full_name;

    const { error } = await supabase.from("profiles").update(patch).eq("id", id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

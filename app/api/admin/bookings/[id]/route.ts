import { NextRequest } from "next/server";
import { getAdminUser, adminUnauthorized, adminForbidden, hasRole } from "@/lib/admin-auth";
import { getServerSupabase } from "@/lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  if (!hasRole(user, "admin")) return adminForbidden();

  const { id } = await params;
  const body = await req.json();
  const allowed = ["status", "special_requests"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("bookings")
      .update(update)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return Response.json(data);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  if (!hasRole(user, "super_admin")) return adminForbidden();

  const { id } = await params;
  try {
    const supabase = getServerSupabase();
    await supabase.from("bookings").delete().eq("id", id);
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

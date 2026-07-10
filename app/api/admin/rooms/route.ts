import { NextRequest } from "next/server";
import { getAdminUser, adminUnauthorized, adminForbidden, hasRole } from "@/lib/admin-auth";
import { getServerSupabase } from "@/lib/supabase";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("room_config")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return Response.json(data);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  if (!hasRole(user, "maintainer")) return adminForbidden();

  const body = await req.json();
  const { id, ...update } = body;
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  const allowed = ["name", "description", "price_inr", "max_guests", "amenities", "badge", "badge_color", "is_active", "sort_order", "total_units"];
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in update) patch[key] = update[key];
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("room_config")
      .update(patch)
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

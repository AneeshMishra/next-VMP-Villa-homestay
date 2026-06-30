import { NextRequest } from "next/server";
import { getAdminUser, adminUnauthorized, adminForbidden, hasRole } from "@/lib/admin-auth";
import { getServerSupabase } from "@/lib/supabase";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value, label, description")
      .order("key");
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
  if (!hasRole(user, "admin")) return adminForbidden();

  const updates: { key: string; value: string }[] = await req.json();
  if (!Array.isArray(updates)) {
    return Response.json({ error: "Expected array of {key, value}" }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();
    await Promise.all(
      updates.map(({ key, value }) =>
        supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key)
      )
    );
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { getAdminUser, adminUnauthorized } from "@/lib/admin-auth";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;
  const from = (page - 1) * limit;

  try {
    const supabase = getServerSupabase();
    let query = supabase
      .from("bookings")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return Response.json({ bookings: data, total: count, page, limit });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

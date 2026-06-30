import { getAdminUser, adminUnauthorized } from "@/lib/admin-auth";
import { getServerSupabase } from "@/lib/supabase";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();

  try {
    const supabase = getServerSupabase();
    const today = new Date().toISOString().split("T")[0];

    const [allBookings, todayCheckins, pendingCount] = await Promise.all([
      supabase.from("bookings").select("status, amount_paise, created_at"),
      supabase.from("bookings").select("id").eq("check_in", today),
      supabase.from("bookings").select("id", { count: "exact" }).eq("status", "pending"),
    ]);

    const bookings = allBookings.data ?? [];
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const revenue = confirmed.reduce((sum, b) => sum + b.amount_paise, 0);

    // Last 30 days bookings count
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = bookings.filter(
      (b) => new Date(b.created_at) >= thirtyDaysAgo
    ).length;

    return Response.json({
      total_bookings: bookings.length,
      confirmed_bookings: confirmed.length,
      pending_bookings: pendingCount.count ?? 0,
      revenue_paise: revenue,
      today_checkins: (todayCheckins.data ?? []).length,
      bookings_last_30d: recent,
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

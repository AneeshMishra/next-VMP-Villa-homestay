import { NextRequest } from "next/server";
import { getAdminUser, adminUnauthorized, adminForbidden, hasRole } from "@/lib/admin-auth";
import { getServerSupabase } from "@/lib/supabase";
import { ROOM_UNITS, ROOM_PRICES, ROOM_NAMES } from "@/lib/booking-config";

// GET /api/admin/inventory?from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns per-room bookings and unit counts for the given range
export async function GET(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();

  const { searchParams } = req.nextUrl;
  const from = searchParams.get("from") ?? new Date().toISOString().split("T")[0];
  const toDate = new Date(from);
  toDate.setDate(toDate.getDate() + 30);
  const to = searchParams.get("to") ?? toDate.toISOString().split("T")[0];

  try {
    const supabase = getServerSupabase();

    // Fetch all bookings that overlap with the range
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("id, room_id, check_in, check_out, guest_name, status, nights")
      .in("status", ["pending", "confirmed"])
      .lt("check_in", to)
      .gt("check_out", from)
      .order("check_in");

    if (error) throw error;

    // Try fetching total_units from room_config; fall back to ROOM_UNITS constant
    const { data: roomConfig } = await supabase
      .from("room_config")
      .select("id, total_units");

    const dbUnits: Record<string, number> = {};
    if (roomConfig) {
      for (const r of roomConfig) {
        if (r.total_units) dbUnits[r.id] = r.total_units;
      }
    }

    const roomIds = Object.keys(ROOM_PRICES);
    const rooms = roomIds.map((id) => ({
      id,
      name: ROOM_NAMES[id] ?? id,
      totalUnits: dbUnits[id] ?? ROOM_UNITS[id] ?? 1,
      bookings: (bookings ?? []).filter((b) => b.room_id === id),
    }));

    return Response.json({ rooms, from, to });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/admin/inventory — update total_units for a room
export async function PATCH(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  if (!hasRole(user, "maintainer")) return adminForbidden();

  const { roomId, totalUnits } = await req.json();
  if (!roomId || typeof totalUnits !== "number" || totalUnits < 1) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();
    const { error } = await supabase
      .from("room_config")
      .update({ total_units: totalUnits, updated_at: new Date().toISOString() })
      .eq("id", roomId);
    if (error) throw error;
    return Response.json({ success: true, roomId, totalUnits });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

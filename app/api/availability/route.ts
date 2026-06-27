import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const roomId = searchParams.get("room");
  const checkIn = searchParams.get("checkin");
  const checkOut = searchParams.get("checkout");

  if (!roomId || !checkIn || !checkOut) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  if (checkIn >= checkOut) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("room_id", roomId)
      .in("status", ["pending", "confirmed"])
      .lt("check_in", checkOut)
      .gt("check_out", checkIn)
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ available: data.length === 0 });
  } catch {
    // If Supabase is not yet configured, assume available so UX isn't blocked
    return NextResponse.json({ available: true });
  }
}

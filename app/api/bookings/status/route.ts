import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing booking id" }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("bookings")
      .select("id, room_name, check_in, check_out, nights, guests, guest_name, guest_email, amount_paise, status, created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("status route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

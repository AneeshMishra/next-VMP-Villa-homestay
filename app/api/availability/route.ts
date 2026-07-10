import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { ROOM_UNITS, ROOM_PRICES } from "@/lib/booking-config";

const ALL_ROOM_IDS = Object.keys(ROOM_PRICES);

type RoomAvail = { available: boolean; availableUnits: number; totalUnits: number };

async function getRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string,
  supabase: ReturnType<typeof getServerSupabase>
): Promise<RoomAvail> {
  const totalUnits = ROOM_UNITS[roomId] ?? 1;
  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", roomId)
    .in("status", ["pending", "confirmed"])
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);
  if (error) throw error;
  const booked = data?.length ?? 0;
  const availableUnits = Math.max(0, totalUnits - booked);
  return { available: availableUnits > 0, availableUnits, totalUnits };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const roomId = searchParams.get("room");
  const checkIn = searchParams.get("checkin");
  const checkOut = searchParams.get("checkout");

  if (!checkIn || !checkOut) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  if (checkIn >= checkOut) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();

    // Single room
    if (roomId) {
      const result = await getRoomAvailability(roomId, checkIn, checkOut, supabase);
      return NextResponse.json(result);
    }

    // All rooms batch (no room param)
    const entries = await Promise.all(
      ALL_ROOM_IDS.map(async (id) => [id, await getRoomAvailability(id, checkIn, checkOut, supabase)] as const)
    );
    return NextResponse.json(Object.fromEntries(entries));
  } catch {
    // Supabase not configured — assume all available so UX isn't blocked
    if (roomId) {
      const totalUnits = ROOM_UNITS[roomId] ?? 1;
      return NextResponse.json({ available: true, availableUnits: totalUnits, totalUnits });
    }
    return NextResponse.json(
      Object.fromEntries(
        ALL_ROOM_IDS.map((id) => {
          const totalUnits = ROOM_UNITS[id] ?? 1;
          return [id, { available: true, availableUnits: totalUnits, totalUnits }];
        })
      )
    );
  }
}

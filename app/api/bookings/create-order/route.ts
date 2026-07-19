import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay-server";
import { getServerSupabase } from "@/lib/supabase";
import { ROOM_PRICES, ROOM_NAMES, GST_RATE } from "@/lib/booking-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roomId, roomCount = 1, selections,
      checkIn, checkOut, nights,
      adults, children, guests,
      name, email, phone, special, amount,
    } = body;

    const totalGuests = guests ?? (((adults ?? 0) + (children ?? 0)) || 1);

    // Validate inputs
    if (!roomId || !checkIn || !checkOut || !nights || !name || !email || !phone || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!(roomId in ROOM_PRICES)) {
      return NextResponse.json({ error: "Invalid room type" }, { status: 400 });
    }

    // Server-side re-calculation across selections or single room × count
    type Selection = { roomId: string; qty: number };
    const serverBase =
      selections && Array.isArray(selections) && selections.length > 0
        ? (selections as Selection[]).reduce(
            (sum, sel) => sum + (ROOM_PRICES[sel.roomId as keyof typeof ROOM_PRICES] ?? 0) * (sel.qty || 1) * nights,
            0
          )
        : (ROOM_PRICES[roomId as keyof typeof ROOM_PRICES] ?? 0) * (roomCount || 1) * nights;

    const serverGst = Math.round(serverBase * GST_RATE);
    const expectedAmount = serverBase + serverGst;
    if (Math.abs(expectedAmount - amount) > 1) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    const amountPaise = expectedAmount * 100;

    const roomSummary =
      selections && Array.isArray(selections) && selections.length > 1
        ? (selections as Selection[])
            .map((s) => `${s.qty > 1 ? `${s.qty}× ` : ""}${ROOM_NAMES[s.roomId as keyof typeof ROOM_NAMES] ?? s.roomId}`)
            .join(", ")
        : `${roomCount > 1 ? `${roomCount}× ` : ""}${ROOM_NAMES[roomId as keyof typeof ROOM_NAMES] ?? roomId}`;

    // Create Razorpay order
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `vmp_${Date.now()}`,
    });

    // Save draft booking to Supabase
    const supabase = getServerSupabase();
    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .insert({
        room_id: roomId,
        room_name: roomSummary,
        check_in: checkIn,
        check_out: checkOut,
        nights,
        guests: totalGuests,
        guest_name: name,
        guest_email: email,
        guest_phone: phone,
        special_requests: special || null,
        amount_paise: amountPaise,
        razorpay_order_id: order.id,
        status: "pending",
      })
      .select("id")
      .single();

    if (dbError || !booking) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      bookingId: booking.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("create-order error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

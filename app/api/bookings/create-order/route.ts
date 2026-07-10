import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay-server";
import { getServerSupabase } from "@/lib/supabase";
import { ROOM_PRICES, ROOM_NAMES, GST_RATE } from "@/lib/booking-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, checkIn, checkOut, nights, guests, name, email, phone, special, amount } = body;

    // Validate inputs
    if (!roomId || !checkIn || !checkOut || !nights || !guests || !name || !email || !phone || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!(roomId in ROOM_PRICES)) {
      return NextResponse.json({ error: "Invalid room type" }, { status: 400 });
    }

    // Server-side re-calculation (never trust client amount blindly)
    const serverBase = ROOM_PRICES[roomId] * nights;
    const serverGst = Math.round(serverBase * GST_RATE);
    const expectedAmount = serverBase + serverGst;
    if (Math.abs(expectedAmount - amount) > 1) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    const amountPaise = expectedAmount * 100;

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
        room_name: ROOM_NAMES[roomId],
        check_in: checkIn,
        check_out: checkOut,
        nights,
        guests,
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

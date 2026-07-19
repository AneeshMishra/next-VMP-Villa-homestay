import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { ROOM_PRICES, ROOM_NAMES, GST_RATE } from "@/lib/booking-config";
import { sendGuestConfirmationEmail, sendHostNotificationEmail } from "@/lib/email";
import { sendWhatsAppNotification } from "@/lib/notify-whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roomId, roomCount = 1, selections,
      checkIn, checkOut, nights,
      adults, children, guests,
      name, email, phone, special,
    } = body;

    // Support old `guests` field and new `adults`+`children` fields
    const totalGuests = guests ?? (((adults ?? 0) + (children ?? 0)) || 1);

    if (!roomId || !checkIn || !checkOut || !nights || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!(roomId in ROOM_PRICES)) {
      return NextResponse.json({ error: "Invalid room type" }, { status: 400 });
    }

    // Calculate amount from multi-room selections or single room × count
    type Selection = { roomId: string; qty: number };
    const baseAmount =
      selections && Array.isArray(selections) && selections.length > 0
        ? (selections as Selection[]).reduce(
            (sum, sel) => sum + (ROOM_PRICES[sel.roomId as keyof typeof ROOM_PRICES] ?? 0) * (sel.qty || 1) * nights,
            0
          )
        : (ROOM_PRICES[roomId as keyof typeof ROOM_PRICES] ?? 0) * (roomCount || 1) * nights;

    const gstAmount = Math.round(baseAmount * GST_RATE);
    const totalAmount = baseAmount + gstAmount;
    const amountPaise = totalAmount * 100;

    // Build a readable room summary for the DB / emails
    const roomSummary =
      selections && Array.isArray(selections) && selections.length > 1
        ? (selections as Selection[])
            .map((s) => `${s.qty > 1 ? `${s.qty}× ` : ""}${ROOM_NAMES[s.roomId as keyof typeof ROOM_NAMES] ?? s.roomId}`)
            .join(", ")
        : `${roomCount > 1 ? `${roomCount}× ` : ""}${ROOM_NAMES[roomId as keyof typeof ROOM_NAMES] ?? roomId}`;

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
        status: "pending",
      })
      .select("id")
      .single();

    if (dbError || !booking) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
    }

    const emailData = {
      bookingId: booking.id,
      guestName: name,
      guestEmail: email,
      guestPhone: phone,
      roomName: roomSummary,
      checkIn,
      checkOut,
      nights,
      guests: totalGuests,
      amount: totalAmount,
      specialRequests: special || null,
      razorpayPaymentId: null,
    };

    await Promise.allSettled([
      sendGuestConfirmationEmail(emailData).catch((e) =>
        console.error("Guest email failed:", e)
      ),
      sendHostNotificationEmail(emailData).catch((e) =>
        console.error("Host email failed:", e)
      ),
      sendWhatsAppNotification({
        phone:
          process.env.HOST_WHATSAPP ??
          process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
          "919876543210",
        campaignName: "booking_alert_host",
        userName: "Aneesh",
        templateParams: [
          name,
          roomSummary,
          checkIn,
          checkOut,
          phone,
          String(totalAmount),
        ],
      }).catch((e) => console.error("Host WhatsApp failed:", e)),
    ]);

    return NextResponse.json({ success: true, bookingId: booking.id, payAtProperty: true });
  } catch (err) {
    console.error("request booking error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

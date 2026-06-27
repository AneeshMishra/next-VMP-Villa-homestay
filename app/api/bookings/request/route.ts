import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { ROOM_PRICES, ROOM_NAMES } from "@/lib/booking-config";
import { sendGuestConfirmationEmail, sendHostNotificationEmail } from "@/lib/email";
import { sendWhatsAppNotification } from "@/lib/notify-whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, checkIn, checkOut, nights, guests, name, email, phone, special } = body;

    if (!roomId || !checkIn || !checkOut || !nights || !guests || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!(roomId in ROOM_PRICES)) {
      return NextResponse.json({ error: "Invalid room type" }, { status: 400 });
    }

    const amountPaise = ROOM_PRICES[roomId] * nights * 100;

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
      roomName: ROOM_NAMES[roomId],
      checkIn,
      checkOut,
      nights,
      guests,
      amount: ROOM_PRICES[roomId] * nights,
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
          ROOM_NAMES[roomId],
          checkIn,
          checkOut,
          phone,
          String(ROOM_PRICES[roomId] * nights),
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

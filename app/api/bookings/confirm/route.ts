import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { sendGuestConfirmationEmail, sendHostNotificationEmail } from "@/lib/email";
import { sendWhatsAppNotification } from "@/lib/notify-whatsapp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    // Verify Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Razorpay not configured" }, { status: 500 });
    }
    const expectedSig = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: "Payment signature invalid" }, { status: 400 });
    }

    // Fetch and update booking
    const supabase = getServerSupabase();
    const { data: booking, error: fetchErr } = await supabase
      .from("bookings")
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: "confirmed",
      })
      .eq("id", bookingId)
      .eq("status", "pending")
      .select()
      .single();

    if (fetchErr || !booking) {
      console.error("Booking confirm DB error:", fetchErr);
      return NextResponse.json({ error: "Booking not found or already processed" }, { status: 404 });
    }

    const emailData = {
      bookingId: booking.id,
      guestName: booking.guest_name,
      guestEmail: booking.guest_email,
      guestPhone: booking.guest_phone,
      roomName: booking.room_name,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      nights: booking.nights,
      guests: booking.guests,
      amount: booking.amount_paise / 100,
      specialRequests: booking.special_requests,
      razorpayPaymentId: razorpay_payment_id,
    };

    // Send notifications — failures are non-fatal
    const notifications = await Promise.allSettled([
      sendGuestConfirmationEmail(emailData).catch((e) =>
        console.error("Guest email failed:", e)
      ),
      sendHostNotificationEmail(emailData).catch((e) =>
        console.error("Host email failed:", e)
      ),
      sendWhatsAppNotification({
        phone: booking.guest_phone,
        campaignName: "booking_confirmation_guest",
        userName: booking.guest_name,
        templateParams: [
          booking.guest_name,
          booking.room_name,
          booking.check_in,
          booking.check_out,
          String(booking.nights),
          String(booking.amount_paise / 100),
        ],
      }).catch((e) => console.error("Guest WhatsApp failed:", e)),
      sendWhatsAppNotification({
        phone: process.env.HOST_WHATSAPP ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210",
        campaignName: "booking_alert_host",
        userName: "Aneesh",
        templateParams: [
          booking.guest_name,
          booking.room_name,
          booking.check_in,
          booking.check_out,
          booking.guest_phone,
          String(booking.amount_paise / 100),
        ],
      }).catch((e) => console.error("Host WhatsApp failed:", e)),
    ]);

    const failedCount = notifications.filter((r) => r.status === "rejected").length;
    if (failedCount > 0) {
      console.warn(`${failedCount} notification(s) failed for booking ${bookingId}`);
    }

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err) {
    console.error("confirm error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

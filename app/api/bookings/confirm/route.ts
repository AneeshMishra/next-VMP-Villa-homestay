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

    // Try to update booking in Supabase (non-fatal if unavailable or fallback ID)
    let bookingData: Record<string, unknown> | null = null;
    try {
      const supabase = getServerSupabase();
      const { data, error: fetchErr } = await supabase
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
      if (fetchErr || !data) {
        console.warn("Booking confirm DB error (non-fatal):", fetchErr);
      } else {
        bookingData = data;
      }
    } catch (supaErr) {
      console.warn("Supabase unavailable during confirm (non-fatal):", supaErr);
    }

    // Also extract guest info from the incoming body as fallback
    const {
      guestName, guestEmail, guestPhone,
      roomName, checkIn, checkOut, nights, guests, amount,
    } = body;

    const emailData = {
      bookingId,
      guestName: (bookingData?.guest_name as string) ?? guestName ?? "",
      guestEmail: (bookingData?.guest_email as string) ?? guestEmail ?? "",
      guestPhone: (bookingData?.guest_phone as string) ?? guestPhone ?? "",
      roomName: (bookingData?.room_name as string) ?? roomName ?? "",
      checkIn: (bookingData?.check_in as string) ?? checkIn ?? "",
      checkOut: (bookingData?.check_out as string) ?? checkOut ?? "",
      nights: (bookingData?.nights as number) ?? nights ?? 1,
      guests: (bookingData?.guests as number) ?? guests ?? 1,
      amount: bookingData ? (bookingData.amount_paise as number) / 100 : (amount ?? 0),
      specialRequests: (bookingData?.special_requests as string | null) ?? null,
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
        phone: emailData.guestPhone || (process.env.HOST_WHATSAPP ?? "919876543210"),
        campaignName: "booking_confirmation_guest",
        userName: emailData.guestName,
        templateParams: [
          emailData.guestName,
          emailData.roomName,
          emailData.checkIn,
          emailData.checkOut,
          String(emailData.nights),
          String(emailData.amount),
        ],
      }).catch((e) => console.error("Guest WhatsApp failed:", e)),
      sendWhatsAppNotification({
        phone: process.env.HOST_WHATSAPP ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210",
        campaignName: "booking_alert_host",
        userName: "Aneesh",
        templateParams: [
          emailData.guestName,
          emailData.roomName,
          emailData.checkIn,
          emailData.checkOut,
          emailData.guestPhone,
          String(emailData.amount),
        ],
      }).catch((e) => console.error("Host WhatsApp failed:", e)),
    ]);

    const failedCount = notifications.filter((r) => r.status === "rejected").length;
    if (failedCount > 0) {
      console.warn(`${failedCount} notification(s) failed for booking ${bookingId}`);
    }

    return NextResponse.json({ success: true, bookingId });
  } catch (err) {
    console.error("confirm error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

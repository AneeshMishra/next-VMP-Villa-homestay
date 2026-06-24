import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.");
  }
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export type BookingEmailData = {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  amount: number;
  specialRequests?: string | null;
  razorpayPaymentId: string;
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export async function sendGuestConfirmationEmail(data: BookingEmailData) {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM ?? process.env.SMTP_USER;
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210";

  await transporter.sendMail({
    from: `"VMP Villa Home Stay" <${from}>`,
    to: data.guestEmail,
    subject: `✅ Booking Confirmed — VMP Villa (${fmtDate(data.checkIn)})`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#faf6f0;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="background:#1a1714;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
    <div style="font-size:26px;font-weight:900;color:white;letter-spacing:-0.5px;">VMP<span style="color:#e8762b;">Villa</span></div>
    <div style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:4px;">Home Stay · Tajganj, Agra</div>
    <div style="font-size:44px;margin:20px 0 8px;">✅</div>
    <h1 style="color:white;font-size:22px;margin:0;">Booking Confirmed!</h1>
    <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0 0;">
      Booking ID: <strong style="color:#e8762b;">${data.bookingId.slice(-8).toUpperCase()}</strong>
    </p>
  </div>

  <div style="background:white;border-radius:16px;padding:28px;margin-bottom:16px;border:1px solid #ede8e1;">
    <p style="font-size:15px;color:#1a1714;font-weight:600;margin:0 0 8px;">Hi ${data.guestName}! 👋</p>
    <p style="color:#7a6e65;font-size:14px;line-height:1.7;margin:0 0 20px;">
      We're so excited to welcome you to VMP Villa! Your payment has been received and your room is reserved.
      Aneesh will personally reach out to you before your arrival.
    </p>
    <div style="background:#faf6f0;border-radius:12px;padding:20px;border-left:4px solid #e8762b;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#7a6e65;">Room</td><td style="font-weight:600;color:#1a1714;text-align:right;">${data.roomName}</td></tr>
        <tr><td style="padding:6px 0;color:#7a6e65;">Check-in</td><td style="font-weight:600;color:#1a1714;text-align:right;">${fmtDate(data.checkIn)} (12:00 PM)</td></tr>
        <tr><td style="padding:6px 0;color:#7a6e65;">Check-out</td><td style="font-weight:600;color:#1a1714;text-align:right;">${fmtDate(data.checkOut)} (11:00 AM)</td></tr>
        <tr><td style="padding:6px 0;color:#7a6e65;">Duration</td><td style="font-weight:600;color:#1a1714;text-align:right;">${data.nights} night${data.nights !== 1 ? "s" : ""}</td></tr>
        <tr><td style="padding:6px 0;color:#7a6e65;">Guests</td><td style="font-weight:600;color:#1a1714;text-align:right;">${data.guests}</td></tr>
        ${data.specialRequests ? `<tr><td style="padding:6px 0;color:#7a6e65;vertical-align:top;">Special requests</td><td style="color:#1a1714;text-align:right;">${data.specialRequests}</td></tr>` : ""}
        <tr style="border-top:1px solid #ede8e1;">
          <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#1a1714;">Total Paid</td>
          <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#e8762b;text-align:right;">₹${data.amount.toLocaleString("en-IN")}</td>
        </tr>
      </table>
    </div>
  </div>

  <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;border:1px solid #ede8e1;">
    <p style="font-size:14px;font-weight:600;color:#1a1714;margin:0 0 10px;">Before you arrive 📋</p>
    <ul style="color:#7a6e65;font-size:14px;line-height:1.9;margin:0;padding-left:20px;">
      <li>Carry a valid government-issued photo ID (Aadhaar / Passport)</li>
      <li>Check-in from 12:00 PM — WhatsApp us if you'll arrive early</li>
      <li>Check-out by 11:00 AM</li>
      <li>Free parking available for cars and bikes</li>
    </ul>
  </div>

  <div style="text-align:center;padding:20px 0;">
    <a href="https://wa.me/${waNumber}" style="display:inline-block;background:#25D366;color:white;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;">
      💬 WhatsApp Aneesh
    </a>
    <p style="color:#bfb5aa;font-size:11px;margin:16px 0 0;">Payment ID: ${data.razorpayPaymentId}</p>
  </div>

  <p style="text-align:center;color:#bfb5aa;font-size:11px;">
    VMP Villa Home Stay · Tajganj, Agra, Uttar Pradesh 282001<br>
    © 2025 VMP Villa. All rights reserved.
  </p>
</div>
</body>
</html>`,
  });
}

export async function sendHostNotificationEmail(data: BookingEmailData) {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM ?? process.env.SMTP_USER;
  const hostEmail = process.env.HOST_EMAIL ?? "hello@vmpvilla.in";

  await transporter.sendMail({
    from: `"VMP Villa Bookings" <${from}>`,
    to: hostEmail,
    subject: `🎉 New Booking: ${data.guestName} · ${data.roomName} · ${fmtDate(data.checkIn)}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
<div style="max-width:520px;margin:0 auto;background:white;border-radius:12px;padding:28px;border:2px solid #e8762b;">
  <h2 style="color:#1a1714;margin:0 0 20px;font-size:18px;">🎉 New Confirmed Booking</h2>
  <table style="width:100%;font-size:14px;border-collapse:collapse;">
    <tr><td style="padding:6px 0;color:#666;width:130px;">Guest</td><td style="font-weight:600;color:#1a1714;">${data.guestName}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Email</td><td><a href="mailto:${data.guestEmail}" style="color:#e8762b;">${data.guestEmail}</a></td></tr>
    <tr><td style="padding:6px 0;color:#666;">Phone</td><td>${data.guestPhone}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Room</td><td style="font-weight:600;">${data.roomName}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Check-in</td><td>${fmtDate(data.checkIn)}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Check-out</td><td>${fmtDate(data.checkOut)}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Nights</td><td>${data.nights}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Guests</td><td>${data.guests}</td></tr>
    ${data.specialRequests ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top;">Special Req.</td><td style="color:#b9402b;">${data.specialRequests}</td></tr>` : ""}
    <tr style="border-top:2px solid #e8762b;">
      <td style="padding:14px 0 6px;font-weight:700;font-size:16px;">Amount Paid</td>
      <td style="padding:14px 0 6px;font-weight:700;color:#e8762b;font-size:18px;">₹${data.amount.toLocaleString("en-IN")}</td>
    </tr>
    <tr><td style="color:#999;font-size:12px;">Payment ID</td><td style="color:#999;font-size:12px;">${data.razorpayPaymentId}</td></tr>
    <tr><td style="color:#999;font-size:12px;">Booking ID</td><td style="color:#999;font-size:12px;">${data.bookingId}</td></tr>
  </table>
  <a href="https://wa.me/${data.guestPhone.replace(/\D/g, "")}"
     style="display:block;margin-top:20px;background:#25D366;color:white;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
    💬 WhatsApp Guest
  </a>
</div>
</body>
</html>`,
  });
}

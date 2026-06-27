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
  razorpayPaymentId: string | null;
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
  const subject = data.razorpayPaymentId
    ? `Booking Confirmed — ${data.roomName} at VMP Villa`
    : `Booking Request Received — ${data.roomName} at VMP Villa`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "VMP Villa <hello@vmpvilla.in>",
    to: data.guestEmail,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1a1714">
        <div style="background:#1a1714;padding:32px 24px;text-align:center">
          <h1 style="color:#e8762b;font-size:24px;margin:0">VMP Villa Home Stay</h1>
          <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:13px">Tajganj, Agra, Uttar Pradesh 282001</p>
        </div>
        <div style="padding:32px 24px;background:#faf6f0">
          <h2 style="margin:0 0 8px">${data.razorpayPaymentId ? "Your booking is confirmed" : "Booking request received"} — see you in Agra, ${data.guestName.split(" ")[0]}!</h2>
          <p style="color:#7a6e65;margin:0 0 24px">${data.razorpayPaymentId ? "Payment received. Your room is reserved." : "Aneesh will confirm your booking within 2 hours via WhatsApp or email."}</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            ${[
              ["Booking ID", data.bookingId.slice(-8).toUpperCase()],
              ["Room", data.roomName],
              ["Check-in", `${fmtDate(data.checkIn)} · 12:00 PM`],
              ["Check-out", `${fmtDate(data.checkOut)} · 11:00 AM`],
              ["Nights", String(data.nights)],
              ["Guests", String(data.guests)],
              [data.razorpayPaymentId ? "Total Paid" : "Amount Due at Property", `₹${data.amount.toLocaleString("en-IN")}`],
              ...(data.razorpayPaymentId ? [["Payment ID", data.razorpayPaymentId]] : []),
              ...(data.specialRequests ? [["Special Requests", data.specialRequests]] : []),
            ]
              .map(
                ([label, value]) =>
                  `<tr><td style="padding:8px 0;color:#7a6e65;border-bottom:1px solid #ede8e1;width:40%">${label}</td><td style="padding:8px 0;font-weight:600;border-bottom:1px solid #ede8e1">${value}</td></tr>`
              )
              .join("")}
          </table>
        </div>
        <div style="padding:20px 24px;background:#1a1714;text-align:center">
          <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0">Questions? WhatsApp Aneesh · hello@vmpvilla.in</p>
        </div>
      </div>`,
  });
}

export async function sendHostNotificationEmail(data: BookingEmailData) {
  const transporter = getTransporter();
  const subject = data.razorpayPaymentId
    ? `New Booking: ${data.roomName} — ${data.guestName}`
    : `New Booking Request (Pay at Property): ${data.roomName} — ${data.guestName}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "VMP Villa <hello@vmpvilla.in>",
    to: process.env.HOST_EMAIL ?? "hello@vmpvilla.in",
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1a1714">
        <h2>${data.razorpayPaymentId ? "New booking" : "New booking request (pay at property)"} — ${data.guestName}</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${[
            ["Room", data.roomName],
            ["Check-in", fmtDate(data.checkIn)],
            ["Check-out", fmtDate(data.checkOut)],
            ["Nights", String(data.nights)],
            ["Guests", String(data.guests)],
            ["Guest Name", data.guestName],
            ["Guest Email", data.guestEmail],
            ["Guest Phone", data.guestPhone],
            [data.razorpayPaymentId ? "Amount Paid" : "Amount (at property)", `₹${data.amount.toLocaleString("en-IN")}`],
            ...(data.razorpayPaymentId ? [["Razorpay ID", data.razorpayPaymentId]] : []),
            ...(data.specialRequests ? [["Special Requests", data.specialRequests]] : []),
          ]
            .map(
              ([label, value]) =>
                `<tr><td style="padding:6px 8px;background:#faf6f0;border:1px solid #ede8e1;width:35%">${label}</td><td style="padding:6px 8px;border:1px solid #ede8e1;font-weight:600">${value}</td></tr>`
            )
            .join("")}
        </table>
        <p style="margin-top:16px;font-size:13px;color:#7a6e65">Booking ID: ${data.bookingId}</p>
      </div>`,
  });
}

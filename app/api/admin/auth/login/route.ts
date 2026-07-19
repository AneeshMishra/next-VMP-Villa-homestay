import { NextRequest } from "next/server";
import { signAdminToken } from "@/lib/admin-token";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    const adminEmail    = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return Response.json(
        { error: "Admin credentials not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD on Vercel." },
        { status: 500 }
      );
    }

    if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signAdminToken({
      email: adminEmail,
      role: "super_admin",
      name: process.env.ADMIN_NAME ?? "Aneesh",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8 hours
    });

    const res = Response.json({ role: "super_admin", full_name: process.env.ADMIN_NAME ?? "Aneesh" });
    const headers = new Headers(res.headers);
    headers.set(
      "Set-Cookie",
      `admin-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}`
    );
    return new Response(res.body, { status: 200, headers });
  } catch (e) {
    console.error("Admin login error:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

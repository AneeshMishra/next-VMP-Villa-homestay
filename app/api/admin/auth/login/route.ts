import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();
    if (!access_token) {
      return Response.json({ error: "Missing token" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    if (error || !user) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role, is_active")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.is_active) {
      return Response.json({ error: "Account not authorised" }, { status: 403 });
    }

    const res = Response.json({ role: profile.role, full_name: profile.full_name });
    const headers = new Headers(res.headers);
    const maxAge = 60 * 60 * 8; // 8 hours
    headers.set(
      "Set-Cookie",
      `admin-token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`
    );
    return new Response(res.body, { status: 200, headers });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

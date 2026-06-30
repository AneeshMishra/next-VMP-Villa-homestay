import { NextRequest } from "next/server";
import { getAdminUser, adminUnauthorized, adminForbidden, hasRole } from "@/lib/admin-auth";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();

  const { id } = await params;
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return Response.json(data);
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  if (!hasRole(user, "maintainer")) return adminForbidden();

  const { id } = await params;
  const body = await req.json();
  const allowed = ["title", "slug", "excerpt", "content", "cover_image", "status"];
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }
  if (body.status === "published" && !body.published_at) {
    patch.published_at = new Date().toISOString();
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return Response.json(data);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  if (!hasRole(user, "admin")) return adminForbidden();

  const { id } = await params;
  try {
    const supabase = getServerSupabase();
    await supabase.from("blog_posts").delete().eq("id", id);
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

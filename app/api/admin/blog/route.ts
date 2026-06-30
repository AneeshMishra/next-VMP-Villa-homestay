import { NextRequest } from "next/server";
import { getAdminUser, adminUnauthorized, adminForbidden, hasRole } from "@/lib/admin-auth";
import { getServerSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    const supabase = getServerSupabase();
    let query = supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, status, published_at, created_at, author_id")
      .order("created_at", { ascending: false });

    if (status && status !== "all") query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;
    return Response.json(data);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) return adminUnauthorized();
  if (!hasRole(user, "maintainer")) return adminForbidden();

  const body = await req.json();
  const { title, slug, excerpt, content, cover_image, status } = body;
  if (!title || !slug || !content) {
    return Response.json({ error: "title, slug, content required" }, { status: 400 });
  }

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title,
        slug,
        excerpt: excerpt ?? "",
        content,
        cover_image: cover_image ?? null,
        author_id: user.id,
        status: status ?? "draft",
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();
    if (error) throw error;
    return Response.json(data, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}

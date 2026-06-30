"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  status: "draft" | "published";
};

export default function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject("Not found")))
      .then((d) => { setPost(d); setLoading(false); })
      .catch(() => { setError("Post not found"); setLoading(false); });
  }, [id]);

  function set(key: keyof Post, val: string) {
    setPost((p) => p ? { ...p, [key]: val } : p);
    setSaved(false);
  }

  async function save() {
    if (!post) return;
    setSaving(true);
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        cover_image: post.cover_image,
        status: post.status,
      }),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
    else setError("Save failed");
  }

  if (loading) return <div className="p-8 text-muted text-sm">Loading…</div>;
  if (error || !post) return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">{error || "Post not found"}</div>
      <button onClick={() => router.back()} className="mt-4 text-sm text-muted hover:text-ink">← Back</button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={() => router.back()} className="text-muted hover:text-ink text-sm">← Back</button>
        <h1 className="font-display text-2xl font-bold text-ink flex-1">Edit Post</h1>
        <select
          value={post.status}
          onChange={(e) => set("status", e.target.value)}
          className="border border-marble rounded-lg px-3 py-2 text-sm text-ink bg-white outline-none focus:border-saffron"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button
          onClick={save}
          disabled={saving}
          className="bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60 transition-colors"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-sm text-leaf font-medium">✓ Saved</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-marble p-5">
            <label className="field-label">Title</label>
            <input value={post.title} onChange={(e) => set("title", e.target.value)} className="field-input mb-4" />
            <label className="field-label">Content (Markdown)</label>
            <textarea
              value={post.content}
              onChange={(e) => set("content", e.target.value)}
              rows={20}
              className="field-input resize-none font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-marble p-5">
            <label className="field-label">Slug</label>
            <input value={post.slug} onChange={(e) => set("slug", e.target.value)} className="field-input mb-4 font-mono text-xs" />
            <label className="field-label">Excerpt</label>
            <textarea
              value={post.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              className="field-input resize-none mb-4"
            />
            <label className="field-label">Cover Image URL</label>
            <input
              value={post.cover_image ?? ""}
              onChange={(e) => set("cover_image", e.target.value || "")}
              className="field-input"
              placeholder="https://..."
            />
            {post.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover_image} alt="Cover" className="mt-3 w-full h-32 object-cover rounded-lg" />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .field-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--stone); margin-bottom: 6px; }
        .field-input { width: 100%; border: 1px solid var(--marble); border-radius: 8px; padding: 10px 12px; font-size: 14px; color: var(--ink); outline: none; background: var(--cream); }
        .field-input:focus { border-color: var(--saffron); }
      `}</style>
    </div>
  );
}

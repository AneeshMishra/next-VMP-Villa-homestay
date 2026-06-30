"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", slug: "", excerpt: "", content: "", status: "draft" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const reload = (s = filter) => {
    setLoading(true);
    fetch(`/api/admin/blog?status=${s}`)
      .then((r) => r.json())
      .then((d) => { setPosts(Array.isArray(d) ? d : []); setLoading(false); });
  };

  useEffect(() => { reload(filter); }, [filter]);

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    reload();
  }

  async function toggleStatus(post: Post) {
    const status = post.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    reload();
  }

  async function createPost() {
    if (!newPost.title || !newPost.slug || !newPost.content) {
      setSaveError("Title, slug, and content are required");
      return;
    }
    setSaving(true);
    setSaveError("");
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) { setSaveError(body.error ?? "Failed"); return; }
    setShowNew(false);
    setNewPost({ title: "", slug: "", excerpt: "", content: "", status: "draft" });
    reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Blog</h1>
          <p className="text-muted text-sm mt-1">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="bg-saffron hover:bg-saffron-d text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          + New Post
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "published", "draft"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === s ? "bg-saffron text-white" : "bg-white border border-marble text-muted hover:text-ink"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-xl border border-marble p-4 h-20 animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-marble text-center text-muted">
          <div className="text-4xl mb-3">✍️</div>
          <p>No posts yet. Write your first blog post!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-marble p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink text-sm truncate">{post.title}</div>
                  <div className="text-xs text-stone mt-0.5 font-mono">/blog/{post.slug}</div>
                  {post.excerpt && <div className="text-xs text-muted mt-1 line-clamp-2">{post.excerpt}</div>}
                  <div className="text-xs text-stone mt-2">
                    Created {fmtDate(post.created_at)}
                    {post.published_at ? ` · Published ${fmtDate(post.published_at)}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${post.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {post.status}
                  </span>
                  <button
                    onClick={() => toggleStatus(post)}
                    className="text-xs px-3 py-1.5 border border-marble rounded-lg text-muted hover:text-ink transition-colors"
                  >
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="text-xs px-3 py-1.5 border border-marble rounded-lg text-muted hover:text-ink transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New post modal */}
      {showNew && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowNew(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-bold text-ink">New Blog Post</h2>
                <button onClick={() => setShowNew(false)} className="text-muted text-xl">✕</button>
              </div>

              {saveError && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{saveError}</div>}

              <div className="space-y-3">
                <div>
                  <label className="field-label">Title *</label>
                  <input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value, slug: autoSlug(e.target.value) })}
                    className="field-input"
                    placeholder="Best Things to Do Near the Taj Mahal"
                  />
                </div>
                <div>
                  <label className="field-label">Slug *</label>
                  <input
                    value={newPost.slug}
                    onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
                    className="field-input font-mono text-xs"
                    placeholder="best-things-to-do-near-taj-mahal"
                  />
                </div>
                <div>
                  <label className="field-label">Excerpt</label>
                  <input
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                    className="field-input"
                    placeholder="Short description shown in listings"
                  />
                </div>
                <div>
                  <label className="field-label">Content * (Markdown supported)</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={10}
                    className="field-input resize-none font-mono text-xs"
                    placeholder="# Your post content here..."
                  />
                </div>
                <div>
                  <label className="field-label">Status</label>
                  <select
                    value={newPost.status}
                    onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
                    className="field-input"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-lg border border-marble text-sm text-muted hover:text-ink transition-colors">Cancel</button>
                <button onClick={createPost} disabled={saving} className="flex-1 bg-saffron hover:bg-saffron-d text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60 transition-colors">
                  {saving ? "Saving…" : "Create Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .field-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--stone); margin-bottom: 6px; }
        .field-input { width: 100%; border: 1px solid var(--marble); border-radius: 8px; padding: 10px 12px; font-size: 14px; color: var(--ink); outline: none; background: var(--cream); }
        .field-input:focus { border-color: var(--saffron); }
      `}</style>
    </div>
  );
}

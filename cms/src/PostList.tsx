import { useEffect, useState } from 'react';
import PostEditor, { type PostData } from './PostEditor';
import type { PostType } from './App';

export default function PostList({ type, onChanged }: { type: PostType; onChanged: () => void }) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [editing, setEditing] = useState<PostData | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const label = type === 'blogs' ? 'blog' : 'case study';

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/posts/${type}`);
    setPosts(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    setEditing(null);
    setCreating(false);
    load();
  }, [type]);

  const handleDelete = async (post: PostData) => {
    if (!window.confirm(`Delete the ${label} "${post.meta.title || post.slug}"? It will disappear from the site on the next publish.`)) return;
    await fetch(`/api/posts/${type}/${post.slug}`, { method: 'DELETE' });
    onChanged();
    load();
  };

  if (editing || creating) {
    return (
      <PostEditor
        type={type}
        initial={editing}
        onClose={() => {
          setEditing(null);
          setCreating(false);
          onChanged();
          load();
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
          {type === 'blogs' ? 'Blog posts' : 'Case studies'}
        </h2>
        <button
          onClick={() => setCreating(true)}
          className="bg-[#3F618C] text-black px-4 py-2 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-colors"
        >
          + New {label}
        </button>
      </div>

      <div className="bg-black border border-neutral-800">
        {loading ? (
          <p className="p-8 text-sm text-neutral-500">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="p-8 text-sm text-neutral-500">Nothing here yet — create your first {label}.</p>
        ) : (
          posts.map((post, i) => (
            <div
              key={post.slug}
              className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors group cursor-pointer ${i !== posts.length - 1 ? 'border-b border-neutral-800/60' : ''}`}
              onClick={() => setEditing(post)}
            >
              <div>
                <p className="font-bold group-hover:text-[#3F618C] transition-colors">
                  {post.meta.title || post.slug}
                  {post.meta.status === 'draft' && (
                    <span className="ml-2 text-[10px] font-bold text-amber-400 border border-amber-400/40 rounded-sm px-1.5 py-0.5 align-middle">DRAFT</span>
                  )}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  /{type === 'blogs' ? 'blog' : 'project'}/{post.slug} · {post.meta.date || 'no date'}
                </p>
              </div>
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase tracking-wider">
                <span className="text-neutral-400">Edit</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post);
                  }}
                  className="text-neutral-500 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

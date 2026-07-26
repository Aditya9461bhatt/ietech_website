import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PostType } from './App';

export interface PostData {
  slug: string;
  meta: Record<string, string>;
  content: string;
}

const todayDisplay = () =>
  new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

async function uploadImage(file: File): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'x-filename': encodeURIComponent(file.name) },
    body: file,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.path;
}

const inputCls =
  'w-full bg-black border border-neutral-800 text-white p-2 text-sm focus:border-[#3F618C] outline-none disabled:opacity-50';
const labelCls = 'block text-[10px] uppercase tracking-widest text-neutral-500 mb-1';

export default function PostEditor({
  type,
  initial,
  onClose,
}: {
  type: PostType;
  initial: PostData | null;
  onClose: () => void;
}) {
  const isNew = !initial;
  const label = type === 'blogs' ? 'Blog Post' : 'Case Study';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [slug, setSlug] = useState(initial?.slug || '');
  const [meta, setMeta] = useState<Record<string, string>>(
    initial?.meta || {
      title: '',
      date: todayDisplay(),
      ...(type === 'blogs'
        ? { category: 'Engineering', excerpt: '' }
        : { client: '', industry: '', shortDescription: '' }),
      authorName: 'IETECH Technical Team',
      authorEmail: 'hello@ietech.com',
      image: '',
      status: 'draft',
    },
  );
  const [content, setContent] = useState(
    initial?.content ??
      (type === 'blogs'
        ? '## Introduction\n\nWrite your blog here...'
        : '# The Problem\n\nDescribe the problem here...\n\n# The Solution\n\nDescribe the solution here...'),
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const setMetaField = (key: string, value: string) => {
    setMeta((m) => ({ ...m, [key]: value }));
    setDirty(true);
  };

  const insertAtCursor = (prefix: string, suffix = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: start, selectionEnd: end } = ta;
    const next = content.slice(0, start) + prefix + content.slice(start, end) + suffix + content.slice(end);
    setContent(next);
    setDirty(true);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleInlineImage = async (file: File) => {
    try {
      setMessage('Uploading image…');
      const path = await uploadImage(file);
      insertAtCursor(`\n![${file.name.replace(/\.[^.]+$/, '')}](${path})\n`);
      setMessage('');
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleCoverImage = async (file: File) => {
    try {
      setMessage('Uploading cover…');
      setMetaField('image', await uploadImage(file));
      setMessage('');
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleSave = async () => {
    const cleanSlug = slug.trim();
    if (!cleanSlug) return setMessage('Error: a URL slug is required.');
    if (!meta.title?.trim()) return setMessage('Error: a title is required.');
    setSaving(true);
    setMessage('');
    const dateISO = Number.isNaN(Date.parse(meta.date))
      ? new Date().toISOString()
      : new Date(Date.parse(meta.date)).toISOString();
    const res = await fetch(`/api/posts/${type}/${cleanSlug}${isNew ? '?new=1' : ''}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ meta: { ...meta, dateISO }, content }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setMessage(`Error: ${data.error}`);
    setDirty(false);
    setMessage('Saved. Remember: it goes live only when you Publish.');
  };

  const handleBack = () => {
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) return;
    onClose();
  };

  const metaFields: { key: string; label: string }[] =
    type === 'blogs'
      ? [
          { key: 'category', label: 'Category' },
          { key: 'excerpt', label: 'Excerpt (short summary)' },
        ]
      : [
          { key: 'client', label: 'Client name' },
          { key: 'industry', label: 'Industry' },
          { key: 'shortDescription', label: 'Short description (grid view)' },
        ];

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="text-neutral-500 hover:text-white transition-colors text-sm">
            ← Back
          </button>
          <h2 className="text-sm font-bold uppercase tracking-widest">
            {isNew ? 'New' : 'Edit'} {label}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {message && (
            <span className={`text-xs ${message.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>{message}</span>
          )}
          <select
            value={meta.status || 'published'}
            onChange={(e) => setMetaField('status', e.target.value)}
            className="bg-black border border-neutral-800 text-xs p-2 outline-none focus:border-[#3F618C]"
          >
            <option value="draft">Draft (hidden from site)</option>
            <option value="published">Published (on next publish)</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#3F618C] text-black px-6 py-2 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Editor column */}
        <div className="w-1/2 overflow-y-auto bg-[#111] border border-neutral-800 p-5">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className={labelCls}>URL slug</label>
              <input value={slug} onChange={(e) => { setSlug(e.target.value); setDirty(true); }} disabled={!isNew} placeholder="e.g. tirupati-erp" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input value={meta.date || ''} onChange={(e) => setMetaField('date', e.target.value)} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Title</label>
              <input value={meta.title || ''} onChange={(e) => setMetaField('title', e.target.value)} className={inputCls} />
            </div>
            {metaFields.map((f) => (
              <div key={f.key} className={f.key === 'excerpt' || f.key === 'shortDescription' ? 'col-span-2' : ''}>
                <label className={labelCls}>{f.label}</label>
                <input value={meta[f.key] || ''} onChange={(e) => setMetaField(f.key, e.target.value)} className={inputCls} />
              </div>
            ))}
            <div>
              <label className={labelCls}>Author name</label>
              <input value={meta.authorName || ''} onChange={(e) => setMetaField('authorName', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Author email</label>
              <input value={meta.authorEmail || ''} onChange={(e) => setMetaField('authorEmail', e.target.value)} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Cover image</label>
              <div className="flex gap-2">
                <input value={meta.image || ''} onChange={(e) => setMetaField('image', e.target.value)} placeholder="/uploads/… or https://…" className={inputCls} />
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="shrink-0 border border-neutral-700 px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
                >
                  Upload
                </button>
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleCoverImage(e.target.files[0])} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <label className={labelCls + ' mb-0'}>Content (markdown)</label>
            <div className="flex gap-1 bg-black border border-neutral-800 p-1">
              <button title="Bold" onClick={() => insertAtCursor('**', '**')} className="px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-white/10">B</button>
              <button title="Heading 2" onClick={() => insertAtCursor('\n## ')} className="px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-white/10">H2</button>
              <button title="Heading 3" onClick={() => insertAtCursor('\n### ')} className="px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-white/10">H3</button>
              <button title="Bullet list" onClick={() => insertAtCursor('\n- ')} className="px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-white/10">•</button>
              <button title="Table" onClick={() => insertAtCursor('\n| Column | Column |\n| --- | --- |\n| Cell | Cell |\n')} className="px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-white/10">⊞</button>
              <button title="Link" onClick={() => insertAtCursor('[', '](https://)')} className="px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-white/10">🔗</button>
              <button title="Insert image" onClick={() => imageInputRef.current?.click()} className="px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-white/10">🖼</button>
              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleInlineImage(e.target.files[0])} />
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => { setContent(e.target.value); setDirty(true); }}
            onPaste={(e) => {
              const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith('image/'));
              if (file) { e.preventDefault(); handleInlineImage(file); }
            }}
            className="w-full min-h-[420px] bg-black border border-neutral-800 text-neutral-300 p-4 text-sm font-mono focus:border-[#3F618C] outline-none resize-y"
          />
          <p className="text-[10px] text-neutral-600 mt-1">Tip: paste an image straight into the text to upload and insert it.</p>
        </div>

        {/* Preview column */}
        <div className="w-1/2 overflow-y-auto bg-black border border-neutral-800 p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3F618C] text-center mb-4">
            {(type === 'blogs' ? meta.category : 'Case study') || ''} preview
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white mb-4 text-center leading-tight">
            {meta.title || 'Untitled'}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase text-neutral-400 mb-8">
            <span>{meta.date}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600" />
            <span>By {meta.authorName}</span>
          </div>
          {meta.image && (
            <div className="w-full aspect-[21/9] bg-neutral-900 border border-neutral-800 mb-10 overflow-hidden">
              <img src={meta.image} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-p:text-neutral-300 prose-li:text-neutral-300 prose-strong:text-white prose-a:text-blue-400 prose-img:border prose-img:border-neutral-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

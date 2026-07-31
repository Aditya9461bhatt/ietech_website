import { useEffect, useState } from 'react';

interface Card {
  slug: string;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  note: string;
  pageExists: boolean;
  original: boolean;
  generated: boolean;
}

const EMPTY: Card = {
  slug: '', fullName: '', title: '', phone: '', email: '', note: '',
  pageExists: false, original: false, generated: false,
};

const inputCls =
  'w-full bg-black border border-neutral-800 text-white p-2 text-sm focus:border-[#3F618C] outline-none';
const labelCls = 'block text-[10px] uppercase tracking-widest text-neutral-500 mb-1';

const slugify = (name: string) =>
  name.trim().toLowerCase().split(/\s+/)[0]?.replace(/[^a-z0-9]/g, '') || '';

function CopyLink({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="flex items-center justify-between gap-3 w-full border border-neutral-800 px-3 py-2 text-left hover:border-[#3F618C] transition-colors group"
      title="Click to copy"
    >
      <span>
        <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-600">{label}</span>
        <span className="text-xs text-neutral-300 break-all">{url}</span>
      </span>
      <span className={`text-[9px] font-bold uppercase tracking-widest shrink-0 ${copied ? 'text-emerald-400' : 'text-neutral-600 group-hover:text-[#7fa3cf]'}`}>
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
}

/**
 * Create and manage digital business cards: each card is a vCard file, a
 * profile page under /businesscard/<slug>, and /businesscard_<slug> download
 * shortcuts. Founder cards from the original card app are edit-only.
 */
export default function CardsPanel({ onChanged }: { onChanged: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [draft, setDraft] = useState<Card>(EMPTY);
  const [isNew, setIsNew] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => fetch('/api/cards').then((r) => r.json()).then(setCards);
  useEffect(() => { load(); }, []);

  const pick = (c: Card) => {
    setDraft(c);
    setIsNew(false);
    setSlugTouched(true);
    setMessage('');
  };

  const startNew = () => {
    setDraft(EMPTY);
    setIsNew(true);
    setSlugTouched(false);
    setMessage('');
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    const res = await fetch(`/api/cards/${draft.slug}${isNew ? '?new=1' : ''}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setMessage(`Error: ${data.error || 'could not save.'}`);
    setIsNew(false);
    setMessage('Saved. Remember: the live site updates only when you Publish.');
    load();
    onChanged();
  };

  const remove = async () => {
    if (!window.confirm(`Delete the card for ${draft.fullName || draft.slug}? The links stop working after the next publish.`)) return;
    const res = await fetch(`/api/cards/${draft.slug}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return setMessage(`Error: ${data.error || 'could not delete.'}`);
    startNew();
    load();
    onChanged();
  };

  const set = (patch: Partial<Card>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <div className="flex gap-4 items-start">
      {/* Card list */}
      <aside className="w-72 shrink-0 bg-black border border-neutral-800 p-3">
        <button
          onClick={startNew}
          className="w-full mb-3 bg-[#3F618C] text-black px-4 py-2 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
        >
          + New card
        </button>
        {cards.map((c) => (
          <button
            key={c.slug}
            onClick={() => pick(c)}
            className={`w-full text-left px-3 py-2 mb-1 transition-colors ${
              !isNew && draft.slug === c.slug ? 'bg-[#3F618C]/15' : 'hover:bg-white/5'
            }`}
          >
            <span className="block text-sm text-white">{c.fullName || c.slug}</span>
            <span className="block text-[10px] uppercase tracking-widest text-neutral-500">
              {c.title || '—'}{c.original ? ' · founder' : ''}
            </span>
          </button>
        ))}
        {cards.length === 0 && <p className="text-xs text-neutral-600 px-1">No cards yet.</p>}
      </aside>

      {/* Editor */}
      <div className="flex-1 min-w-0 bg-[#111] border border-neutral-800 p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold">
            {isNew ? 'New business card' : `Editing: ${draft.fullName || draft.slug}`}
          </p>
          <div className="flex items-center gap-3">
            {message && (
              <span className={`text-xs ${message.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>{message}</span>
            )}
            {!isNew && !draft.original && (
              <button onClick={remove} className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 px-2 py-2">
                Delete
              </button>
            )}
            <button
              onClick={save}
              disabled={saving || !draft.slug || !draft.fullName}
              className="bg-[#3F618C] text-black px-5 py-2 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-5">
          <div className="mb-3">
            <label className={labelCls}>Full name</label>
            <input
              className={inputCls}
              value={draft.fullName}
              onChange={(e) => set({ fullName: e.target.value, ...(isNew && !slugTouched ? { slug: slugify(e.target.value) } : {}) })}
              placeholder="Priya Shah"
            />
          </div>
          <div className="mb-3">
            <label className={labelCls}>Link name (slug) — becomes /businesscard/…</label>
            <input
              className={inputCls + (isNew ? '' : ' opacity-50')}
              value={draft.slug}
              disabled={!isNew}
              onChange={(e) => { setSlugTouched(true); set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }); }}
              placeholder="priya"
            />
          </div>
          <div className="mb-3">
            <label className={labelCls}>Job title</label>
            <input className={inputCls} value={draft.title} onChange={(e) => set({ title: e.target.value })} placeholder="Implementation Engineer" />
          </div>
          <div className="mb-3">
            <label className={labelCls}>Phone (with country code)</label>
            <input className={inputCls} value={draft.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+91 98765 43210" />
          </div>
          <div className="mb-3">
            <label className={labelCls}>Email</label>
            <input className={inputCls} value={draft.email} onChange={(e) => set({ email: e.target.value })} placeholder="name@ietech.ai" />
          </div>
          <div className="mb-3">
            <label className={labelCls}>Short note (shown on the card &amp; saved in contacts)</label>
            <input className={inputCls} value={draft.note} onChange={(e) => set({ note: e.target.value })} placeholder="Focus: ERP rollouts and training." />
          </div>
        </div>

        {draft.original && (
          <p className="text-[11px] text-amber-400/80 mt-1">
            Founder card — saving updates the downloadable contact file; the profile page from the original card app is kept as-is.
          </p>
        )}

        {!isNew && draft.slug && (
          <div className="mt-6 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Shareable links (live after Publish)</p>
            <CopyLink label="Profile page" url={`https://ietech.ai/businesscard/${draft.slug}`} />
            <CopyLink label="Contact download" url={`https://ietech.ai/businesscard_${draft.slug}`} />
          </div>
        )}
      </div>
    </div>
  );
}

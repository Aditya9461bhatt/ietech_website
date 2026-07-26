import { useEffect, useState } from 'react';

type Json = string | number | boolean | Json[] | { [key: string]: Json };

const SECTION_LABELS: Record<string, string> = {
  hero: 'Homepage hero',
  contacts: 'Contact people (used in navbar, contact modal & footer)',
  products: 'Products showcase',
  navbar: 'Navigation menus',
  contactModal: 'Contact popup',
  footer: 'Footer',
  blogsPage: 'Blogs page',
  projectsPage: 'Case studies page',
};

const prettify = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());

const inputCls =
  'w-full bg-black border border-neutral-800 text-white p-2 text-sm focus:border-[#3F618C] outline-none';
const labelCls = 'block text-[10px] uppercase tracking-widest text-neutral-500 mb-1';

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const long = value.length > 70 || value.includes('\n');
  return (
    <div className="mb-3">
      <label className={labelCls}>{label}</label>
      {long ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={Math.min(6, Math.max(2, Math.ceil(value.length / 80)))} className={inputCls + ' resize-y'} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </div>
  );
}

/** Recursively renders any JSON structure as labeled fields. */
function Node({ value, label, onChange }: { value: Json; label: string; onChange: (v: Json) => void }) {
  if (typeof value === 'string') {
    return <Field label={label} value={value} onChange={onChange} />;
  }
  if (Array.isArray(value)) {
    return (
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">{label}</p>
        <div className="space-y-3 pl-3 border-l border-neutral-800">
          {value.map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-neutral-800/60 p-3">
              <Node
                value={item}
                label={`${label} ${i + 1}`}
                onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (value && typeof value === 'object') {
    return (
      <div>
        {Object.entries(value).map(([k, v]) => (
          <Node key={k} value={v} label={prettify(k)} onChange={(nv) => onChange({ ...value, [k]: nv })} />
        ))}
      </div>
    );
  }
  return null; // numbers/booleans not used in site.json
}

export default function SiteTextEditor({ onChanged }: { onChanged: () => void }) {
  const [data, setData] = useState<Record<string, Json> | null>(null);
  const [open, setOpen] = useState<string | null>('hero');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/site').then((r) => r.json()).then(setData);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  if (!data) return <p className="text-sm text-neutral-500">Loading…</p>;

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/site', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (!res.ok) return setMessage('Error: could not save.');
    setDirty(false);
    setMessage('Saved. Goes live on next Publish.');
    onChanged();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">All website text</h2>
        <div className="flex items-center gap-4">
          {message && (
            <span className={`text-xs ${message.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>{message}</span>
          )}
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="bg-[#3F618C] text-black px-6 py-2 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(data).map(([section, value]) => (
          <div key={section} className="bg-black border border-neutral-800">
            <button
              onClick={() => setOpen(open === section ? null : section)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="text-sm font-bold">{SECTION_LABELS[section] || prettify(section)}</span>
              <span className="text-neutral-500 text-xs">{open === section ? '▲' : '▼'}</span>
            </button>
            {open === section && (
              <div className="p-4 pt-0 border-t border-neutral-800/60">
                <Node
                  value={value}
                  label={prettify(section)}
                  onChange={(v) => {
                    setData({ ...data, [section]: v });
                    setDirty(true);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

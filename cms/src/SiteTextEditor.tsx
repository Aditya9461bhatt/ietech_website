import { useEffect, useRef, useState } from 'react';

type Json = string | number | boolean | Json[] | { [key: string]: Json };

/**
 * Sections are organised the way the website is organised — you pick the page
 * area you want to change, edit plain fields, and watch the real site update
 * in the preview pane after you save.
 */
const SECTIONS: { path: string; label: string; group: string; route: string }[] = [
  { path: 'hero', label: 'Hero (top banner)', group: 'Homepage', route: '/' },
  { path: 'products', label: 'Products showcase', group: 'Homepage', route: '/' },
  { path: 'navbar', label: 'Navigation menus', group: 'Homepage', route: '/' },
  { path: 'useCases.manufacturing', label: 'Manufacturing ERP page', group: 'Product pages', route: '/use-cases/manufacturing' },
  { path: 'useCases.restaurant', label: 'Restaurant ERP page', group: 'Product pages', route: '/use-cases/restaurant' },
  { path: 'pages.history', label: 'How We Started', group: 'About pages', route: '/about/history' },
  { path: 'pages.team', label: 'Founders & Team', group: 'About pages', route: '/about/team' },
  { path: 'pages.training', label: 'Staff Training', group: 'About pages', route: '/services/training' },
  { path: 'blogsPage', label: 'Blog page header', group: 'Listing pages', route: '/blogs' },
  { path: 'projectsPage', label: 'Case-studies page header', group: 'Listing pages', route: '/projects' },
  { path: 'contacts', label: 'Contact people', group: 'Contact & footer', route: '/' },
  { path: 'contactModal', label: 'Contact popup', group: 'Contact & footer', route: '/' },
  { path: 'footer', label: 'Footer', group: 'Contact & footer', route: '/' },
];

const PREVIEW_ORIGIN = 'http://localhost:5173';

const prettify = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

const getPath = (obj: Json, path: string): Json | undefined =>
  path.split('.').reduce<Json | undefined>((v, k) => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, Json>)[k] : undefined), obj);

function setPath(obj: Json, path: string, value: Json): Json {
  const [head, ...rest] = path.split('.');
  const base = obj && typeof obj === 'object' && !Array.isArray(obj) ? (obj as Record<string, Json>) : {};
  return { ...base, [head]: rest.length ? setPath(base[head] ?? {}, rest.join('.'), value) : value };
}

const inputCls =
  'w-full bg-black border border-neutral-800 text-white p-2 text-sm focus:border-[#3F618C] outline-none';
const labelCls = 'block text-[10px] uppercase tracking-widest text-neutral-500 mb-1';

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const long = value.length > 70 || value.includes('\n');
  return (
    <div className="mb-3">
      <label className={labelCls}>{label}</label>
      {long ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(10, Math.max(2, Math.ceil(value.length / 70)))}
          className={inputCls + ' resize-y'}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </div>
  );
}

function Node({ value, label, onChange }: { value: Json; label: string; onChange: (v: Json) => void }) {
  if (typeof value === 'string') return <Field label={label} value={value} onChange={onChange} />;
  if (Array.isArray(value)) {
    return (
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">{label}</p>
        <div className="space-y-3 pl-3 border-l border-neutral-800">
          {value.map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-neutral-800/60 p-3">
              <Node value={item} label={`${label} ${i + 1}`} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
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
          <Node key={k} value={v} label={prettify(k)} onChange={(nv) => onChange({ ...(value as Record<string, Json>), [k]: nv })} />
        ))}
      </div>
    );
  }
  return null;
}

export default function SiteTextEditor({ onChanged }: { onChanged: () => void }) {
  const [data, setData] = useState<Record<string, Json> | null>(null);
  const [active, setActive] = useState(SECTIONS[0]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUp, setPreviewUp] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch('/api/site').then((r) => r.json()).then(setData);
    // The preview server is started by the CMS automatically; give it a moment.
    const check = () =>
      fetch(PREVIEW_ORIGIN + '/', { mode: 'no-cors' }).then(() => setPreviewUp(true)).catch(() => setPreviewUp(false));
    check();
    const t = setInterval(check, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  if (!data) return <p className="text-sm text-neutral-500">Loading…</p>;

  const sections = SECTIONS.filter((s) => getPath(data, s.path) !== undefined);
  const groups = [...new Set(sections.map((s) => s.group))];
  const activeValue = getPath(data, active.path);

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
    setMessage('Saved — preview updates in a moment.');
    onChanged();
    // Vite hot-reloads the preview by itself; bump the iframe as a fallback.
    setTimeout(() => setPreviewKey((k) => k + 1), 900);
  };

  const pick = (s: (typeof SECTIONS)[number]) => {
    setActive(s);
    setMessage('');
  };

  return (
    <div className="flex gap-4" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Section list, organised like the website */}
      <aside className="w-60 shrink-0 overflow-y-auto bg-black border border-neutral-800 p-3">
        {groups.map((g) => (
          <div key={g} className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1 px-2">{g}</p>
            {sections.filter((s) => s.group === g).map((s) => (
              <button
                key={s.path}
                onClick={() => pick(s)}
                className={`w-full text-left px-2 py-1.5 text-sm transition-colors ${
                  active.path === s.path ? 'bg-[#3F618C]/15 text-[#7fa3cf]' : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Fields */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#111] border border-neutral-800">
        <div className="flex items-center justify-between gap-4 p-3 border-b border-neutral-800 sticky top-0 bg-[#111] z-10">
          <p className="text-sm font-bold truncate">{active.label}</p>
          <div className="flex items-center gap-3 shrink-0">
            {message && (
              <span className={`text-xs ${message.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>{message}</span>
            )}
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="bg-[#3F618C] text-black px-5 py-2 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-40"
            >
              {saving ? 'Saving…' : dirty ? 'Save' : 'Saved'}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {activeValue !== undefined && (
            <Node
              value={activeValue}
              label={active.label}
              onChange={(v) => {
                setData(setPath(data, active.path, v) as Record<string, Json>);
                setDirty(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Live preview of the real site */}
      <div className="w-[42%] shrink-0 flex flex-col bg-black border border-neutral-800">
        <div className="flex items-center justify-between p-2 border-b border-neutral-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-1">
            Live preview · {active.route}
          </p>
          <button
            onClick={() => setPreviewKey((k) => k + 1)}
            className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white px-2 py-1"
          >
            ⟳ Reload
          </button>
        </div>
        {previewUp ? (
          <iframe
            key={`${active.route}-${previewKey}`}
            ref={iframeRef}
            src={PREVIEW_ORIGIN + active.route}
            title="Site preview"
            className="flex-1 w-full bg-white"
          />
        ) : (
          <div className="flex-1 grid place-items-center text-center p-6">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Preview server is starting…
              <br />
              If this doesn't go away, run <code className="text-neutral-300">npm run dev</code> in the project folder.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

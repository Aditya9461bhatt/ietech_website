import { useEffect, useState } from 'react';
import PostList from './PostList';
import SiteTextEditor from './SiteTextEditor';
import PublishPanel from './PublishPanel';

export type PostType = 'blogs' | 'case-studies';
type Tab = 'blogs' | 'case-studies' | 'site' | 'publish';

const TABS: { key: Tab; label: string }[] = [
  { key: 'blogs', label: 'Blogs' },
  { key: 'case-studies', label: 'Case Studies' },
  { key: 'site', label: 'Site Text' },
  { key: 'publish', label: 'Publish' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('blogs');
  const [pendingChanges, setPendingChanges] = useState(0);

  const refreshStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setPendingChanges(data.changes.length);
    } catch {
      setPendingChanges(0);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, [tab]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <header className="bg-black border-b border-neutral-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold uppercase tracking-wider">
            i.e tech CMS <span className="text-[10px] font-bold text-emerald-400 border border-emerald-400/40 rounded-sm px-1.5 py-0.5 ml-2 align-middle">LOCAL ONLY</span>
          </h1>
          <nav className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
                  tab === t.key
                    ? 'border-[#3F618C] text-[#3F618C] bg-[#3F618C]/10'
                    : 'border-transparent text-neutral-500 hover:text-white'
                }`}
              >
                {t.label}
                {t.key === 'publish' && pendingChanges > 0 && (
                  <span className="ml-2 rounded-full bg-amber-500/20 text-amber-400 px-1.5 py-0.5 text-[10px]">{pendingChanges}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <p className="text-[11px] text-neutral-500">
          Saving edits files on this computer — the live site changes only via <span className="text-neutral-300">Publish</span>.
        </p>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {tab === 'blogs' && <PostList type="blogs" onChanged={refreshStatus} />}
        {tab === 'case-studies' && <PostList type="case-studies" onChanged={refreshStatus} />}
        {tab === 'site' && <SiteTextEditor onChanged={refreshStatus} />}
        {tab === 'publish' && <PublishPanel />}
      </main>
    </div>
  );
}

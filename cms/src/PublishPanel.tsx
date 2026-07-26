import { useEffect, useRef, useState } from 'react';

export default function PublishPanel() {
  const [changes, setChanges] = useState<string[]>([]);
  const [lastCommit, setLastCommit] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [log, setLog] = useState('');
  const logRef = useRef<HTMLPreElement>(null);

  const refresh = async () => {
    const res = await fetch('/api/status');
    const data = await res.json();
    setChanges(data.changes);
    setLastCommit(data.lastCommit);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  const publish = async () => {
    if (
      !window.confirm(
        'Publish to the LIVE website?\n\nThis commits your content changes, rebuilds the site, and deploys it. Visitors will see the new version within about 5 minutes.',
      )
    )
      return;
    setPublishing(true);
    setLog('');
    try {
      const res = await fetch('/api/publish', { method: 'POST' });
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setLog((l) => l + decoder.decode(value));
      }
    } catch (err) {
      setLog((l) => l + `\n✖ ${String(err)}`);
    }
    setPublishing(false);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Publish to live</h2>
        <button
          onClick={publish}
          disabled={publishing}
          className="bg-emerald-600 text-white px-6 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-emerald-500 transition-colors disabled:opacity-50"
        >
          {publishing ? 'Publishing…' : '🚀 Publish to Live'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-black border border-neutral-800 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">
            Unpublished content changes
          </p>
          {changes.length === 0 ? (
            <p className="text-xs text-neutral-500">None — the repo matches your last save.</p>
          ) : (
            <ul className="text-xs font-mono text-amber-400/90 space-y-1">
              {changes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}
          <p className="text-[10px] text-neutral-600 mt-3">
            Note: saved edits count as "published" only after a successful Publish run — this list shows what
            hasn't been committed yet.
          </p>
        </div>
        <div className="bg-black border border-neutral-800 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Last content commit</p>
          <p className="text-xs font-mono text-neutral-400">{lastCommit || '—'}</p>
          <p className="text-[10px] text-neutral-600 mt-3">
            Publishing commits + pushes content, rebuilds the static site, and deploys it to Cloud Run. Cloudflare
            serves the new version within ~5 minutes.
          </p>
        </div>
      </div>

      {(publishing || log) && (
        <pre
          ref={logRef}
          className="bg-black border border-neutral-800 p-4 text-[11px] font-mono text-neutral-300 h-80 overflow-y-auto whitespace-pre-wrap"
        >
          {log || 'Starting…'}
        </pre>
      )}
    </div>
  );
}

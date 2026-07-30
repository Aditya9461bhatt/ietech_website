import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Seo from './Seo';
import { useContact } from '../context/ContactContext';

const CRATES = [
  'JOB CARDS',
  'HEAT NO. 97234',
  'ERP MODULES',
  'GRN-26-0041',
  'CASE STUDIES',
  'DISPATCH NOTES',
  'BLOG POSTS',
  'BIN 14-C',
];

function Crate({ label, missing = false }: { label: string; missing?: boolean }) {
  return (
    <div
      className={`shrink-0 flex flex-col items-center justify-center w-28 h-20 border text-center px-2 select-none ${
        missing
          ? 'border-red-500/60 text-red-500 dark:text-red-400 rotate-[4deg] translate-y-1'
          : 'border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400'
      }`}
    >
      <span className="block w-full border-b border-dashed border-current opacity-40 mb-2" />
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] leading-tight">
        {missing ? '404 — MISSING' : label}
      </span>
      <span className="block w-full border-t border-dashed border-current opacity-40 mt-2" />
    </div>
  );
}

/** The page you wanted, presented as a failed ERP stock check. */
export default function NotFound() {
  const { pathname } = useLocation();
  const { openContact } = useContact();
  const itemCode = pathname.length > 42 ? `${pathname.slice(0, 39)}…` : pathname;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen text-neutral-900 dark:text-white font-sans antialiased transition-colors duration-300 flex flex-col">
      <Seo title="Page Not Found" path="/404" noindex />
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#3F618C] mb-6"
        >
          Stores &amp; Inventory · Stock Check
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-9xl font-black tracking-tighter leading-none bg-gradient-to-br from-[#4A72A4] to-[#2C4566] bg-clip-text text-transparent"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-2xl md:text-4xl font-bold tracking-tight"
        >
          This page isn&rsquo;t in our inventory.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-4 max-w-md text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed"
        >
          We checked every rack, every bin, and the drawer nobody labels. Whatever you were looking
          for was never issued a job card — let&rsquo;s route you back through goods&#8209;inward.
        </motion.p>

        {/* Failed stock-check slip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 w-full max-w-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-white/[0.03] text-left font-mono text-xs"
        >
          <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="font-bold uppercase tracking-[0.2em] text-[10px] text-neutral-500">
              Stock enquiry
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500 dark:text-red-400">
              <span className="h-1.5 w-1.5 bg-current animate-pulse" />
              Not found
            </span>
          </div>
          <dl className="px-4 py-3 space-y-1.5 text-neutral-700 dark:text-neutral-300">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-400 dark:text-neutral-500">ITEM CODE</dt>
              <dd className="truncate">{itemCode}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-400 dark:text-neutral-500">WAREHOUSE</dt>
              <dd>ietech.ai / WEB</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-400 dark:text-neutral-500">QTY ON HAND</dt>
              <dd>0</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-400 dark:text-neutral-500">BIN LOCATION</dt>
              <dd>—</dd>
            </div>
          </dl>
        </motion.div>

        {/* Conveyor belt of things we do stock */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 w-full max-w-2xl overflow-hidden"
          aria-hidden
        >
          <motion.div
            className="flex gap-5 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
          >
            {[...CRATES, '__missing__', ...CRATES, '__missing__'].map((label, i) =>
              label === '__missing__' ? (
                <Crate key={i} label="" missing />
              ) : (
                <Crate key={i} label={label} />
              ),
            )}
          </motion.div>
          <div className="mt-1 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Back to the floor
          </Link>
          <Link
            to="/projects"
            className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 font-bold uppercase tracking-widest text-xs hover:border-[#3F618C] hover:text-[#3F618C] transition-colors"
          >
            Case studies
          </Link>
          <Link
            to="/blogs"
            className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 font-bold uppercase tracking-widest text-xs hover:border-[#3F618C] hover:text-[#3F618C] transition-colors"
          >
            Read the blog
          </Link>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          type="button"
          onClick={openContact}
          className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500 hover:text-[#3F618C] dark:hover:text-[#7fa3cf] transition-colors"
        >
          Think this part should exist? Report it to us →
        </motion.button>
      </main>

      <Footer onContactOpen={openContact} />
    </div>
  );
}

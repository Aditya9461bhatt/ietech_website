import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from './Navbar';
import Footer from './Footer';

export interface ContentPageData {
  heading: string;
  intro: string;
  body: string;
}

/** Shared layout for the simple editorial pages (history, team, training). */
export default function ContentPage({
  page,
  onContactOpen,
}: {
  page: ContentPageData;
  onContactOpen: () => void;
}) {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen text-neutral-900 dark:text-white font-sans antialiased relative">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-[#f5f5f5]">
            {page.heading}
          </h1>
          <div className="h-1 w-20 bg-[#3F618C] mb-8" />
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed mb-6">
            {page.intro}
          </p>
          <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-a:text-[#3F618C]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.body}</ReactMarkdown>
          </div>
        </div>
      </main>
      <Footer onContactOpen={onContactOpen} />
    </div>
  );
}

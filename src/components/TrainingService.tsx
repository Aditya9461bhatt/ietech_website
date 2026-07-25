import Navbar from './Navbar';
import Footer from './Footer';

export default function TrainingService({ onContactOpen }: { onContactOpen: () => void }) {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen text-neutral-900 dark:text-white font-sans antialiased relative">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-[#f5f5f5]">
            Staff Training
          </h1>
          <div className="h-1 w-20 bg-[#3F618C] mb-8" />
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed mb-6">
            We have a dedicated team that specializes in training your staff and clientele to ensure smooth operations and maximum utilization of our ERP solutions.
          </p>
          <div className="prose prose-invert prose-lg max-w-none text-neutral-700 dark:text-neutral-300">
            <p>
              [Training programs and details will be added here by the CMS or content team]
            </p>
          </div>
        </div>
      </main>
      <Footer onContactOpen={onContactOpen} />
    </div>
  );
}

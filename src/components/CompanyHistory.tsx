import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function CompanyHistory({ onContactOpen }: { onContactOpen: () => void }) {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen text-neutral-900 dark:text-white font-sans antialiased relative">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-neutral-900 dark:text-[#f5f5f5]">
            How We Started
          </h1>
          <div className="h-1 w-20 bg-[#3F618C] mb-8" />
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed mb-6">
            Our journey began with a simple mission: to bridge the gap between traditional industrial operations and the intelligent, data-driven future of Industry 4.0.
          </p>
          <div className="prose prose-invert prose-lg max-w-none text-neutral-700 dark:text-neutral-300">
            <p>
              [History and Operations content will be added here by the CMS or content team]
            </p>
          </div>
        </div>
      </main>
      <Footer onContactOpen={onContactOpen} />
    </div>
  );
}

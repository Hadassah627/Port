import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useCollectionQuery } from '../hooks/useCollectionQuery';
import type { GalleryItem } from '../types/content';
import { PageShell } from '../components/common/PageShell';
import { SectionHeading } from '../components/common/SectionHeading';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { truncate, resolveDirectImageUrl } from '../utils/format';


export const GalleryPage = () => {
  const { data, isLoading } = useCollectionQuery<(GalleryItem & { id: string })>(['gallery'], 'gallery');
  const [filter, setFilter] = useState('All');

  const sampleGallery: (GalleryItem & { id: string })[] = [
    {
      id: 'g1',
      title: 'Field Campaign 2023',
      category: 'Field',
      coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      driveLink: 'https://drive.google.com',
      description: 'Field data collection and equipment configuration with the research team.',
      year: 2023,
    },
  ];

  const effectiveData = data ?? (import.meta.env.DEV ? sampleGallery : []);

  const categories = useMemo(() => ['All', ...new Set((effectiveData ?? []).map((item) => item.category).filter(Boolean))], [effectiveData]);
  const filteredItems = useMemo(() => (effectiveData ?? []).filter((item) => filter === 'All' || item.category === filter), [effectiveData, filter]);

  if (isLoading && !import.meta.env.DEV) {
    return <PageShell><LoadingState message="Loading gallery..." /></PageShell>;
  }

  return (
    <PageShell className="space-y-8 py-10">
      <SectionHeading eyebrow="Gallery" title="Professional Gallery" description="Explore media albums and folders documenting conference presentations, lab activities, and milestones." />

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button key={category} type="button" onClick={() => setFilter(category)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === category ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-white/80'}`}>
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <motion.div 
            key={item.id} 
            whileHover={{ y: -4 }} 
            className="flex flex-col justify-between overflow-hidden rounded-[1.8rem] border border-white/10 bg-white shadow-soft dark:bg-ink-900 group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="rounded-xl bg-gold-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-300">
                  {item.category}
                </span>
                <span className="text-xs font-semibold text-ink-500 dark:text-white/40">
                  {item.year}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-ink-900 dark:text-white group-hover:text-gold-500 transition-colors duration-300 leading-snug">
                {item.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-ink-600 dark:text-white/60">
                {truncate(item.description, 120)}
              </p>
            </div>
            <div className="px-6 pb-6 pt-0">
              <button 
                type="button" 
                onClick={() => window.open(item.driveLink, '_blank')} 
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-900 px-4 py-3.5 text-xs font-bold text-white hover:bg-ink-800 transition dark:bg-white dark:text-ink-950 dark:hover:bg-white/90 shadow-sm"
              >
                <span>View Album</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {!filteredItems.length ? <EmptyState title="No gallery items match the filter" description="Create albums in the admin dashboard to populate the gallery." /> : null}
    </PageShell>
  );
};

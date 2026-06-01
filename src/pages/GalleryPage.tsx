import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiZoomIn } from 'react-icons/fi';
import { useCollectionQuery } from '../hooks/useCollectionQuery';
import type { GalleryItem } from '../types/content';
import { PageShell } from '../components/common/PageShell';
import { SectionHeading } from '../components/common/SectionHeading';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export const GalleryPage = () => {
  const { data, isLoading } = useCollectionQuery<(GalleryItem & { id: string })>(['gallery'], 'gallery');
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<(GalleryItem & { id: string }) | null>(null);
  const sampleGallery: (GalleryItem & { id: string })[] = [
    { id: 'g1', title: 'Field Campaign 2023', category: 'Field', imageUrl: '', description: 'Field data collection', year: 2023 },
  ];

  const effectiveData = data ?? (import.meta.env.DEV ? sampleGallery : []);

  const categories = useMemo(() => ['All', ...new Set((effectiveData ?? []).map((item) => item.category).filter(Boolean))], [effectiveData]);
  const filteredItems = useMemo(() => (effectiveData ?? []).filter((item) => filter === 'All' || item.category === filter), [effectiveData, filter]);

  if (isLoading && !import.meta.env.DEV) {
    return <PageShell><LoadingState message="Loading gallery..." /></PageShell>;
  }

  return (
    <PageShell className="space-y-8 py-10">
      <SectionHeading eyebrow="Gallery" title="Professional Gallery" description="A responsive, category-filtered gallery with modal zoom." />

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button key={category} type="button" onClick={() => setFilter(category)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === category ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-white/80'}`}>
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <motion.button key={item.id} whileHover={{ y: -4 }} type="button" onClick={() => setSelectedItem(item)} className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-white text-left shadow-soft dark:bg-ink-900">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-64 items-center justify-center bg-ink-100 text-sm text-ink-500 dark:bg-white/5 dark:text-white/55">Upload gallery image</div>}
            <div className="flex items-center justify-between gap-3 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gold-500 dark:text-gold-300">{item.category}</p>
                <h3 className="mt-2 font-heading text-lg font-semibold text-ink-900 dark:text-white">{item.title}</h3>
              </div>
              <FiZoomIn className="text-xl text-gold-600 dark:text-gold-300" />
            </div>
          </motion.button>
        ))}
      </div>

      {!filteredItems.length ? <EmptyState title="No gallery items match the filter" description="Upload images and categories in the admin dashboard to populate the gallery." /> : null}

      <Modal open={Boolean(selectedItem)} title={selectedItem?.title || 'Gallery image'} onClose={() => setSelectedItem(null)}>
        {selectedItem ? (
          <div className="grid gap-4">
            {selectedItem.imageUrl ? <img src={selectedItem.imageUrl} alt={selectedItem.title} className="max-h-[70vh] w-full rounded-[1.8rem] object-contain" /> : null}
            <p className="text-sm leading-7 text-ink-700 dark:text-white/75">{selectedItem.description}</p>
          </div>
        ) : null}
      </Modal>
    </PageShell>
  );
};

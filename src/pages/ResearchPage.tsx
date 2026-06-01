import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiSearch } from 'react-icons/fi';
import { useCollectionQuery } from '../hooks/useCollectionQuery';
import type { ResearchItem } from '../types/content';
import { PageShell } from '../components/common/PageShell';
import { SectionHeading } from '../components/common/SectionHeading';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { truncate } from '../utils/format';

export const ResearchPage = () => {
  const { data, isLoading } = useCollectionQuery<(ResearchItem & { id: string })>(['research'], 'research');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<(ResearchItem & { id: string }) | null>(null);

  const sampleResearch: (ResearchItem & { id: string })[] = [
    {
      id: 'r1',
      title: 'Scalable Hyperspectral Imaging',
      slug: 'hyperspectral-imaging',
      category: 'Remote Sensing',
      description: 'Developing scalable algorithms for hyperspectral image analysis.',
      objectives: 'Build scalable ML pipelines',
      methodology: 'Deep learning + domain adaptation',
      results: 'Improved classification accuracy on field data',
      status: 'Active',
      imageUrls: [],
      fileUrls: [],
    },
    {
      id: 'r2',
      title: 'Explainable AI for Geospatial Data',
      slug: 'explainable-ai-geospatial',
      category: 'AI',
      description: 'Interpretable models for remote sensing applications.',
      objectives: 'Increase explainability',
      methodology: 'Model distillation and attention maps',
      results: 'Better model transparency',
      status: 'Draft',
      imageUrls: [],
      fileUrls: [],
    },
  ];

  const effectiveData = data ?? (import.meta.env.DEV ? sampleResearch : []);

  const categories = useMemo(() => ['All', ...new Set(effectiveData.map((item) => item.category).filter(Boolean))], [effectiveData]);

  const filteredItems = useMemo(() => effectiveData.filter((item) => {
    const matchesSearch = [item.title, item.category, item.description, item.objectives, item.methodology, item.results]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  }), [categoryFilter, data, searchTerm, statusFilter]);
  if (isLoading && !import.meta.env.DEV) {
    return <PageShell><LoadingState message="Loading research projects..." /></PageShell>;
  }

  return (
    <PageShell className="space-y-8 py-10">
      <SectionHeading eyebrow="Research" title="Research Management System" description="Search, filter, and inspect every project stored in Firestore." />

      <div className="grid gap-4 rounded-[1.8rem] border border-white/10 bg-white p-5 shadow-soft dark:bg-ink-900 md:grid-cols-3">
        <label className="relative md:col-span-1">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search projects" className="w-full rounded-2xl border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm outline-none dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
        </label>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-ink-950/60 dark:text-white">
          {['All', 'Draft', 'Active', 'Completed'].map((status) => <option key={status}>{status}</option>)}
        </select>
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-ink-950/60 dark:text-white">
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <motion.article key={item.id} whileHover={{ y: -4 }} className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white shadow-soft dark:bg-ink-900">
            {item.imageUrls?.[0] ? <img src={item.imageUrls[0]} alt={item.title} className="h-52 w-full object-cover" /> : <div className="flex h-52 items-center justify-center bg-ink-100 text-sm text-ink-500 dark:bg-white/5 dark:text-white/50">Research image</div>}
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-gold-400/15 px-3 py-1 text-xs font-semibold text-gold-700 dark:text-gold-200">{item.status}</span>
                <span className="text-xs uppercase tracking-[0.25em] text-ink-400">{item.category}</span>
              </div>
              <h3 className="mt-4 font-heading text-2xl font-semibold text-ink-900 dark:text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-600 dark:text-white/65">{truncate(item.description)}</p>
              <button type="button" onClick={() => setSelectedItem(item)} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 dark:text-gold-300">
                View details
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {!filteredItems.length ? <EmptyState title="No projects match the current filters" description="Try a broader search or add more research documents in the dashboard." /> : null}

      <Modal open={Boolean(selectedItem)} title={selectedItem?.title || 'Research details'} onClose={() => setSelectedItem(null)}>
        {selectedItem ? (
          <div className="grid gap-5 text-sm leading-7 text-ink-700 dark:text-white/75">
            <p>{selectedItem.description}</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div><p className="text-xs uppercase tracking-[0.2em] text-ink-400">Objectives</p><p className="mt-2">{selectedItem.objectives}</p></div>
              <div><p className="text-xs uppercase tracking-[0.2em] text-ink-400">Methodology</p><p className="mt-2">{selectedItem.methodology}</p></div>
              <div><p className="text-xs uppercase tracking-[0.2em] text-ink-400">Results</p><p className="mt-2">{selectedItem.results}</p></div>
            </div>
            <div className="flex flex-wrap gap-3">
              {selectedItem.fileUrls?.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white"><FiDownload /> Download file</a>)}
            </div>
          </div>
        ) : null}
      </Modal>
    </PageShell>
  );
};

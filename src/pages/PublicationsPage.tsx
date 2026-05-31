import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiDownload, FiSearch } from 'react-icons/fi';
import { useCollectionQuery } from '../hooks/useCollectionQuery';
import type { PublicationItem } from '../types/content';
import { PageShell } from '../components/common/PageShell';
import { SectionHeading } from '../components/common/SectionHeading';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { toast } from 'react-hot-toast';
import { truncate } from '../utils/format';

export const PublicationsPage = () => {
  const { data, isLoading } = useCollectionQuery<(PublicationItem & { id: string })>(['publications'], 'publications');
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<(PublicationItem & { id: string }) | null>(null);

  const years = useMemo(() => ['All', ...Array.from(new Set((data ?? []).map((item) => String(item.year))))], [data]);
  const types = useMemo(() => ['All', ...Array.from(new Set((data ?? []).map((item) => item.type)))], [data]);

  const filteredItems = useMemo(() => (data ?? []).filter((item) => {
    const matchesSearch = [item.title, item.authors, item.venue, item.abstract, item.citation, item.bibtex, item.keywords.join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === 'All' || String(item.year) === yearFilter;
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    return matchesSearch && matchesYear && matchesType;
  }), [data, searchTerm, typeFilter, yearFilter]);

  const copyText = async (text: string, message: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(message);
  };

  if (isLoading) {
    return <PageShell><LoadingState message="Loading publications..." /></PageShell>;
  }

  return (
    <PageShell className="space-y-8 py-10">
      <SectionHeading eyebrow="Publications" title="Publication Management" description="Search by title, filter by year or venue type, and open detailed records." />

      <div className="grid gap-4 rounded-[1.8rem] border border-white/10 bg-white p-5 shadow-soft dark:bg-ink-900 md:grid-cols-3">
        <label className="relative md:col-span-1">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search publications" className="w-full rounded-2xl border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm outline-none dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
        </label>
        <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-ink-950/60 dark:text-white">
          {years.map((year) => <option key={year}>{year}</option>)}
        </select>
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-ink-950/60 dark:text-white">
          {types.map((type) => <option key={type}>{type}</option>)}
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <motion.article key={item.id} whileHover={{ y: -4 }} className="rounded-[1.8rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-ink-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-gold-400/15 px-3 py-1 text-xs font-semibold text-gold-700 dark:text-gold-200">{item.type}</span>
              <span className="text-xs uppercase tracking-[0.25em] text-ink-400">{item.year}</span>
            </div>
            <h3 className="mt-5 font-heading text-2xl font-semibold text-ink-900 dark:text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-ink-500 dark:text-white/55">{item.authors}</p>
            <p className="mt-4 text-sm leading-7 text-ink-600 dark:text-white/65">{truncate(item.abstract)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => void copyText(item.citation, 'Citation copied')} className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white"><FiCopy /> Copy citation</button>
              <button type="button" onClick={() => void copyText(item.bibtex, 'BibTeX copied')} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink-700 dark:bg-white/10 dark:text-white"><FiCopy /> BibTeX</button>
              {item.pdfUrl ? <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-2 text-xs font-semibold text-ink-950"><FiDownload /> PDF</a> : null}
            </div>
            <button type="button" onClick={() => setSelectedItem(item)} className="mt-5 text-sm font-semibold text-gold-700 dark:text-gold-300">Open details</button>
          </motion.article>
        ))}
      </div>

      {!filteredItems.length ? <EmptyState title="No publications match the current filters" description="Upload records in the dashboard or widen the filter criteria." /> : null}

      <Modal open={Boolean(selectedItem)} title={selectedItem?.title || 'Publication details'} onClose={() => setSelectedItem(null)}>
        {selectedItem ? (
          <div className="grid gap-4 text-sm leading-7 text-ink-700 dark:text-white/75">
            <p>{selectedItem.abstract}</p>
            <p><span className="font-semibold">Venue:</span> {selectedItem.venue}</p>
            <p><span className="font-semibold">DOI:</span> {selectedItem.doi}</p>
            <div>
              <p className="font-semibold">Keywords</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedItem.keywords.map((keyword) => <span key={keyword} className="rounded-full bg-ink-100 px-3 py-1 text-xs text-ink-700 dark:bg-white/10 dark:text-white">{keyword}</span>)}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </PageShell>
  );
};

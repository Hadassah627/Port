import { motion } from 'framer-motion';
import { useCollectionQuery } from '../hooks/useCollectionQuery';
import type { TeachingItem } from '../types/content';
import { PageShell } from '../components/common/PageShell';
import { SectionHeading } from '../components/common/SectionHeading';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';

export const TeachingPage = () => {
  const { data, isLoading } = useCollectionQuery<(TeachingItem & { id: string })>(['teaching'], 'teaching');

  const sampleTeaching: (TeachingItem & { id: string })[] = [
    { id: 't1', courseName: 'Advanced Machine Learning', courseCode: 'CSE701', semester: 'Fall', year: 2023, description: 'Graduate course on ML methods.' },
    { id: 't2', courseName: 'Remote Sensing', courseCode: 'CSE502', semester: 'Spring', year: 2022, description: 'Undergraduate remote sensing course.' },
  ];

  const effectiveData = data ?? (import.meta.env.DEV ? sampleTeaching : []);

  if (isLoading && !import.meta.env.DEV) {
    return <PageShell><LoadingState message="Loading teaching records..." /></PageShell>;
  }

  const totalCourses = effectiveData?.length ?? 0;
  const semesters = new Set((effectiveData ?? []).map((item) => item.semester)).size;
  const years = new Set((effectiveData ?? []).map((item) => item.year)).size;

  return (
    <PageShell className="space-y-8 py-10">
      <SectionHeading eyebrow="Teaching" title="Teaching Profile" description="Course history, timelines, and subject stats powered by Firestore." />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Courses', value: totalCourses },
          { label: 'Semesters', value: semesters },
          { label: 'Years', value: years },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.6rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-ink-900">
            <p className="text-sm text-ink-500 dark:text-white/55">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold text-ink-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {(effectiveData ?? []).map((item) => (
          <motion.article key={item.id} whileHover={{ y: -4 }} className="rounded-[1.8rem] border border-white/10 bg-ink-50 p-6 dark:bg-white/5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-500 dark:text-gold-300">{item.courseCode}</span>
              <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-700 dark:bg-white/10 dark:text-white">{item.semester} · {item.year}</span>
            </div>
            <h3 className="mt-5 font-heading text-2xl font-semibold text-ink-900 dark:text-white">{item.courseName}</h3>
            <p className="mt-4 text-sm leading-7 text-ink-600 dark:text-white/65">{item.description}</p>
          </motion.article>
        ))}
      </div>

      {!data?.length ? <EmptyState title="No teaching records available" description="Add course entries in the admin dashboard to publish the teaching page." /> : null}
    </PageShell>
  );
};

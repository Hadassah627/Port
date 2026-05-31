import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { StatCard } from '../components/home/StatCard';
import { FiArrowRight, FiExternalLink, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaGraduationCap, FaBook, FaProjectDiagram, FaUsers } from 'react-icons/fa';
import { useDocumentQuery } from '../hooks/useDocumentQuery';
import { useCollectionQuery } from '../hooks/useCollectionQuery';
import type { AchievementItem, GalleryItem, PublicationItem, Profile, ResearchItem, Settings, TeachingItem } from '../types/content';
import { Seo } from '../components/Seo';
import { PageShell } from '../components/common/PageShell';
import { SectionHeading } from '../components/common/SectionHeading';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';

const COUNTER_DURATION = 1200; // ms

function useCountTo(target: number, start = 0) {
  const [value, setValue] = useState(start);
  useEffect(() => {
    let raf: number | null = null;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / COUNTER_DURATION);
      setValue(Math.floor(start + (target - start) * t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [target, start]);
  return value;
}

export const HomePage: React.FC = () => {
  const NAME = 'Dr. Abduru Sankara Rao, Ph.D.';
  const DESIGNATION = 'Professor — Department of Computer Science and Engineering';
  const INSTITUTION = 'RGUKT';
  const BIO = "Dr. Abduru Sankara Rao is an interdisciplinary researcher working at the intersection of Artificial Intelligence, Remote Sensing, and Hyperspectral Imaging. He develops robust machine learning models for real-world environmental sensing, mentors graduate students, and collaborates on international research projects. His work focuses on scalable algorithms, data-driven imaging pipelines, and explainable AI for geospatial applications.";

  const { data: profile, isLoading: profileLoading, isFetching: profileFetching, error: profileError } = useDocumentQuery<Profile>(['profile', 'main'], 'profile', 'main');
  const { data: settings, isFetching: settingsFetching, error: settingsError } = useDocumentQuery<Settings>(['settings', 'main'], 'settings', 'main');
  const { data: achievements, isFetching: achievementsFetching, error: achievementsError } = useCollectionQuery<(AchievementItem & { id: string })>(['achievements'], 'achievements');
  const { data: research, isFetching: researchFetching, error: researchError } = useCollectionQuery<(ResearchItem & { id: string })>(['research'], 'research');
  const { data: publications, isFetching: publicationsFetching, error: publicationsError } = useCollectionQuery<(PublicationItem & { id: string })>(['publications'], 'publications');
  const { data: teaching, isFetching: teachingFetching, error: teachingError } = useCollectionQuery<(TeachingItem & { id: string })>(['teaching'], 'teaching');
  const { data: gallery, isFetching: galleryFetching, error: galleryError } = useCollectionQuery<(GalleryItem & { id: string })>(['gallery'], 'gallery');

  // Debug logs to help diagnose why the homepage shows loading/skeletons
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('HomePage debug:', {
      profile: { profile, profileLoading, profileFetching, profileError },
      settings: { settings, settingsFetching, settingsError },
      achievements: { achievements, achievementsFetching, achievementsError },
      research: { research, researchFetching, researchError },
      publications: { publications, publicationsFetching, publicationsError },
      teaching: { teaching, teachingFetching, teachingError },
      gallery: { gallery, galleryFetching, galleryError },
    });
  }, [
    profile,
    profileLoading,
    profileFetching,
    profileError,
    settings,
    settingsFetching,
    settingsError,
    achievements,
    achievementsFetching,
    achievementsError,
    research,
    researchFetching,
    researchError,
    publications,
    publicationsFetching,
    publicationsError,
    teaching,
    teachingFetching,
    teachingError,
    gallery,
    galleryFetching,
    galleryError,
  ]);

  // Dev-only visible panel (so it's shown even while profile is loading)
  const DevDebugPanel = () => (
    import.meta.env.DEV ? (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border bg-white/90 p-3 text-xs text-ink-900 shadow-lg dark:bg-ink-900/90 dark:text-white">
        <div className="font-semibold">DEV DEBUG</div>
        <div className="mt-2 max-h-48 overflow-auto">
          <pre className="whitespace-pre-wrap">{JSON.stringify({ profile: profile ?? null, profileLoading }, null, 2)}</pre>
        </div>
      </div>
    ) : null
  );

  // Provide a developer-only fallback profile when Firestore is inaccessible
  const sampleProfile: Profile = {
    id: 'main',
    name: NAME,
    // Prefer PNG at public root; fallback SVG exists at `/sir.svg`.
    photoUrl: '/sir.png',
    email: 'abduru@rgukt.edu.in',
    phone: '+91-98765-43210',
    biography: BIO,
    researchInterests: ['Artificial Intelligence', 'Remote Sensing'],
    education: [],
  } as unknown as Profile;

  const effectiveProfile = profile ?? (import.meta.env.DEV ? sampleProfile : null);

  // If not in dev and still loading, show loading state early as before
  if (!import.meta.env.DEV && profileLoading) return <PageShell><LoadingState message="Loading faculty profile..." /><DevDebugPanel /></PageShell>;

  const stats = achievements && achievements.length ? achievements : [
    { id: 'p1', title: 'Publications', value: '45+', description: 'Peer-reviewed papers', icon: 'publications' } as any,
    { id: 'p2', title: 'Citations', value: '1200+', description: 'Google Scholar citations', icon: 'citations' } as any,
    { id: 'p3', title: 'Projects', value: '20+', description: 'Research projects', icon: 'projects' } as any,
    { id: 'p4', title: 'PhD Students', value: '12+', description: 'Students mentored', icon: 'students' } as any,
    { id: 'p5', title: 'Grants', value: '5+', description: 'Research grants', icon: 'grants' } as any,
    { id: 'p6', title: 'Collaborations', value: '15+', description: 'International partners', icon: 'collabs' } as any,
  ];

  return (
    <>
      <Seo
        title={settings?.seoTitle || NAME}
        description={settings?.seoDescription || BIO}
        image={settings?.ogImageUrl || effectiveProfile?.photoUrl}
      />

      {/* HERO + STATS (componentized) */}
      <Hero
        name={NAME}
        designation={DESIGNATION}
        institution={INSTITUTION}
        bio={BIO}
        photoUrl={effectiveProfile?.photoUrl}
        email={effectiveProfile?.email}
        phone={effectiveProfile?.phone}
      />

      {/* Statistics */}
      <div className="relative z-20 -mt-12">
        <PageShell>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {stats.slice(0, 6).map((s: any) => (
              <StatCard key={s.id} id={s.id} title={s.title} value={s.value} description={s.description} />
            ))}
          </div>
        </PageShell>
      </div>

      {/* MAIN CONTENT */}
      <PageShell className="space-y-16 py-16">
        <section id="research-areas" className="scroll-mt-24">
          <SectionHeading eyebrow="Research" title="Research Areas" description="Key themes and domains of research." />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {['Artificial Intelligence', 'Machine Learning', 'Remote Sensing', 'Hyperspectral Imaging', 'Computer Vision', 'Deep Learning'].map((r) => (
              <motion.article key={r} whileHover={{ y: -6 }} className="rounded-2xl border border-white/10 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-600/10 p-3 text-xl text-blue-400"><FaGraduationCap /></div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-ink-900">{r}</h3>
                    <p className="mt-2 text-sm text-ink-600">Focused work on algorithms, applications and datasets for {r.toLowerCase()}.</p>
                    <div className="mt-4"><Link to="/research" className="text-sm font-semibold text-blue-500">View Details <FiArrowRight className="inline-block" /></Link></div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="recent-publications" className="scroll-mt-24">
          <SectionHeading eyebrow="Publications" title="Recent Publications" description="Select peer-reviewed publications and conference papers." />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {(publications ?? []).slice(0, 6).map((p: any) => (
              <article key={p.id} className="rounded-2xl border border-white/10 bg-white p-6 shadow-soft">
                <div className="text-xs text-ink-500">{p.journal || p.type} · {p.year}</div>
                <h3 className="mt-2 font-heading text-lg font-semibold text-ink-900">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{p.authors}</p>
                <div className="mt-4 flex items-center gap-3">
                  {p.pdfUrl ? <a href={p.pdfUrl} className="text-sm font-semibold text-blue-500">Download PDF</a> : null}
                  {p.doi ? <a href={`https://doi.org/${p.doi}`} className="text-sm font-semibold text-blue-500">DOI</a> : null}
                </div>
              </article>
            ))}
            {!(publications ?? []).length ? <EmptyState title="No publications" description="Add publications in the admin dashboard." /> : null}
          </div>
        </section>

        <section id="projects" className="scroll-mt-24">
          <SectionHeading eyebrow="Projects" title="Ongoing Research Projects" description="Active projects with status and funding information." />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {(research ?? []).slice(0, 6).map((rItem: any) => (
              <article key={rItem.id} className="rounded-2xl border border-white/10 bg-white p-6 shadow-soft">
                <div className="h-40 overflow-hidden rounded-lg bg-ink-100">
                  {rItem.imageUrl ? <img src={rItem.imageUrl} alt={rItem.title} className="h-full w-full object-cover" /> : null}
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-ink-900">{rItem.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{rItem.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-300">{rItem.status}</span>
                  <Link to="/research" className="text-sm font-semibold text-blue-500">View Details</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="news" className="scroll-mt-24">
          <SectionHeading eyebrow="News" title="News & Updates" description="Conference talks, awards, grants and important notices." />
          <div className="mt-8">
            <div className="relative">
              <div className="ml-6 border-l border-white/10 pl-6">
                      {( (settings as any)?.news ?? [] ).slice(0, 6).map((n: any, i: number) => (
                  <div key={i} className="mb-6">
                    <div className="text-sm font-semibold text-gold-300">{n.date}</div>
                    <div className="mt-1 text-lg font-semibold text-ink-900">{n.title}</div>
                    <div className="mt-1 text-sm text-ink-600">{n.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="profiles" className="scroll-mt-24">
          <SectionHeading eyebrow="Profiles" title="Academic Profiles" description="Find Dr. Rao on external academic platforms." />
          <div className="mt-6 grid gap-4 grid-cols-3 sm:grid-cols-6">
            {['Google Scholar','ResearchGate','Scopus','ORCID','LinkedIn','GitHub'].map((p) => (
              <a key={p} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm font-semibold hover:scale-105 transition" href="#">{p}</a>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24">
          <SectionHeading eyebrow="Contact" title="Office & Contact" description="Office location, hours and contact information." />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-soft">
              <h3 className="font-heading text-lg font-semibold">Office</h3>
              <p className="mt-2 text-sm text-ink-600">Department of Computer Science and Engineering, RGUKT</p>
              <div className="mt-4 space-y-2 text-sm text-ink-600">
                <div><FiMail className="inline mr-2 text-gold-300" /> {effectiveProfile?.email || 'abduru@rgukt.edu.in'}</div>
                <div><FiPhone className="inline mr-2 text-gold-300" /> {effectiveProfile?.phone || '+91-98765-43210'}</div>
                <div><FiMapPin className="inline mr-2 text-gold-300" /> Office Hours: Mon–Fri 10:00–16:00</div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-50 p-6 dark:bg-white/5">
              <div className="h-64 w-full overflow-hidden rounded-lg bg-ink-100">{/* Map placeholder — integrate Google Maps in production */}</div>
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
};

import { FiBarChart2, FiFolder, FiImage, FiMail, FiPenTool, FiSettings, FiUsers } from 'react-icons/fi';
import { useCollectionQuery } from '../../hooks/useCollectionQuery';
import { useDocumentQuery } from '../../hooks/useDocumentQuery';
import type { AchievementItem, GalleryItem, PublicationItem, Profile, ResearchItem, Settings, TeachingItem } from '../../types/content';
import { PageShell } from '../../components/common/PageShell';
import { SectionHeading } from '../../components/common/SectionHeading';
import { ProfileEditor } from '../../components/admin/ProfileEditor';
import { CollectionManager } from '../../components/admin/CollectionManager';
import { MessagesManager } from '../../components/admin/MessagesManager';
import { SettingsEditor } from '../../components/admin/SettingsEditor';
import { researchConfig, publicationConfig, teachingConfig, galleryConfig, achievementConfig } from '../../config/collections';
import { LoadingState } from '../../components/common/LoadingState';

export const AdminDashboardPage = () => {
  const { data: profile } = useDocumentQuery<Profile>(['profile', 'main'], 'profile', 'main');
  const { data: settings } = useDocumentQuery<Settings>(['settings', 'main'], 'settings', 'main');
  const research = useCollectionQuery<(ResearchItem & { id: string })>(['research'], 'research');
  const publications = useCollectionQuery<(PublicationItem & { id: string })>(['publications'], 'publications');
  const teaching = useCollectionQuery<(TeachingItem & { id: string })>(['teaching'], 'teaching');
  const gallery = useCollectionQuery<(GalleryItem & { id: string })>(['gallery'], 'gallery');
  const achievements = useCollectionQuery<(AchievementItem & { id: string })>(['achievements'], 'achievements');

  const loading = [research, publications, teaching, gallery, achievements].some((query) => query.isLoading);

  if (loading) {
    return <LoadingState message="Loading dashboard data..." />;
  }

  const metrics = [
    { label: 'Research Projects', value: research.data?.length ?? 0, icon: FiFolder },
    { label: 'Publications', value: publications.data?.length ?? 0, icon: FiPenTool },
    { label: 'Teaching Items', value: teaching.data?.length ?? 0, icon: FiUsers },
    { label: 'Gallery Images', value: gallery.data?.length ?? 0, icon: FiImage },
    { label: 'Achievements', value: achievements.data?.length ?? 0, icon: FiBarChart2 },
    { label: 'Messages', value: 0, icon: FiMail },
  ];

  return (
    <PageShell className="space-y-8 py-8">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-ink-950 via-ink-900 to-slate-900 p-8 text-white shadow-glow">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-300">Dashboard</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold">Content management for {profile?.name || 'the faculty profile'}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
          Edit the public website from one place. This dashboard uses Firebase Authentication, Firestore, and Storage for every content section.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <metric.icon className="text-2xl text-gold-300" />
              <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
              <p className="mt-1 text-sm text-white/65">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section id="dashboard" className="rounded-[2rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-ink-900 lg:p-8">
        <SectionHeading
          eyebrow="Overview"
          title="Dashboard Summary"
          description="Profile and settings sit alongside the content collections so the full website can be maintained from Firebase."
        />
      </section>

      <ProfileEditor />
      <CollectionManager config={researchConfig} sectionId="research" />
      <CollectionManager config={publicationConfig} sectionId="publications" />
      <CollectionManager config={teachingConfig} sectionId="teaching" />
      <CollectionManager config={galleryConfig} sectionId="gallery" />
      <CollectionManager config={achievementConfig} sectionId="achievements" />
      <MessagesManager />
      <SettingsEditor />
    </PageShell>
  );
};

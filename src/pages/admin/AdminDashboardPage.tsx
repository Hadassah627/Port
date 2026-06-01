import { FiBarChart2, FiFolder, FiImage, FiMail, FiPenTool, FiUsers } from 'react-icons/fi';
import { useCollectionQuery } from '../../hooks/useCollectionQuery';
import { useDocumentQuery } from '../../hooks/useDocumentQuery';
import type { AchievementItem, GalleryItem, MessageItem, PublicationItem, Profile, ResearchItem, Settings, TeachingItem } from '../../types/content';
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
  const messages = useCollectionQuery<(MessageItem & { id: string })>(['messages'], 'messages');
  const research = useCollectionQuery<(ResearchItem & { id: string })>(['research'], 'research');
  const publications = useCollectionQuery<(PublicationItem & { id: string })>(['publications'], 'publications');
  const teaching = useCollectionQuery<(TeachingItem & { id: string })>(['teaching'], 'teaching');
  const gallery = useCollectionQuery<(GalleryItem & { id: string })>(['gallery'], 'gallery');
  const achievements = useCollectionQuery<(AchievementItem & { id: string })>(['achievements'], 'achievements');

  const loadingCount = [research, publications, teaching, gallery, achievements, messages].filter((query) => query.isLoading).length;

  const metrics = [
    { label: 'Research Projects', value: research.data?.length ?? 0, icon: FiFolder, href: '#research' },
    { label: 'Publications', value: publications.data?.length ?? 0, icon: FiPenTool, href: '#publications' },
    { label: 'Teaching Items', value: teaching.data?.length ?? 0, icon: FiUsers, href: '#teaching' },
    { label: 'Gallery Images', value: gallery.data?.length ?? 0, icon: FiImage, href: '#gallery' },
    { label: 'Achievements', value: achievements.data?.length ?? 0, icon: FiBarChart2, href: '#achievements' },
    { label: 'Messages', value: messages.data?.length ?? 0, icon: FiMail, href: '#messages' },
  ];

  const quickLinks = [
    { label: 'Profile', href: '#profile', description: 'Edit biography, contact details, and social links.' },
    { label: 'Research', href: '#research', description: 'Add projects, images, files, and status updates.' },
    { label: 'Publications', href: '#publications', description: 'Manage papers, DOI links, and citations.' },
    { label: 'Teaching', href: '#teaching', description: 'Maintain course history and teaching records.' },
    { label: 'Gallery', href: '#gallery', description: 'Upload photos that appear in the public gallery.' },
    { label: 'Messages', href: '#messages', description: 'Review and clear contact form submissions.' },
    { label: 'Settings', href: '#settings', description: 'Update site title, SEO, and contact details.' },
  ];

  return (
    <PageShell className="space-y-8 py-8">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-ink-950 via-ink-900 to-slate-900 p-8 text-white shadow-glow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-gold-300">Dashboard</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold">Content management for {profile?.name || settings?.siteTitle || 'the faculty profile'}</h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Edit the public website from one place. Anything saved here updates the same Firestore collections used by the public research, gallery, publication, and contact pages.
            </p>
            {loadingCount ? <p className="mt-4 text-sm text-gold-200">Loading {loadingCount} section{loadingCount === 1 ? '' : 's'} in the background.</p> : null}
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm text-white/75 lg:w-96">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Live sync</p>
            <p className="mt-3 leading-7">
              Research items go to <span className="font-semibold text-white">research</span>, gallery uploads go to <span className="font-semibold text-white">gallery</span>, and profile/settings updates are published directly to the homepage and contact pages.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <a key={metric.label} href={metric.href} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <metric.icon className="text-2xl text-gold-300" />
              <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
              <p className="mt-1 text-sm text-white/65">{metric.label}</p>
            </a>
          ))}
        </div>
      </div>

      <section id="dashboard" className="rounded-[2rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-ink-900 lg:p-8">
        <SectionHeading
          eyebrow="Overview"
          title="Dashboard Summary"
          description="Profile and settings sit alongside the content collections so the full website can be maintained from Firebase."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <a key={item.label} href={item.href} className="rounded-[1.4rem] border border-white/10 bg-ink-50 p-5 transition hover:border-gold-300 hover:bg-gold-50 dark:bg-white/5 dark:hover:bg-white/10">
              <p className="text-sm font-semibold text-ink-900 dark:text-white">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-white/60">{item.description}</p>
            </a>
          ))}
        </div>
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

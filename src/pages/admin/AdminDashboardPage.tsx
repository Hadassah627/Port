import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBarChart2, FiFolder, FiImage, FiMail, FiPenTool, FiUsers, FiArrowRight } from 'react-icons/fi';
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
import { useScrollSpy } from '../../hooks/useScrollSpy';

type OutletContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'tabbed' | 'scroll';
  setViewMode: (mode: 'tabbed' | 'scroll') => void;
};

const tabTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.25, ease: 'easeOut' as const }
};

export const AdminDashboardPage = () => {
  const { activeTab, setActiveTab, viewMode, setViewMode } = useOutletContext<OutletContextType>();

  const { data: profile } = useDocumentQuery<Profile>(['profile', 'main'], 'profile', 'main');
  const { data: settings } = useDocumentQuery<Settings>(['settings', 'main'], 'settings', 'main');
  const messages = useCollectionQuery<(MessageItem & { id: string })>(['messages'], 'messages');
  const research = useCollectionQuery<(ResearchItem & { id: string })>(['research'], 'research');
  const publications = useCollectionQuery<(PublicationItem & { id: string })>(['publications'], 'publications');
  const teaching = useCollectionQuery<(TeachingItem & { id: string })>(['teaching'], 'teaching');
  const gallery = useCollectionQuery<(GalleryItem & { id: string })>(['gallery'], 'gallery');
  const achievements = useCollectionQuery<(AchievementItem & { id: string })>(['achievements'], 'achievements');

  const loadingCount = [research, publications, teaching, gallery, achievements, messages].filter((query) => query.isLoading).length;

  const scrollspyActive = useScrollSpy([
    'dashboard',
    'profile',
    'research',
    'publications',
    'teaching',
    'gallery',
    'achievements',
    'messages',
    'settings',
  ]);

  useEffect(() => {
    if (viewMode === 'scroll' && scrollspyActive) {
      setActiveTab(scrollspyActive);
    }
  }, [scrollspyActive, viewMode, setActiveTab]);

  const metrics = [
    { label: 'Research Projects', value: research.data?.length ?? 0, icon: FiFolder, tab: 'research' },
    { label: 'Publications', value: publications.data?.length ?? 0, icon: FiPenTool, tab: 'publications' },
    { label: 'Teaching Items', value: teaching.data?.length ?? 0, icon: FiUsers, tab: 'teaching' },
    { label: 'Gallery Images', value: gallery.data?.length ?? 0, icon: FiImage, tab: 'gallery' },
    { label: 'Achievements', value: achievements.data?.length ?? 0, icon: FiBarChart2, tab: 'achievements' },
    { label: 'Messages', value: messages.data?.length ?? 0, icon: FiMail, tab: 'messages' },
  ];

  const quickLinks = [
    { label: 'Home Profile', tab: 'profile', description: 'Edit biography, contact details, and social links.' },
    { label: 'Research Projects', tab: 'research', description: 'Add projects, images, files, and status updates.' },
    { label: 'Publications CMS', tab: 'publications', description: 'Manage papers, DOI links, and citation records.' },
    { label: 'Teaching Records', tab: 'teaching', description: 'Maintain course lists, syllabus details, and lecture notes.' },
    { label: 'Media Gallery', tab: 'gallery', description: 'Upload event photos appearing on your public gallery.' },
    { label: 'Inbound Messages', tab: 'messages', description: 'Review submissions received from your public contact form.' },
    { label: 'Site Settings', tab: 'settings', description: 'Update SEO meta tags, maps, and Google Analytics hooks.' },
  ];

  const handleMetricClick = (tabId: string) => {
    setActiveTab(tabId);
    if (viewMode === 'scroll') {
      const element = document.getElementById(tabId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {/* Premium Hero Stats Panel */}
      <div className="rounded-[2.5rem] border border-ink-100 bg-white p-8 text-ink-900 shadow-glow dark:border-white/5 dark:bg-ink-900 dark:text-white lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-gold-500 font-bold dark:text-gold-300">CMS Overview</p>
            <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-ink-950 dark:text-white">
              Content control for {profile?.name || settings?.siteTitle || 'your portfolio'}
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink-600 dark:text-white/70">
              Manage your full professional portfolio from one secure place. Anything updated here syncs instantly to Firestore and publishes live to your public home, teaching, research, and publications pages.
            </p>
            {loadingCount ? (
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-gold-600 dark:text-gold-300">
                <span className="h-2 w-2 animate-ping rounded-full bg-gold-500" />
                Synchronizing {loadingCount} database collection{loadingCount === 1 ? '' : 's'}...
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-ink-100 bg-slate-50/50 p-6 text-sm text-ink-600 dark:border-white/5 dark:bg-white/5 dark:text-white/70 lg:w-96">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-500 font-bold dark:text-gold-300">Cloud Sync Status</p>
            <p className="mt-3 leading-7">
              Firestore updates are distributed instantly via real-time websockets. Profile modifications are pushed live to client cache within milliseconds.
            </p>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <button
              key={metric.label}
              type="button"
              onClick={() => handleMetricClick(metric.tab)}
              className="group flex flex-col items-start rounded-3xl border border-slate-100 bg-slate-50/50 p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:border-gold-300 hover:bg-gold-50/10 dark:border-white/5 dark:bg-white/5 dark:hover:border-gold-300/40 dark:hover:bg-gold-300/5"
            >
              <div className="flex w-full items-center justify-between">
                <metric.icon className="text-2xl text-gold-500 group-hover:scale-110 transition dark:text-gold-300" />
                <span className="text-[10px] uppercase tracking-wider text-ink-400 opacity-0 group-hover:opacity-100 transition duration-300 dark:text-white/40">Manage &rarr;</span>
              </div>
              <p className="mt-5 text-4xl font-extrabold tracking-tight text-ink-950 dark:text-white">{metric.value}</p>
              <p className="mt-1.5 text-xs font-semibold text-ink-500 dark:text-white/50">{metric.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-soft dark:border-white/5 dark:bg-ink-900 lg:p-10">
        <SectionHeading
          eyebrow="Quick access"
          title="Direct Action Items"
          description="Click any quick link block below to jump straight to the editing module or configure global settings."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleMetricClick(item.tab)}
              className="group flex flex-col items-start rounded-3xl border border-slate-100 bg-slate-50/50 p-6 text-left transition-all duration-300 hover:border-gold-300 hover:bg-gold-50/10 dark:border-white/5 dark:bg-white/5 dark:hover:border-gold-300/40 dark:hover:bg-gold-300/5"
            >
              <p className="text-sm font-bold text-ink-950 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-300 transition">{item.label}</p>
              <p className="mt-2 text-xs leading-6 text-ink-500 dark:text-white/50">{item.description}</p>
              <span className="mt-4 flex items-center gap-1 text-[10px] uppercase tracking-wider text-gold-600 font-bold opacity-0 group-hover:opacity-100 transition duration-300 dark:text-gold-300">
                Open module <FiArrowRight />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PageShell className="space-y-8 py-4">
      {/* Top Welcome Control Panel */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6 dark:border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-950 dark:text-white font-heading">
            Welcome back, {profile?.name ? profile.name.split(' ')[0] : 'Admin'}
          </h1>
          <p className="text-sm text-ink-500 mt-1 dark:text-white/60">
            Control center for your faculty portfolio website.
          </p>
        </div>
        
        {/* View Mode Toggle Switch */}
        <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-white/5 w-fit">
          <button
            type="button"
            onClick={() => setViewMode('tabbed')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
              viewMode === 'tabbed'
                ? 'bg-white text-gold-600 shadow-sm dark:bg-white/10 dark:text-gold-300'
                : 'text-ink-500 hover:text-ink-800 dark:text-white/60 dark:hover:text-white'
            }`}
          >
            Tabbed View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('scroll')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
              viewMode === 'scroll'
                ? 'bg-white text-gold-600 shadow-sm dark:bg-white/10 dark:text-gold-300'
                : 'text-ink-500 hover:text-ink-800 dark:text-white/60 dark:hover:text-white'
            }`}
          >
            Full Scroll View
          </button>
        </div>
      </div>

      {/* Main View Render Switch */}
      <AnimatePresence mode="wait">
        {viewMode === 'tabbed' ? (
          <motion.div
            key={activeTab}
            {...tabTransition}
            className="space-y-8"
          >
            {activeTab === 'dashboard' && renderDashboardOverview()}
            {activeTab === 'profile' && <ProfileEditor />}
            {activeTab === 'research' && <CollectionManager config={researchConfig} sectionId="research" />}
            {activeTab === 'publications' && <CollectionManager config={publicationConfig} sectionId="publications" />}
            {activeTab === 'teaching' && <CollectionManager config={teachingConfig} sectionId="teaching" />}
            {activeTab === 'gallery' && <CollectionManager config={galleryConfig} sectionId="gallery" />}
            {activeTab === 'achievements' && <CollectionManager config={achievementConfig} sectionId="achievements" />}
            {activeTab === 'messages' && <MessagesManager />}
            {activeTab === 'settings' && <SettingsEditor />}
          </motion.div>
        ) : (
          <motion.div
            key="scroll-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-16"
          >
            <div id="dashboard">{renderDashboardOverview()}</div>
            <div id="profile"><ProfileEditor /></div>
            <div id="research"><CollectionManager config={researchConfig} sectionId="research" /></div>
            <div id="publications"><CollectionManager config={publicationConfig} sectionId="publications" /></div>
            <div id="teaching"><CollectionManager config={teachingConfig} sectionId="teaching" /></div>
            <div id="gallery"><CollectionManager config={galleryConfig} sectionId="gallery" /></div>
            <div id="achievements"><CollectionManager config={achievementConfig} sectionId="achievements" /></div>
            <div id="messages"><MessagesManager /></div>
            <div id="settings"><SettingsEditor /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
};

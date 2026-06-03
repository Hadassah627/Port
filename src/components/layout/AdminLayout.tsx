import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  FiLogOut, 
  FiMoon, 
  FiSun, 
  FiGrid, 
  FiUser, 
  FiFolder, 
  FiPenTool, 
  FiUsers, 
  FiImage, 
  FiBarChart2, 
  FiMail, 
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { id: 'profile', label: 'Home Profile', icon: FiUser },
  { id: 'research', label: 'Research', icon: FiFolder },
  { id: 'publications', label: 'Publications', icon: FiPenTool },
  { id: 'teaching', label: 'Teaching', icon: FiUsers },
  { id: 'gallery', label: 'Gallery', icon: FiImage },
  { id: 'achievements', label: 'Achievements', icon: FiBarChart2 },
  { id: 'messages', label: 'Messages', icon: FiMail },
  { id: 'settings', label: 'Site Settings', icon: FiSettings },
];

export const AdminLayout = () => {
  const { userProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'tabbed' | 'scroll'>('tabbed');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    
    if (viewMode === 'scroll') {
      const element = document.getElementById(tabId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-ink-900 transition-colors duration-300 dark:bg-ink-950 dark:text-white">
      {/* Mobile Header Bar */}
      <header className="flex items-center justify-between border-b border-ink-100 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-ink-900/80 lg:hidden">
        <div className="flex items-center gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-500 font-bold dark:text-gold-300">CMS</p>
          <h2 className="text-lg font-semibold text-ink-950 dark:text-white">Faculty Port</h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-ink-600 transition dark:bg-white/5 dark:text-white/80"
          >
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-ink-800 transition dark:bg-white/5 dark:text-white"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar Container */}
        <aside 
          className={`fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r border-ink-100 bg-white px-6 py-8 transition-transform duration-300 dark:border-white/5 dark:bg-ink-950 lg:static lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Top Logo Panel */}
          <div className="hidden items-center justify-between lg:flex">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold-500 font-bold dark:text-gold-300">Admin CMS</p>
              <h2 className="mt-2 text-2xl font-bold font-heading text-ink-950 dark:text-white">Faculty Dashboard</h2>
            </div>
            <button 
              type="button" 
              onClick={toggleTheme} 
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-ink-600 transition hover:scale-105 dark:border-white/5 dark:bg-white/5 dark:text-white"
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
          </div>

          {/* Logged in Profile Badge */}
          <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50/50 p-5 dark:border-white/5 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400 dark:text-white/40">Signed in as</p>
            <p className="mt-1.5 font-semibold text-ink-950 dark:text-white">{userProfile?.displayName || 'Administrator'}</p>
            <p className="text-xs text-ink-500 truncate dark:text-white/50">{userProfile?.email}</p>
          </div>

          {/* Navigation Items */}
          <nav className="mt-8 flex-1 space-y-1.5">
            <p className="px-3 text-[10px] uppercase tracking-[0.3em] text-ink-400 dark:text-white/30">Collections</p>
            <div className="space-y-1 pt-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors duration-200 ${
                      isActive 
                        ? 'text-gold-600 dark:text-gold-300' 
                        : 'text-ink-600 hover:text-ink-950 dark:text-white/70 dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 rounded-2xl bg-gold-400/10 dark:bg-gold-300/10 border-l-4 border-gold-500 dark:border-gold-300"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="relative z-10 text-lg" />
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Sign Out Button */}
          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-500/10 bg-rose-500/5 px-4 py-3.5 text-sm font-bold text-rose-600 transition hover:bg-rose-500/10 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
            >
              <FiLogOut />
              Sign out
            </button>
          </div>
        </aside>

        {/* Mobile menu backdrop */}
        {mobileMenuOpen && (
          <div 
            role="presentation"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-6 dark:bg-ink-950 lg:p-10">
          <Outlet context={{ activeTab, setActiveTab, viewMode, setViewMode }} />
        </main>
      </div>
    </div>
  );
};
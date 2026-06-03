import { useMemo, useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useDocumentQuery } from '../../hooks/useDocumentQuery';
import type { Profile, Settings } from '../../types/content';

const menuItems = [
  { label: 'Home', to: '/' },
  { label: 'Research', to: '/research' },
  { label: 'Publications', to: '/publications' },
  { label: 'Teaching', to: '/teaching' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { firebaseUser, isAdmin } = useAuth();
  const location = useLocation();

  const activePath = useMemo(() => location.pathname, [location.pathname]);

  const { data: profile } = useDocumentQuery<Profile>(['profile', 'main'], 'profile', 'main');
  const { data: settings } = useDocumentQuery<Settings>(['settings', 'main'], 'settings', 'main');

  const displayName = profile?.name || settings?.siteTitle || 'Dr. Abduru Sankara Rao';

  const initials = useMemo(() => {
    return displayName
      .split(' ')
      .filter((word) => !word.includes('.') && word.length > 0)
      .map((word) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AD';
  }, [displayName]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-black/5 bg-white/70 shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/70'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-ink-800 to-ink-600 text-sm font-bold text-gold-300 shadow-glow group-hover:scale-105 transition-transform duration-300 dark:from-white/10 dark:to-white/5">
              {initials}
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold tracking-tight text-ink-900 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-300 transition-colors duration-300">
                {displayName}
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-ink-500 dark:text-white/40">
                Faculty Portfolio
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 lg:flex">
            {menuItems.map((item) => {
              const isHomeActive = item.to === '/' && activePath === '/';
              const isOtherActive = item.to !== '/' && activePath.startsWith(item.to);
              const isLinkActive = isHomeActive || isOtherActive;

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                    isLinkActive
                      ? 'text-gold-500 dark:text-gold-300'
                      : 'text-ink-600 hover:text-ink-900 dark:text-white/75 dark:hover:text-white'
                  }`}
                >
                  {isLinkActive && (
                    <motion.span
                      layoutId="bubble"
                      className="absolute inset-0 z-[-1] rounded-full bg-ink-50 dark:bg-white/5"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </NavLink>
              );
            })}

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/80 text-ink-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 dark:border-white/10 dark:bg-ink-900/80 dark:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun className="text-gold-300" /> : <FiMoon className="text-ink-700" />}
            </button>

            {/* Admin Badge */}
            {firebaseUser && isAdmin && (
              <Link
                to="/admin/dashboard"
                className="ml-3 rounded-full bg-gold-400/10 px-4 py-1.5 text-xs font-semibold text-gold-600 border border-gold-400/20 hover:bg-gold-400/20 transition-all dark:text-gold-300"
              >
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Theme Toggle for mobile */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/80 text-ink-800 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-ink-900/80 dark:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun className="text-gold-300" /> : <FiMoon className="text-ink-700" />}
            </button>

            {/* Menu Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/80 text-ink-900 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-ink-900/80 dark:text-white"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 top-20 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="absolute left-0 right-0 top-20 z-50 border-b border-black/5 bg-white/95 px-4 py-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/95 lg:hidden"
            >
              <div className="grid gap-2">
                {menuItems.map((item) => {
                  const isHomeActive = item.to === '/' && activePath === '/';
                  const isOtherActive = item.to !== '/' && activePath.startsWith(item.to);
                  const isLinkActive = isHomeActive || isOtherActive;

                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      className={`flex rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                        isLinkActive
                          ? 'bg-ink-50 text-gold-500 dark:bg-white/5 dark:text-gold-300'
                          : 'text-ink-700 hover:bg-ink-50/50 dark:text-white/80 dark:hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </NavLink>
                  );
                })}

                {firebaseUser && isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex justify-center rounded-2xl bg-gold-400/10 px-5 py-4 text-sm font-bold text-gold-600 border border-gold-400/20 dark:text-gold-300"
                  >
                    Go to Admin Dashboard
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
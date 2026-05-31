import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const menuItems = [
  { label: 'Home', to: '/#home' },
  { label: 'Research', to: '/research' },
  { label: 'Publications', to: '/publications' },
  { label: 'Teaching', to: '/teaching' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { firebaseUser, isAdmin } = useAuth();
  const location = useLocation();

  const activePath = useMemo(() => location.pathname, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/85 backdrop-blur-xl dark:bg-ink-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-900 text-sm font-bold text-gold-300 shadow-glow">
            AD
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-ink-500 dark:text-white/50">Faculty Portfolio</p>
            <h1 className="font-heading text-lg font-semibold text-ink-900 dark:text-white">Dr. Abduru Sankara Rao</h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => [
                'rounded-full px-4 py-2 text-sm font-medium transition',
                isActive || activePath === item.to ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100 dark:text-white/75 dark:hover:bg-white/10',
              ].join(' ')}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            className="ml-2 rounded-full border border-gold-400/40 bg-gold-400/15 px-4 py-2 text-sm font-semibold text-gold-800 transition hover:bg-gold-400/25 dark:text-gold-200"
          >
            Admin
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white text-ink-900 shadow-sm transition hover:scale-105 dark:bg-ink-900 dark:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          {firebaseUser && isAdmin ? (
            <div className="ml-3 rounded-full bg-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 dark:bg-white/10 dark:text-white/80">
              Admin signed in
            </div>
          ) : null}
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white text-ink-900 dark:bg-ink-900 dark:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white text-ink-900 dark:bg-ink-900 dark:text-white"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-white px-4 py-4 shadow-xl dark:bg-ink-950 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => [
                  'rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive || activePath === item.to ? 'bg-ink-900 text-white' : 'bg-ink-50 text-ink-700 dark:bg-white/5 dark:text-white/80',
                ].join(' ')}
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl border border-gold-400/40 bg-gold-400/15 px-4 py-3 text-sm font-semibold text-gold-800 dark:text-gold-200"
            >
              Admin
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
};
import { Outlet } from 'react-router-dom';
import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminLayout = () => {
  const { userProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-100 text-ink-900 dark:bg-ink-950 dark:text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-ink-950 px-6 py-6 text-white lg:w-80 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-gold-300">Admin CMS</p>
              <h2 className="mt-2 text-2xl font-semibold">Faculty Dashboard</h2>
            </div>
            <button type="button" onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/60">Signed in as</p>
            <p className="mt-1 font-semibold">{userProfile?.displayName || 'Administrator'}</p>
            <p className="text-sm text-white/60">{userProfile?.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            <FiLogOut />
            Sign out
          </button>
          <p className="mt-8 text-xs uppercase tracking-[0.28em] text-white/40">Collections</p>
          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <a href="#dashboard">Dashboard</a>
            <a href="#profile">Profile</a>
            <a href="#research">Research</a>
            <a href="#publications">Publications</a>
            <a href="#teaching">Teaching</a>
            <a href="#gallery">Gallery</a>
            <a href="#achievements">Achievements</a>
            <a href="#messages">Messages</a>
            <a href="#settings">Settings</a>
          </div>
        </aside>

        <section className="flex-1 overflow-hidden">
          <Outlet />
        </section>
      </div>
    </div>
  );
};
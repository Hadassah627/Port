import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone, FiExternalLink } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDocumentQuery } from '../../hooks/useDocumentQuery';
import type { Profile, Settings } from '../../types/content';

export const Footer = () => {
  const { data: profile } = useDocumentQuery<Profile>(['profile', 'main'], 'profile', 'main');
  const { data: settings } = useDocumentQuery<Settings>(['settings', 'main'], 'settings', 'main');

  const displayName = profile?.name || 'Dr. Abduru Sankara Rao, Ph.D.';
  const email = profile?.email || settings?.contactEmail || 'abduru@rgukt.edu.in';
  const phone = profile?.phone || settings?.contactPhone || '+91-98765-43210';
  const office = profile?.office || 'Department of Computer Science and Engineering, RGUKT';

  const resolveSocialIcon = (label: string) => {
    const norm = label.toLowerCase();
    if (norm.includes('linkedin')) return <FiLinkedin />;
    if (norm.includes('github')) return <FiGithub />;
    if (norm.includes('email') || norm.includes('mail')) return <FiMail />;
    if (norm.includes('scholar')) return <FaGraduationCap />;
    return <FiExternalLink />;
  };

  return (
    <footer className="relative overflow-hidden border-t border-black/5 bg-ink-950 text-white dark:border-white/10">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(231,177,27,0.05),transparent_40%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(73,110,166,0.05),transparent_40%)]" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Main profile brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-gold-300">
                AR
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
                  Academic Profile
                </span>
                <h3 className="font-heading text-xl font-bold tracking-tight text-white">{displayName}</h3>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              Dr. Abduru Sankara Rao is a Professor of Computer Science and Engineering at RGUKT. 
              His research targets the intersection of Artificial Intelligence, Hyperspectral Sensing, and Machine Learning.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {profile?.socialLinks?.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70 border border-white/10 hover:border-gold-400 hover:text-gold-300 hover:bg-white/10 transition-colors"
                >
                  {resolveSocialIcon(link.label)}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
              Quick Navigation
            </h4>
            <ul className="mt-6 space-y-4 text-sm">
              {[
                { name: 'Research Interests', path: '/research' },
                { name: 'Academic Publications', path: '/publications' },
                { name: 'Teaching Curriculum', path: '/teaching' },
                { name: 'Campus Gallery', path: '/gallery' },
                { name: 'Office Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-white/60 transition-colors hover:text-gold-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400/50 opacity-0 transition-opacity group-hover:opacity-100" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
              Office Details
            </h4>
            <div className="mt-6 space-y-4 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <FiMail className="mt-1 text-gold-400 shrink-0" />
                <span className="break-all">{email}</span>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="mt-1 text-gold-400 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 text-gold-400 shrink-0" />
                <span>{office}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {displayName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-white/30">Stanford, MIT & CMU Grade Design System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
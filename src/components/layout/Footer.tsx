import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-ink-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">Faculty Portfolio</p>
          <h2 className="mt-4 font-heading text-3xl font-semibold">Dr. Abduru Sankara Rao, Ph.D.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            A research-led academic portfolio with Firebase-powered editing, publication management, gallery uploads, and a secure admin dashboard.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">Quick Links</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link to="/research" className="transition hover:text-gold-300">Research</Link>
            <Link to="/publications" className="transition hover:text-gold-300">Publications</Link>
            <Link to="/teaching" className="transition hover:text-gold-300">Teaching</Link>
            <Link to="/gallery" className="transition hover:text-gold-300">Gallery</Link>
            <Link to="/contact" className="transition hover:text-gold-300">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <div className="flex items-center gap-3"><FiMail /> <span>Firebase-managed email</span></div>
            <div className="flex items-center gap-3"><FiPhone /> <span>Firebase-managed phone</span></div>
            <div className="flex items-center gap-3"><FiMapPin /> <span>Office location from profile</span></div>
          </div>
          <div className="mt-6 flex items-center gap-4 text-xl text-white/60">
            <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href="#" aria-label="GitHub"><FiGithub /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Dr. Abduru Sankara Rao. All rights reserved.
      </div>
    </footer>
  );
};
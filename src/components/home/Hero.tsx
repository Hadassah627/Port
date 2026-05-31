import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';
import { FiArrowRight, FiExternalLink, FiMail, FiPhone } from 'react-icons/fi';

type HeroProps = {
  name: string;
  designation: string;
  institution: string;
  bio: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
};

export const Hero: React.FC<HeroProps> = ({ name, designation, institution, bio, photoUrl, email, phone }) => {
  const [imgError, setImgError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(photoUrl);
  return (
    <section id="home" className="relative overflow-hidden bg-[linear-gradient(180deg,#071A35_0%,#071A35_60%,#0b2548_100%)] text-white">
      <ParticlesBackground className="absolute inset-0 -z-20 opacity-70" />
      <svg className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full opacity-20" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#071A35" />
            <stop offset="100%" stopColor="#0b2548" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>

      <div className="relative z-20 grid gap-8 py-20 lg:grid-cols-[60%_40%] lg:items-center">
        <motion.div initial={{ opacity: 0, x: -36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">RESEARCHER • EDUCATOR • INNOVATOR</p>
          <h1 className="mt-6 font-heading text-5xl font-extrabold leading-tight md:text-6xl">{name}</h1>
          <p className="mt-2 text-lg font-medium text-white/80">{designation}<span className="block text-sm text-white/70">{institution}</span></p>

          <p className="mt-6 max-w-3xl text-base leading-7 text-white/75">{bio}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/research" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-1">
              Explore Research <FiArrowRight />
            </Link>
            <Link to="/publications" className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Publications <FiExternalLink />
            </Link>
            <a href="#contact" className="inline-flex items-center gap-3 rounded-full border border-gold-400/40 px-6 py-3 text-sm font-semibold text-gold-300 hover:bg-gold-400/10">Contact Me</a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><FiMail className="text-gold-300" /> {email || 'abduru@rgukt.edu.in'}</div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><FiPhone className="text-gold-300" /> {phone || '+91-98765-43210'}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative">
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-white/6 to-white/2 blur-3xl" />
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-6 shadow-2xl flex items-center justify-center">
            {currentSrc && !imgError ? (
              <motion.img
                src={currentSrc}
                alt={name}
                onError={() => {
                  // try svg fallback if png fails
                  if (currentSrc && currentSrc.endsWith('.png')) {
                    setCurrentSrc('/sir.svg');
                    return;
                  }
                  setImgError(true);
                }}
                className="h-40 w-40 md:h-56 md:w-56 rounded-full object-cover ring-4 ring-white/10"
                initial={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6 }}
              />
            ) : (
              <motion.div className="flex items-center justify-center">
                <div className="flex flex-col items-center text-center text-white/90">
                  <div className="mb-4 inline-flex h-20 w-20 md:h-28 md:w-28 items-center justify-center rounded-full bg-white/10 text-2xl md:text-4xl font-semibold">AS</div>
                  <p className="text-lg font-semibold">{name}</p>
                  <p className="text-sm text-white/70">Professor, CSE — RGUKT</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

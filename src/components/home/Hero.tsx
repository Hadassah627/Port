import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';
import { FiArrowRight, FiExternalLink, FiMail } from 'react-icons/fi';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

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

      <div className="relative z-20 grid gap-8 pt-8 pb-20 lg:grid-cols-[60%_40%] lg:items-center">
        <motion.div initial={{ opacity: 0, x: -36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="mt-0 max-w-3xl font-serif text-3xl font-medium leading-[1.05] tracking-[-0.02em] md:text-4xl lg:text-5xl">{name}</h1>
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

          {/* social/contact links (placed below action buttons) */}
          <div className="mt-6 flex flex-col items-start gap-3 lg:items-start">
            <a href={`mailto:${email || 'abduru@rgukt.edu.in'}`} className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
              <FiMail className="text-gold-300" /> <span>Email Me</span>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
              <FaLinkedin className="text-blue-400" /> <span>My LinkedIn</span>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
              <FaTwitter className="text-sky-400" /> <span>My Twitter</span>
            </a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative">
          <div className="overflow-hidden bg-transparent p-6 flex items-center justify-center">
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
                className="h-52 w-44 md:h-80 md:w-64 rounded-2xl object-cover ring-4 ring-white/10"
                initial={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6 }}
              />
            ) : (
              <motion.div className="flex items-center justify-center">
                <div className="flex flex-col items-center text-center text-white/90">
                      <div className="mb-4 inline-flex h-20 w-28 md:h-28 md:w-36 items-center justify-center rounded-2xl bg-white/10 text-2xl md:text-4xl font-semibold">AS</div>
                      <p className="text-lg font-semibold">{name}</p>
                      <p className="text-sm text-white/70">Professor, CSE — RGUKT</p>
                    </div>
                  </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      {/* (removed floating left contact bar) */}
    </section>
  );
};

export default Hero;

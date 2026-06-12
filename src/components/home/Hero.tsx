import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';
import { FiArrowRight, FiExternalLink, FiMail } from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaGithub, FaGraduationCap } from 'react-icons/fa';

type HeroProps = {
  name: string;
  designation: string;
  institution: string;
  bio: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  socialLinks?: Array<{ label: string; url: string }>;
};

const resolveSocialIcon = (label: string) => {
  const norm = label.toLowerCase();
  if (norm.includes('email') || norm.includes('mail')) return <FiMail className="text-gold-300" />;
  if (norm.includes('linkedin')) return <FaLinkedin className="text-blue-400" />;
  if (norm.includes('twitter') || norm.includes('x.com')) return <FaTwitter className="text-sky-400" />;
  if (norm.includes('github')) return <FaGithub className="text-white/85" />;
  if (norm.includes('scholar')) return <FaGraduationCap className="text-amber-400" />;
  return <FiExternalLink className="text-white/60" />;
};

export const Hero: React.FC<HeroProps> = ({ name, designation, institution, bio, photoUrl, email, phone, socialLinks }) => {
  const [imgError, setImgError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(photoUrl);

  useEffect(() => {
    setCurrentSrc(photoUrl);
  }, [photoUrl]);

  return (
    <section id="home" className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(7,26,53,1)_0%,rgba(5,11,19,1)_100%)] text-white py-12 sm:py-16 lg:py-28">
      {/* Dynamic Animated Particles */}
      <ParticlesBackground className="absolute inset-0 -z-20 opacity-40 pointer-events-none" />

      {/* Decorative Radial Lighting */}
      <div className="absolute top-[20%] left-[10%] -z-10 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] -z-10 h-80 w-80 rounded-full bg-gold-600/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[58%_42%] lg:items-center">
          
          {/* Left Column: Info & Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/5 px-4.5 py-1.5 text-xs font-semibold tracking-wider text-gold-300 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-ping" />
              <span>Computer Science & Engineering</span>
            </div>

            {/* Title / Name */}
            <h1 className="font-heading text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl text-white">
              {name}
            </h1>

            {/* Designation & Affiliation */}
            <p className="text-lg md:text-xl font-medium text-white/90">
              {designation}
              <span className="block text-sm text-gold-400 font-semibold mt-1 uppercase tracking-widest">{institution}</span>
            </p>

            {/* Bio */}
            <p className="text-base leading-relaxed text-white/70 max-w-2xl">
              {bio}
            </p>

            {/* Research Area Badges */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Primary Research Domains</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Artificial Intelligence', 'Remote Sensing', 'Hyperspectral Imaging', 'Machine Learning'].map((area) => (
                  <span key={area} className="rounded-xl border border-white/5 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/85 hover:border-gold-400/35 hover:bg-gold-400/5 transition-all">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/research" className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5">
                <span>View Research</span>
                <FiArrowRight />
              </Link>
              <Link to="/publications" className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                <span>Publications</span>
                <FiExternalLink />
              </Link>
              <a href="#contact" className="inline-flex items-center gap-2.5 rounded-full border border-gold-400/30 bg-gold-400/5 px-7 py-3.5 text-sm font-semibold text-gold-300 hover:bg-gold-400/10 transition-colors">
                <span>Contact</span>
              </a>
            </div>

            {/* Social / Contact quick links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {email && (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2.5 rounded-full bg-white/5 px-4.5 py-2 text-xs font-medium text-white/80 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-colors">
                  <FiMail className="text-gold-300" />
                  <span>{email}</span>
                </a>
              )}
              {socialLinks && socialLinks.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 rounded-full bg-white/5 px-4.5 py-2 text-xs font-medium text-white/80 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-colors">
                  {resolveSocialIcon(link.label)}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Profile Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end mt-12 lg:mt-0"
          >
            {/* The main profile card container */}
            <div className="relative z-10 w-full max-w-[280px] h-[320px] sm:w-72 sm:h-[340px] md:w-80 md:h-[380px] rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-2xl">
              <div className="relative w-full h-full overflow-hidden rounded-2xl bg-ink-950">
                {currentSrc && !imgError ? (
                  <img
                    src={currentSrc}
                    alt={name}
                    onError={() => {
                      if (currentSrc && currentSrc.endsWith('.png')) {
                        setCurrentSrc('/sir.svg');
                        return;
                      }
                      setImgError(true);
                    }}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-ink-900 to-ink-950">
                    <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-3xl font-extrabold text-gold-300">
                      AS
                    </div>
                    <h3 className="text-lg font-bold text-white">{name}</h3>
                    <p className="text-xs text-white/50 mt-1">Professor, CSE</p>
                    <p className="text-[10px] text-gold-400 mt-2 uppercase tracking-widest">{institution}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;



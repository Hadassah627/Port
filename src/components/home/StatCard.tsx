import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBook, FaProjectDiagram, FaUsers, FaAward } from 'react-icons/fa';
import { FiGlobe } from 'react-icons/fi';

type StatCardProps = {
  id: string;
  title: string;
  value: string;
  description?: string;
};

const resolveStatIcon = (title: string) => {
  const norm = title.toLowerCase();
  if (norm.includes('publication')) return <FaBook className="text-blue-500 dark:text-blue-400" />;
  if (norm.includes('citation')) return <FaGraduationCap className="text-amber-500 dark:text-amber-400" />;
  if (norm.includes('project')) return <FaProjectDiagram className="text-indigo-500 dark:text-indigo-400" />;
  if (norm.includes('student') || norm.includes('guid') || norm.includes('mentor')) return <FaUsers className="text-emerald-500 dark:text-emerald-400" />;
  if (norm.includes('grant') || norm.includes('award') || norm.includes('achievement')) return <FaAward className="text-purple-500 dark:text-purple-400" />;
  if (norm.includes('collab') || norm.includes('partner') || norm.includes('international')) return <FiGlobe className="text-rose-500 dark:text-rose-400" />;
  return <FaAward className="text-gold-500 dark:text-gold-400" />;
};

export const StatCard: React.FC<StatCardProps> = ({ id, title, value, description }) => {
  // Dynamically set font sizes for the "value" header depending on length
  const getValueFontSize = (val: string) => {
    if (val.length > 15) return 'text-base sm:text-lg font-bold';
    if (val.length > 8) return 'text-xl sm:text-2xl font-bold';
    return 'text-3xl sm:text-4xl font-extrabold';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-white p-6 text-center shadow-soft hover:shadow-glow transition-all duration-300 dark:border-white/5 dark:bg-ink-900/60 dark:shadow-glow group min-h-[180px]"
    >
      {/* Dynamic top gold border indicator on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 to-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div>
        {/* Icon Wrapper */}
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-lg dark:bg-white/5 transition-colors duration-300 group-hover:bg-gold-400/10">
          {resolveStatIcon(title)}
        </div>

        {/* Value */}
        <h4 className={`font-heading ${getValueFontSize(value)} text-ink-950 dark:text-white leading-tight tracking-tight mt-1 transition-colors duration-300 group-hover:text-gold-600 dark:group-hover:text-gold-300`}>
          {value}
        </h4>

        {/* Title */}
        <div className="mt-2 text-[11px] font-bold uppercase tracking-widest text-ink-500 dark:text-white/40 leading-snug">
          {title}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="mt-3 text-[11px] text-ink-600/70 dark:text-white/40 leading-relaxed border-t border-black/5 pt-3 dark:border-white/5">
          {description}
        </div>
      )}
    </motion.div>
  );
};


export default StatCard;


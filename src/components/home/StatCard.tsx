import React from 'react';
import { motion } from 'framer-motion';

type StatCardProps = {
  id: string;
  title: string;
  value: string;
  description?: string;
};

export const StatCard: React.FC<StatCardProps> = ({ id, title, value, description }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-white/10 bg-white/5 px-6 py-6 text-center">
      <div className="flex items-center justify-center text-4xl font-extrabold text-gold-300">{value}</div>
      <div className="mt-2 font-semibold">{title}</div>
      {description ? <div className="mt-1 text-xs text-white/70">{description}</div> : null}
    </motion.div>
  );
};

export default StatCard;

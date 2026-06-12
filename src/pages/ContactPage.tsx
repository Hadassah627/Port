import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { submitMessage } from '../services/firestore';
import { useDocumentQuery } from '../hooks/useDocumentQuery';
import type { Profile, Settings } from '../types/content';
import { PageShell } from '../components/common/PageShell';
import { SectionHeading } from '../components/common/SectionHeading';
import { LoadingState } from '../components/common/LoadingState';
import { getEmbedMapUrl } from '../utils/format';

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const ContactPage = () => {
  const { data: profile, isLoading: profileLoading } = useDocumentQuery<Profile>(['profile', 'main'], 'profile', 'main');
  const { data: settings, isLoading: settingsLoading } = useDocumentQuery<Settings>(['settings', 'main'], 'settings', 'main');

  const sampleProfile: Profile = {
    id: 'main' as any,
    name: 'Dr. Abduru Sankara Rao, Ph.D.',
    designation: 'Professor — Department of Computer Science and Engineering',
    biography: 'Sample biography',
    photoUrl: '/sir.png',
    email: 'abduru@rgukt.edu.in',
    phone: '+91-98765-43210',
    office: 'CSE Department, RGUKT',
    mapUrl: '',
    socialLinks: [],
    researchInterests: [],
    keywords: [],
    education: [],
    experience: [],
  } as unknown as Profile;

  const sampleSettings: Settings = {
    siteTitle: 'Faculty Portfolio',
    seoTitle: 'Dr. Abduru Sankara Rao',
    seoDescription: 'Faculty portfolio',
    ogImageUrl: '/sir.png',
    contactEmail: 'abduru@rgukt.edu.in',
    contactPhone: '+91-98765-43210',
    socialLinks: [],
  } as Settings;

  const effectiveProfile = profile ?? (import.meta.env.DEV ? sampleProfile : null);
  const effectiveSettings = settings ?? (import.meta.env.DEV ? sampleSettings : null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactForm>();

  const onSubmit = async (values: ContactForm) => {
    try {
      await submitMessage({ ...values, read: false });
      reset();
      toast.success('Message sent');
    } catch (error) {
      console.error(error);
      toast.error('Unable to send message');
    }
  };

  if ((profileLoading || settingsLoading) && !import.meta.env.DEV) {
    return <PageShell><LoadingState message="Loading contact details..." /></PageShell>;
  }

  return (
    <PageShell className="space-y-8 py-10">
      <SectionHeading eyebrow="Contact" title="Contact the Faculty Office" description="Messages are stored in Firestore and surfaced in the admin dashboard." />

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.8rem] border border-white/10 bg-ink-950 p-6 text-white shadow-glow">
          <h3 className="font-heading text-2xl font-semibold">Contact details</h3>
          <div className="mt-6 grid gap-4 text-sm text-white/70">
            <div className="flex items-center gap-3"><FiMail className="text-gold-300" /> {effectiveProfile?.email || effectiveSettings?.contactEmail || 'Email from Firebase'}</div>
            <div className="flex items-center gap-3"><FiPhone className="text-gold-300" /> {effectiveProfile?.phone || effectiveSettings?.contactPhone || 'Phone from Firebase'}</div>
            <div className="flex items-center gap-3"><FiMapPin className="text-gold-300" /> {effectiveProfile?.office || 'Office from Firebase'}</div>
          </div>

          {effectiveProfile?.mapUrl ? (
            <iframe title="Office map" src={getEmbedMapUrl(effectiveProfile.mapUrl, `${effectiveProfile.office || ''}, ${effectiveProfile.institution || ''}`)} className="mt-8 h-72 w-full rounded-[1.4rem] border-0" loading="lazy" />
          ) : null}
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit(onSubmit)} className="rounded-[1.8rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-ink-900">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
              Name
              <input {...register('name', { required: true })} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
              Email
              <input type="email" {...register('email', { required: true })} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80 md:col-span-2">
              Subject
              <input {...register('subject', { required: true })} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80 md:col-span-2">
              Message
              <textarea rows={8} {...register('message', { required: true })} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
            </label>
          </div>
          <button type="submit" disabled={isSubmitting} className="mt-6 inline-flex items-center gap-3 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-70">
            <FiSend /> Send message
          </button>
        </motion.form>
      </div>
    </PageShell>
  );
};

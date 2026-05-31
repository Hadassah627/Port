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

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const ContactPage = () => {
  const { data: profile, isLoading } = useDocumentQuery<Profile>(['profile', 'main'], 'profile', 'main');
  const { data: settings } = useDocumentQuery<Settings>(['settings', 'main'], 'settings', 'main');
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

  if (isLoading) {
    return <PageShell><LoadingState message="Loading contact details..." /></PageShell>;
  }

  return (
    <PageShell className="space-y-8 py-10">
      <SectionHeading eyebrow="Contact" title="Contact the Faculty Office" description="Messages are stored in Firestore and surfaced in the admin dashboard." />

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.8rem] border border-white/10 bg-ink-950 p-6 text-white shadow-glow">
          <h3 className="font-heading text-2xl font-semibold">Contact details</h3>
          <div className="mt-6 grid gap-4 text-sm text-white/70">
            <div className="flex items-center gap-3"><FiMail className="text-gold-300" /> {profile?.email || settings?.contactEmail || 'Email from Firebase'}</div>
            <div className="flex items-center gap-3"><FiPhone className="text-gold-300" /> {profile?.phone || settings?.contactPhone || 'Phone from Firebase'}</div>
            <div className="flex items-center gap-3"><FiMapPin className="text-gold-300" /> {profile?.office || 'Office from Firebase'}</div>
          </div>

          {profile?.mapUrl ? (
            <iframe title="Office map" src={profile.mapUrl} className="mt-8 h-72 w-full rounded-[1.4rem] border-0" loading="lazy" />
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

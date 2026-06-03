import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import type { Settings } from '../../types/content';
import { createDocument, updateDocument } from '../../services/firestore';
import { uploadSingleFile } from '../../services/storage';
import { useDocumentQuery } from '../../hooks/useDocumentQuery';
import { LoadingState } from '../common/LoadingState';

type SettingsForm = Settings & { ogImageUpload?: FileList | null };

const defaultSettings: SettingsForm = {
  siteTitle: '',
  seoTitle: '',
  seoDescription: '',
  ogImageUrl: '',
  contactEmail: '',
  contactPhone: '',
  socialLinks: [{ label: '', url: '' }],
  news: [{ date: '', title: '', description: '' }],
};

const sampleSettings: Settings = {
  siteTitle: 'Faculty Portfolio',
  seoTitle: 'Dr. Abduru Sankara Rao',
  seoDescription: 'Sample SEO description for development.',
  ogImageUrl: '/sir.png',
  contactEmail: 'abduru@rgukt.edu.in',
  contactPhone: '+91-98765-43210',
  socialLinks: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/' }],
  news: [
    { date: 'June 2026', title: 'New Research Grant', description: 'Received a research grant for remote sensing.' },
  ],
};

export const SettingsEditor = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useDocumentQuery<Settings>(['settings', 'main'], 'settings', 'main');
  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm<SettingsForm>({ defaultValues: defaultSettings });
  const socialLinks = useFieldArray({ control, name: 'socialLinks' });
  const news = useFieldArray({ control, name: 'news' });

  const effectiveData = data ?? (import.meta.env.DEV ? sampleSettings : null);

  useEffect(() => {
    if (effectiveData) {
      reset({
        ...defaultSettings,
        ...effectiveData,
        socialLinks: effectiveData.socialLinks ?? defaultSettings.socialLinks,
        news: effectiveData.news ?? defaultSettings.news,
      });
    }
  }, [effectiveData, reset]);

  const submitSettings = async (values: SettingsForm) => {
    try {
      const image = values.ogImageUpload?.item(0);
      const ogImageUrl = image ? await uploadSingleFile('settings/og-image', image) : values.ogImageUrl;
      const payload: Settings = {
        siteTitle: values.siteTitle,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        ogImageUrl,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        socialLinks: (values.socialLinks || []).filter((item) => item && (item.label || item.url)),
        news: (values.news || []).filter((item) => item && (item.title || item.date || item.description)),
      };

      await updateDocument('settings', 'main', payload);
      await queryClient.invalidateQueries({ queryKey: ['settings', 'main'] });
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Unable to update settings');
    }
  };

  const onSettingsError = (errors: any) => {
    console.error('Settings form errors:', errors);
    toast.error('Please check the settings form for errors');
  };

  if (isLoading && !import.meta.env.DEV) {
    return <LoadingState message="Loading settings..." />;
  }

  return (
    <section id="settings" className="scroll-mt-24 rounded-[2rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-ink-900 lg:p-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-500 dark:text-gold-300">Settings</p>
        <h3 className="font-heading text-2xl font-semibold text-ink-900 dark:text-white">Site and SEO settings</h3>
      </div>

      <form onSubmit={handleSubmit(submitSettings, onSettingsError)} className="mt-6 grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
            Website Title
            <input {...register('siteTitle')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
            SEO Title
            <input {...register('seoTitle')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80 md:col-span-2">
            SEO Description
            <textarea rows={4} {...register('seoDescription')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
            Contact Email
            <input type="email" {...register('contactEmail')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
            Contact Phone
            <input {...register('contactPhone')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80 md:col-span-2">
            Open Graph Image
            <input type="file" accept="image/*" {...register('ogImageUpload')} className="rounded-2xl border border-dashed border-ink-300 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-ink-50 p-4 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Social Links</h4>
              <button type="button" onClick={() => socialLinks.append({ label: '', url: '' })} className="text-xs font-semibold text-gold-600">
                <FiPlus className="inline" /> Add
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {socialLinks.fields.map((field, index) => (
                <div key={field.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <input {...register(`socialLinks.${index}.label` as const)} placeholder="Label" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                  <input {...register(`socialLinks.${index}.url` as const)} placeholder="URL" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                  <button type="button" onClick={() => socialLinks.remove(index)} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
            {effectiveData?.ogImageUrl ? <img src={effectiveData.ogImageUrl} alt="Open graph" className="mt-4 h-52 w-full rounded-3xl object-cover" /> : null}
          </div>

          <div className="rounded-3xl border border-white/10 bg-ink-50 p-4 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">News & Updates</h4>
              <button type="button" onClick={() => news.append({ date: '', title: '', description: '' })} className="text-xs font-semibold text-gold-600">
                <FiPlus className="inline" /> Add
              </button>
            </div>
            <div className="mt-4 grid gap-4 max-h-[350px] overflow-y-auto pr-1">
              {news.fields.map((field, index) => (
                <div key={field.id} className="grid gap-3 rounded-2xl border border-white/10 bg-white p-4 dark:bg-ink-950/60">
                  <div className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                    <input {...register(`news.${index}.date` as const)} placeholder="Date (e.g., June 2026)" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                    <input {...register(`news.${index}.title` as const)} placeholder="Title" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                    <button type="button" onClick={() => news.remove(index)} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                      <FiTrash2 />
                    </button>
                  </div>
                  <textarea rows={2} {...register(`news.${index}.description` as const)} placeholder="Description / Content" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-2xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-70">
          Update settings
        </button>
      </form>
    </section>
  );
};


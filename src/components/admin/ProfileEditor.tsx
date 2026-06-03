import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import type { Profile } from '../../types/content';
import { createDocument, updateDocument } from '../../services/firestore';
import { uploadSingleFile } from '../../services/storage';
import { useDocumentQuery } from '../../hooks/useDocumentQuery';
import { splitCommaList, toCommaList } from '../../utils/format';
import { LoadingState } from '../common/LoadingState';

type ProfileForm = Omit<Profile, 'researchInterests' | 'keywords'> & {
  researchInterests: string;
  keywords: string;
  photoUpload?: FileList | null;
};

const emptyProfile: ProfileForm = {
  name: '',
  designation: '',
  department: '',
  institution: '',
  biography: '',
  photoUrl: '',
  email: '',
  phone: '',
  office: '',
  mapUrl: '',
  socialLinks: [{ label: '', url: '' }],
  researchInterests: '',
  keywords: '',
  education: [{ degree: '', university: '', year: '', description: '' }],
  experience: [{ position: '', organization: '', years: '', description: '' }],
};

const sampleProfile: Profile = {
  name: 'Dr. Abduru Sankara Rao, Ph.D.',
  designation: 'Professor — Department of Computer Science and Engineering',
  department: 'Computer Science and Engineering',
  institution: 'RGUKT',
  biography: 'Sample biography for development.',
  photoUrl: '/sir.png',
  email: 'abduru@rgukt.edu.in',
  phone: '+91-98765-43210',
  office: 'CSE Department, RGUKT',
  mapUrl: '',
  socialLinks: [{ label: 'Email Me', url: 'mailto:abduru@rgukt.edu.in' }],
  researchInterests: ['Artificial Intelligence', 'Remote Sensing'],
  keywords: ['AI', 'Remote Sensing'],
  education: emptyProfile.education as any,
  experience: emptyProfile.experience as any,
};

export const ProfileEditor = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useDocumentQuery<Profile>(['profile', 'main'], 'profile', 'main');
  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileForm>({ defaultValues: emptyProfile });

  const effectiveData = data ?? (import.meta.env.DEV ? sampleProfile : null);

  const socialLinks = useFieldArray({ control, name: 'socialLinks' });
  const education = useFieldArray({ control, name: 'education' });
  const experience = useFieldArray({ control, name: 'experience' });

  useEffect(() => {
    if (effectiveData) {
      reset({
        ...emptyProfile,
        ...effectiveData,
        researchInterests: toCommaList(effectiveData.researchInterests ?? []),
        keywords: toCommaList(effectiveData.keywords ?? []),
        education: effectiveData.education ?? emptyProfile.education,
        experience: effectiveData.experience ?? emptyProfile.experience,
        socialLinks: effectiveData.socialLinks ?? emptyProfile.socialLinks,
      } as any);
    }
  }, [effectiveData, reset]);

  const submitProfile = async (values: ProfileForm) => {
    try {
      const photoFile = values.photoUpload?.item(0);
      const photoUrl = photoFile ? await uploadSingleFile('profile/photo', photoFile) : values.photoUrl;

      const payload: Profile = {
        name: values.name,
        designation: values.designation,
        department: values.department,
        institution: values.institution,
        biography: values.biography,
        photoUrl,
        email: values.email,
        phone: values.phone,
        office: values.office,
        mapUrl: values.mapUrl,
        socialLinks: (values.socialLinks || []).filter((item) => item && (item.label || item.url)),
        researchInterests: splitCommaList(values.researchInterests || ''),
        keywords: splitCommaList(values.keywords || ''),
        education: (values.education || []).filter((item) => item && (item.degree || item.university || item.year || item.description)),
        experience: (values.experience || []).filter((item) => item && (item.position || item.organization || item.years || item.description)),
      };

      await updateDocument('profile', 'main', payload);
      await queryClient.invalidateQueries({ queryKey: ['profile', 'main'] });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Unable to update profile');
    }
  };

  const onFormError = (errors: any) => {
    console.error('Profile form errors:', errors);
    toast.error('Please check the form for errors');
  };

  if (isLoading && !import.meta.env.DEV) {
    return <LoadingState message="Loading profile settings..." />;
  }

  return (
    <section id="profile" className="scroll-mt-24 rounded-[2rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-ink-900 lg:p-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-500 dark:text-gold-300">Profile</p>
        <h3 className="font-heading text-2xl font-semibold text-ink-900 dark:text-white">Manage faculty profile</h3>
      </div>

      <form onSubmit={handleSubmit(submitProfile, onFormError)} className="mt-6 grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
                Name
                <input {...register('name')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
                Designation
                <input {...register('designation')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
                Department
                <input {...register('department')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
                Institution
                <input {...register('institution')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
              Biography
              <textarea rows={7} {...register('biography')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
                Email
                <input {...register('email')} type="email" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
                Phone
                <input {...register('phone')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
                Office
                <input {...register('office')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
              Google Map Link
              <input {...register('mapUrl')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
            </label>

            <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
              Research Interests
              <textarea rows={3} {...register('researchInterests')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
            </label>

            <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
              Keywords
              <textarea rows={3} {...register('keywords')} className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
            </label>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
              Profile Photo
              <input type="file" accept="image/*" {...register('photoUpload')} className="rounded-2xl border border-dashed border-ink-300 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
            </label>
            {effectiveData?.photoUrl ? <img src={effectiveData.photoUrl} alt={effectiveData.name} className="h-64 w-full rounded-3xl object-cover" /> : null}

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
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-ink-50 p-4 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Education</h4>
              <button type="button" onClick={() => education.append({ degree: '', university: '', year: '', description: '' })} className="text-xs font-semibold text-gold-600">
                <FiPlus className="inline" /> Add
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {education.fields.map((field, index) => (
                <div key={field.id} className="grid gap-2 rounded-2xl border border-white/10 bg-white p-4 dark:bg-ink-950/60">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input {...register(`education.${index}.degree` as const)} placeholder="Degree" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                    <input {...register(`education.${index}.university` as const)} placeholder="University" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                  </div>
                  <div className="grid gap-2 md:grid-cols-[1fr_120px]">
                    <input {...register(`education.${index}.description` as const)} placeholder="Description" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                    <div className="flex gap-2">
                      <input {...register(`education.${index}.year` as const)} placeholder="Year" className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                      <button type="button" onClick={() => education.remove(index)} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-ink-50 p-4 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Experience</h4>
              <button type="button" onClick={() => experience.append({ position: '', organization: '', years: '', description: '' })} className="text-xs font-semibold text-gold-600">
                <FiPlus className="inline" /> Add
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {experience.fields.map((field, index) => (
                <div key={field.id} className="grid gap-2 rounded-2xl border border-white/10 bg-white p-4 dark:bg-ink-950/60">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input {...register(`experience.${index}.position` as const)} placeholder="Position" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                    <input {...register(`experience.${index}.organization` as const)} placeholder="Organization" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                  </div>
                  <div className="grid gap-2 md:grid-cols-[1fr_120px]">
                    <input {...register(`experience.${index}.description` as const)} placeholder="Description" className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                    <div className="flex gap-2">
                      <input {...register(`experience.${index}.years` as const)} placeholder="Years" className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
                      <button type="button" onClick={() => experience.remove(index)} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-2xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-70">
          Update profile
        </button>
      </form>
    </section>
  );
};

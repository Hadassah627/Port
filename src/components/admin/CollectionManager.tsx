import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import type { CollectionConfig } from '../../types/content';
import { createDocument, deleteDocument, updateDocument } from '../../services/firestore';
import { uploadManyFiles, uploadSingleFile } from '../../services/storage';
import { useCollectionQuery } from '../../hooks/useCollectionQuery';
import { classNames, slugify, splitCommaList, toCommaList } from '../../utils/format';
import { EmptyState } from '../common/EmptyState';
import { LoadingState } from '../common/LoadingState';

type CollectionManagerProps<T extends Record<string, any>> = {
  config: CollectionConfig<T>;
  sectionId: string;
};

const normalizeFormValues = <T extends Record<string, any>>(config: CollectionConfig<T>, item?: T | null) => {
  const values: Record<string, unknown> = {};

  config.fields.forEach((field) => {
    const currentValue = item ? item[field.name] : config.defaults[field.name as keyof T];

    if (field.type === 'tags') {
      values[field.name] = toCommaList(Array.isArray(currentValue) ? currentValue : []);
      return;
    }

    if (field.type === 'toggle') {
      values[field.name] = Boolean(currentValue);
      return;
    }

    if (field.type === 'number') {
      values[field.name] = currentValue ?? '';
      return;
    }

    values[field.name] = currentValue ?? (field.multiple ? [] : '');
  });

  return values;
};

const sampleItemsByCollection: Record<string, Array<Record<string, unknown>>> = {
  research: [{ id: 'sample-research', title: 'Sample Research Project', category: 'AI', description: 'Sample research description.', objectives: 'Sample objectives.', methodology: 'Sample methodology.', results: 'Sample results.', status: 'Active', imageUrls: [], fileUrls: [] }],
  publications: [{ id: 'sample-publication', title: 'Sample Publication', authors: 'Dr. A, Dr. B', venue: 'Sample Journal', year: new Date().getFullYear(), type: 'Journal', doi: '', pdfUrl: '', abstract: 'Sample abstract.', keywords: [], citation: 'Sample citation', bibtex: '@article{sample}', featured: false }],
  teaching: [{ id: 'sample-teaching', courseName: 'Sample Course', courseCode: 'CSE000', semester: 'Spring', year: new Date().getFullYear(), description: 'Sample teaching description.', credits: '', level: '' }],
  gallery: [{ id: 'sample-gallery', title: 'Sample Gallery Item', category: 'Events', imageUrl: '', description: 'Sample gallery description.', year: new Date().getFullYear(), featured: false }],
  achievements: [{ id: 'sample-achievement', title: 'Sample Achievement', value: '1+', description: 'Sample achievement description.', icon: 'star' }],
};

export const CollectionManager = <T extends Record<string, any>>({ config, sectionId }: CollectionManagerProps<T>) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCollectionQuery<(T & { id: string })>([config.collectionPath], config.collectionPath);
  const [editingId, setEditingId] = useState<string | null>(null);

  const effectiveData = data ?? (import.meta.env.DEV ? (sampleItemsByCollection[config.collectionPath] as Array<T & { id: string }>) : []);
  const editingItem = useMemo(() => effectiveData?.find((item) => item.id === editingId) ?? null, [effectiveData, editingId]);
  const { register, reset, handleSubmit, formState: { isSubmitting } } = useForm<Record<string, unknown>>({
    defaultValues: normalizeFormValues(config, null),
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    reset(normalizeFormValues(config, editingItem ? (editingItem as T) : null));
  }, [config, editingItem, reset]);

  const filteredItems = useMemo(() => {
    const list = (effectiveData ?? []).slice().sort((left, right) => {
      if (!config.sortBy) {
        return 0;
      }

      const leftValue = left[config.sortBy];
      const rightValue = right[config.sortBy];

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return config.sortDirection === 'asc' ? leftValue - rightValue : rightValue - leftValue;
      }

      return String(rightValue ?? '').localeCompare(String(leftValue ?? ''));
    });

    if (!searchTerm.trim()) {
      return list;
    }

    const queryText = searchTerm.toLowerCase();
    return list.filter((item) =>
      config.searchableFields.some((field) => String(item[field] ?? '').toLowerCase().includes(queryText))
    );
  }, [config, effectiveData, searchTerm]);

  const submitForm = async (values: Record<string, unknown>) => {
    const payload: Record<string, unknown> = { ...values };

    for (const field of config.fields) {
      if (field.type === 'number') {
        payload[field.name] = values[field.name] === '' || values[field.name] === undefined ? '' : Number(values[field.name]);
      }

      if (field.type === 'toggle') {
        payload[field.name] = Boolean(values[field.name]);
      }

      if (field.type === 'tags') {
        payload[field.name] = splitCommaList(String(values[field.name] ?? ''));
      }

      if (field.type === 'image' || field.type === 'file') {
        const fileList = values[field.name] as FileList | null | undefined;
        const selectedFiles = fileList instanceof FileList ? Array.from(fileList) : [];

        if (selectedFiles.length > 0) {
          const folder = `${config.collectionPath}/${field.name}`;
          const urls = field.multiple
            ? await uploadManyFiles(folder, selectedFiles)
            : [await uploadSingleFile(folder, selectedFiles[0])];

          payload[field.name] = field.multiple ? urls : urls[0];
        } else if (editingItem && field.name in editingItem) {
          payload[field.name] = editingItem[field.name as keyof T];
        } else {
          payload[field.name] = field.multiple ? [] : '';
        }
      }
    }

    if (!payload.slug && typeof payload.title === 'string') {
      payload.slug = slugify(payload.title);
    }

    try {
      if (editingId) {
        await updateDocument(config.collectionPath, editingId, payload as Partial<T>);
        toast.success('Updated successfully!');
      } else {
        await createDocument(config.collectionPath, payload as T);
        toast.success('Submitted successfully!');
      }

      reset(normalizeFormValues(config, null));
      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: [config.collectionPath] });
    } catch (error) {
      console.error(error);
      toast.error(`Unable to save ${config.title.toLowerCase()}`);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!window.confirm(`Delete this ${config.title.slice(0, -1).toLowerCase()}?`)) {
      return;
    }

    await deleteDocument(config.collectionPath, itemId);
    await queryClient.invalidateQueries({ queryKey: [config.collectionPath] });
    toast.success(`${config.title} deleted`);
  };

  if (isLoading && !import.meta.env.DEV) {
    return <LoadingState message={`Loading ${config.title.toLowerCase()}...`} />;
  }

  return (
    <section id={sectionId} className="scroll-mt-24 rounded-[2rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-ink-900 lg:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gold-500 dark:text-gold-300">{config.id}</p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-ink-900 dark:text-white">{config.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-600 dark:text-white/65">{config.description}</p>
        </div>
        <div className="relative w-full max-w-md">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={`Search ${config.title.toLowerCase()}`}
            className="w-full rounded-2xl border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gold-400 dark:border-white/10 dark:bg-ink-950/60 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-8 xl:grid-cols-[1.05fr_1.4fr]">
        <form
          onSubmit={handleSubmit(submitForm, (errors) => {
            console.error(`${config.title} form errors:`, errors);
            toast.error('Please check the form fields for errors');
          })}
          className="rounded-[1.8rem] border border-white/10 bg-ink-50 p-5 dark:bg-white/5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-base font-semibold text-ink-900 dark:text-white">{editingId ? 'Edit item' : 'New item'}</h4>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                reset(normalizeFormValues(config, null));
              }}
              className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-ink-700 shadow-sm transition hover:bg-gold-50 dark:bg-ink-950 dark:text-white/80"
            >
              Clear
            </button>
          </div>

          <div className="grid gap-4">
            {config.fields.map((field) => (
              <label key={field.name} className="grid gap-2 text-sm font-medium text-ink-700 dark:text-white/80">
                <span className="flex items-center justify-between gap-3">
                  <span>{field.label}</span>
                  {field.required ? <span className="text-xs uppercase tracking-[0.2em] text-gold-500">Required</span> : null}
                </span>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={5}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gold-400 dark:border-white/10 dark:bg-ink-950/60 dark:text-white"
                  />
                ) : field.type === 'select' ? (
                  <select
                    {...register(field.name)}
                    className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gold-400 dark:border-white/10 dark:bg-ink-950/60 dark:text-white"
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'toggle' ? (
                  <input type="checkbox" {...register(field.name)} className="h-5 w-5 rounded border-ink-300 text-gold-500 focus:ring-gold-500" />
                ) : field.type === 'image' || field.type === 'file' ? (
                  <div className="grid gap-3 rounded-2xl border border-dashed border-ink-300 bg-white p-4 dark:border-white/10 dark:bg-ink-950/40">
                    <input
                      type="file"
                      accept={field.accept}
                      multiple={field.multiple}
                      {...register(field.name)}
                      className="text-sm text-ink-600 file:mr-4 file:rounded-full file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-white dark:text-white/75"
                    />
                    {editingItem?.[field.name as keyof T] ? (
                      <div className="grid gap-2 text-xs text-ink-500 dark:text-white/55">
                        <span>Current asset</span>
                        <div className="flex flex-wrap gap-3">
                          {Array.isArray(editingItem[field.name as keyof T])
                            ? (editingItem[field.name as keyof T] as string[]).map((url) => (
                                <a key={url} href={url} target="_blank" rel="noreferrer" className="rounded-full bg-ink-100 px-3 py-2 text-xs text-ink-700 dark:bg-white/10 dark:text-white">
                                  View file
                                </a>
                              ))
                            : (
                              <a href={String(editingItem[field.name as keyof T])} target="_blank" rel="noreferrer" className="rounded-full bg-ink-100 px-3 py-2 text-xs text-ink-700 dark:bg-white/10 dark:text-white">
                                View file
                              </a>
                            )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gold-400 dark:border-white/10 dark:bg-ink-950/60 dark:text-white"
                  />
                )}
                {field.helperText ? <span className="text-xs font-normal text-ink-500 dark:text-white/50">{field.helperText}</span> : null}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={classNames(
              'mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800',
              isSubmitting && 'opacity-70'
            )}
          >
            <FiPlus />
            {editingId ? 'Update item' : 'Save item'}
          </button>
        </form>

        <div className="grid gap-4">
          {filteredItems.length ? (
            filteredItems.map((item) => (
              <article key={item.id} className="rounded-[1.6rem] border border-white/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:bg-ink-950/70">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-heading text-xl font-semibold text-ink-900 dark:text-white">{String(item[config.sortBy ?? 'title'] ?? item.id)}</h4>
                      {config.badge ? <span className="rounded-full bg-gold-400/15 px-3 py-1 text-xs font-semibold text-gold-700 dark:text-gold-200">{config.badge(item)}</span> : null}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-ink-600 dark:text-white/65">{config.preview(item)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(item.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-ink-700 transition hover:bg-gold-400/20 dark:bg-white/10 dark:text-white"
                      aria-label="Edit item"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeItem(item.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300"
                      aria-label="Delete item"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              title={`No ${config.title.toLowerCase()} found`}
              description="Add the first record using the form on the left. Search results and filters are applied from the saved Firebase data."
            />
          )}
        </div>
      </div>
    </section>
  );
};

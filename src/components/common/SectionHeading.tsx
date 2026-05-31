type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export const SectionHeading = ({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) => {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.35em] text-gold-500 dark:text-gold-300">{eyebrow}</p> : null}
      <h2 className="mt-3 font-heading text-3xl font-semibold text-ink-900 dark:text-white md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-sm leading-7 text-ink-600 dark:text-white/70 md:text-base">{description}</p> : null}
    </div>
  );
};

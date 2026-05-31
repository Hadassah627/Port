import { FiInbox } from 'react-icons/fi';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center dark:bg-white/5">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-400/15 text-2xl text-gold-300">
      <FiInbox />
    </div>
    <h3 className="mt-5 text-xl font-semibold text-ink-900 dark:text-white">{title}</h3>
    <p className="mt-3 max-w-xl text-sm leading-7 text-ink-600 dark:text-white/65">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

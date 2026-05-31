export const LoadingState = ({ message = 'Loading content...' }: { message?: string }) => (
  <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 dark:bg-white/5">
    <div className="h-5 w-1/3 animate-pulse rounded-full bg-ink-200/70 dark:bg-white/10" />
    <div className="h-40 animate-pulse rounded-3xl bg-ink-200/70 dark:bg-white/10" />
    <div className="h-4 w-2/3 animate-pulse rounded-full bg-ink-200/70 dark:bg-white/10" />
    <p className="pt-2 text-sm text-ink-500 dark:text-white/50">{message}</p>
  </div>
);

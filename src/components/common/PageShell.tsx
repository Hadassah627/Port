import type { ReactNode } from 'react';

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export const PageShell = ({ children, className = '' }: PageShellProps) => (
  <div className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

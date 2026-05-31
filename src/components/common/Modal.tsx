import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export const Modal = ({ open, title, children, onClose }: ModalProps) => {
  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/75 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-glow dark:bg-ink-900 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-2xl font-semibold text-ink-900 dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-white"
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

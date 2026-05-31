import { FiCheck, FiMail, FiTrash2 } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { MessageItem } from '../../types/content';
import { deleteDocument, updateDocument } from '../../services/firestore';
import { useCollectionQuery } from '../../hooks/useCollectionQuery';
import { LoadingState } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';

export const MessagesManager = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useCollectionQuery<(MessageItem & { id: string })>(['messages'], 'messages');

  const toggleRead = async (item: MessageItem & { id: string }) => {
    await updateDocument('messages', item.id, { read: !item.read });
    await queryClient.invalidateQueries({ queryKey: ['messages'] });
    toast.success(item.read ? 'Marked unread' : 'Marked read');
  };

  const removeMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) {
      return;
    }

    await deleteDocument('messages', id);
    await queryClient.invalidateQueries({ queryKey: ['messages'] });
    toast.success('Message deleted');
  };

  if (isLoading) {
    return <LoadingState message="Loading messages..." />;
  }

  return (
    <section id="messages" className="scroll-mt-24 rounded-[2rem] border border-white/10 bg-white p-6 shadow-soft dark:bg-ink-900 lg:p-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-500 dark:text-gold-300">Messages</p>
        <h3 className="font-heading text-2xl font-semibold text-ink-900 dark:text-white">Contact form submissions</h3>
      </div>

      <div className="mt-6 grid gap-4">
        {data?.length ? (
          data.map((item) => (
            <article key={item.id} className="rounded-[1.6rem] border border-white/10 bg-ink-50 p-5 dark:bg-white/5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <FiMail className="text-gold-500" />
                    <h4 className="font-heading text-xl font-semibold text-ink-900 dark:text-white">{item.subject}</h4>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.read ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-gold-400/15 text-gold-700 dark:text-gold-200'}`}>
                      {item.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-600 dark:text-white/70">From {item.name} · {item.email}</p>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-700 dark:text-white/75">{item.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => void toggleRead(item)} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink-700 dark:bg-ink-950 dark:text-white">
                    <FiCheck /> Toggle read
                  </button>
                  <button type="button" onClick={() => void removeMessage(item.id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <EmptyState title="No messages yet" description="Contact form submissions will appear here after visitors submit the public form." />
        )}
      </div>
    </section>
  );
};

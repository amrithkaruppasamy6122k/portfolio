import { useEffect, useState } from 'react';
import { Loader2, Mail, Trash2 } from 'lucide-react';
import {
  deleteContactMessage,
  fetchContactMessages,
  type StoredContactMessage,
} from '@/services/adminService';

export function AdminMessagesTab() {
  const [messages, setMessages] = useState<StoredContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchContactMessages()
      .then((rows) => {
        if (active) setMessages(rows);
      })
      .catch(() => {
        if (active) setMessages([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    await deleteContactMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  if (loading) {
    return (
      <div className="cinematic-card flex items-center justify-center rounded-2xl p-12">
        <Loader2 className="h-6 w-6 animate-spin text-ember-400" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="cinematic-card rounded-2xl p-10 text-center">
        <Mail className="mx-auto mb-3 h-7 w-7 text-ember-400" />
        <p className="font-display text-xl font-bold uppercase text-smoke-50">
          No Stored Messages Yet
        </p>
        <p className="mt-1.5 text-xs text-smoke-300">
          Messages delivered through the Contact Edge Function will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="cinematic-card rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-bold uppercase text-smoke-50">
                {msg.subject}
              </h3>
              <p className="mt-1 font-mono text-xs text-ember-300">
                {msg.full_name} &lt;{msg.email}&gt; •{' '}
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(msg.id)}
              aria-label={`Delete message from ${msg.full_name}`}
              className="rounded-lg border border-white/10 p-2 text-smoke-300 hover:border-ember-500/40 hover:text-ember-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-smoke-200">
            {msg.message}
          </p>
        </div>
      ))}
    </div>
  );
}

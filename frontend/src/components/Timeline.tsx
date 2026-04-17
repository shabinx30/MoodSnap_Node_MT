'use client';

import { deleteMood } from '@/lib/api';
import { Trash2 } from 'lucide-react';

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  angry: '😡'
};

export default function Timeline({ moods, user, onMoodDeleted }: { moods: any[], user: any, onMoodDeleted: () => void }) {
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await deleteMood(id, user.role);
      onMoodDeleted();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">
        {user.role === 'admin' ? 'Global Timeline' : 'Your Recent Moods'}
      </h2>
      
      {moods.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">No mood entries found.</p>
      ) : (
        <div className="space-y-4">
          {moods.map((m) => (
            <div key={m._id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-3xl bg-white/5 w-12 h-12 rounded-full flex items-center justify-center">
                  {MOOD_EMOJIS[m.mood] || '❓'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{m.mood}</span>
                    {user.role === 'admin' && m.userId && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                        @{m.userId.username}
                      </span>
                    )}
                  </div>
                  {m.note && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{m.note}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {user.role === 'admin' && (
                <button
                  onClick={() => handleDelete(m._id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

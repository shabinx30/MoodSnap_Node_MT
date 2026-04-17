'use client';

import { useState } from 'react';
import { createMood } from '@/lib/api';
import { Send } from 'lucide-react';

const MOODS = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'angry', emoji: '😡', label: 'Angry' },
];

export default function MoodForm({ user, onMoodAdded }: { user: any; onMoodAdded: () => void }) {
  const [selectedMood, setSelectedMood] = useState('happy');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    try {
      await createMood(user._id, user.role, selectedMood, note);
      setNote('');
      onMoodAdded();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">How are you feeling?</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-6">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setSelectedMood(m.value)}
              className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                selectedMood === m.value
                  ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'bg-black/20 border-gray-700 hover:border-gray-500'
              }`}
            >
              <span className="text-3xl mb-1">{m.emoji}</span>
              <span className="text-xs text-gray-300 font-medium">{m.label}</span>
            </button>
          ))}
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an optional note..."
            className="input-field w-full px-4 py-3 rounded-xl text-sm"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Log Mood'}
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

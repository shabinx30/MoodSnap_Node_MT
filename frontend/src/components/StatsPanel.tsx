'use client';

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  angry: '😡'
};

const MOOD_COLORS: Record<string, string> = {
  happy: 'text-green-400 bg-green-400/10',
  neutral: 'text-blue-400 bg-blue-400/10',
  sad: 'text-indigo-400 bg-indigo-400/10',
  angry: 'text-red-400 bg-red-400/10'
};

export default function StatsPanel({ stats, role }: { stats: Record<string, number>, role: string }) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">
        {role === 'admin' ? 'Global Statistics' : 'Your Stats'}
      </h2>
      
      {total === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">No data available.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(MOOD_EMOJIS).map(([mood, emoji]) => {
            const count = stats[mood] || 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const colorClass = MOOD_COLORS[mood];
            
            return (
              <div key={mood} className={`p-4 rounded-xl flex items-center justify-between ${colorClass}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="text-sm font-medium capitalize opacity-90">{mood}</p>
                    <p className="text-xs opacity-70">{count} {count === 1 ? 'entry' : 'entries'}</p>
                  </div>
                </div>
                <div className="font-bold">{percentage}%</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

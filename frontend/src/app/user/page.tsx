'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MoodForm from '@/components/MoodForm';
import Timeline from '@/components/Timeline';
import StatsPanel from '@/components/StatsPanel';
import { fetchMoods, fetchStats } from '@/lib/api';
import { LogOut } from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [moods, setMoods] = useState([]);
  const [stats, setStats] = useState({});
  const router = useRouter();

  const loadData = useCallback(async (userData: any) => {
    try {
      const [moodsData, statsData] = await Promise.all([
        fetchMoods(userData._id, userData.role),
        fetchStats(userData._id, userData.role)
      ]);
      setMoods(moodsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('moodsnap_user');
    if (!stored) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(stored);
    if (userData.role !== 'user') {
      router.push('/admin');
      return;
    }
    setUser(userData);
    loadData(userData);
  }, [router, loadData]);

  const handleLogout = () => {
    localStorage.removeItem('moodsnap_user');
    router.push('/');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user.username} 👋</h1>
          <p className="text-gray-400">Here's your personal mood tracker.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form & Stats */}
        <div className="space-y-8 lg:col-span-1">
          <MoodForm user={user} onMoodAdded={() => loadData(user)} />
          <StatsPanel stats={stats} role={user.role} />
        </div>

        {/* Right Column - Timeline */}
        <div className="lg:col-span-2">
          <Timeline moods={moods} user={user} onMoodDeleted={() => loadData(user)} />
        </div>
      </div>
    </div>
  );
}

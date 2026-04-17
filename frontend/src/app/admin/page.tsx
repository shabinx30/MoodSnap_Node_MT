'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Timeline from '@/components/Timeline';
import StatsPanel from '@/components/StatsPanel';
import { fetchMoods, fetchStats } from '@/lib/api';
import { LogOut, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [moods, setMoods] = useState<any[]>([]);
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
    if (userData.role !== 'admin') {
      router.push('/user');
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

  // Simple aggregation for total users based on unique IDs in moods
  const uniqueUsersCount = new Set(moods.filter(m => m.userId).map(m => m.userId._id)).size;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-indigo-400">Admin Dashboard 🛡️</h1>
          <p className="text-gray-400">Global mood monitoring and management.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-gray-400 mb-2">
            <Users size={20} />
            <h3 className="font-medium">Active Users</h3>
          </div>
          <p className="text-3xl font-bold">{uniqueUsersCount}</p>
        </div>
        <div className="md:col-span-2">
          <StatsPanel stats={stats} role={user.role} />
        </div>
      </div>

      <div>
        <Timeline moods={moods} user={user} onMoodDeleted={() => loadData(user)} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Timeline from "@/components/Timeline";
import StatsPanel from "@/components/StatsPanel";
import { fetchMoods, fetchStats } from "@/lib/api";

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [moods, setMoods] = useState<any[]>([]);
    const [stats, setStats] = useState({});
    const router = useRouter();

    const loadData = useCallback(async (userData: any) => {
        try {
            const [moodsData, statsData] = await Promise.all([
                fetchMoods(userData._id, userData.role),
                fetchStats(userData._id, userData.role),
            ]);
            setMoods(moodsData);
            setStats(statsData);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("moodsnap_user");
        if (!stored) {
            router.push("/");
            return;
        }
        const userData = JSON.parse(stored);
        if (userData.role !== "admin") {
            router.push("/user");
            return;
        }
        setUser(userData);
        loadData(userData);
    }, [router, loadData]);

    const handleLogout = () => {
        localStorage.removeItem("moodsnap_user");
        router.push("/");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                        style={{
                            borderColor: "var(--border)",
                            borderTopColor: "transparent",
                        }}
                    />
                    <span
                        className="text-sm"
                        style={{ color: "var(--fg-muted)" }}
                    >
                        Loading…
                    </span>
                </div>
            </div>
        );
    }

    // Unique users count
    const uniqueUsersCount = new Set(
        moods.filter((m) => m.userId).map((m) => m.userId._id),
    ).size;

    const totalEntries = moods.length;

    return (
        <div className="min-h-screen relative">
            {/* Background decorations */}
            {/* <div
                className="w-screen absolute top-0 left-0 rounded-full opacity-15 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, var(--sad-bg) 0%, transparent 70%)",
                    transform: "translate(-30%, -30%)",
                }}
            />
            <div
                className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)",
                    transform: "translate(20%, 20%)",
                }}
            /> */}

            <div className="max-w-5xl mx-auto p-5 md:p-8 relative">
                {/* Header */}
                <header className="max-w-screen flex items-center justify-between mb-10 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full"
                                style={{
                                    background: "var(--accent-soft)",
                                    color: "var(--accent)",
                                }}
                            >
                                Admin
                            </span>
                        </div>
                        <h1
                            className="text-2xl md:text-3xl font-semibold"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Dashboard
                        </h1>
                    </div>

                    <button
                        id="admin-logout"
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
                        style={{
                            border: "1px solid var(--border)",
                            color: "var(--fg-secondary)",
                            background: "var(--bg-card)",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor =
                                "var(--angry)";
                            (e.currentTarget as HTMLElement).style.color =
                                "var(--angry)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor =
                                "var(--border)";
                            (e.currentTarget as HTMLElement).style.color =
                                "var(--fg-secondary)";
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span className="hidden sm:inline">Sign out</span>
                    </button>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-2  gap-4 mb-8 animate-fade-in-up delay-1">
                    {/* Active Users */}
                    <div className="card p-5 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                style={{ background: "var(--accent-soft)" }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--accent)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <span
                                className="text-xs font-medium uppercase tracking-wider"
                                style={{ color: "var(--fg-muted)" }}
                            >
                                Users
                            </span>
                        </div>
                        <p
                            className="text-3xl font-bold tabular-nums"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {uniqueUsersCount}
                        </p>
                    </div>

                    {/* Total Entries */}
                    <div className="card p-5 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                style={{ background: "var(--happy-bg)" }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--happy)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                            </div>
                            <span
                                className="text-xs font-medium uppercase tracking-wider"
                                style={{ color: "var(--fg-muted)" }}
                            >
                                Entries
                            </span>
                        </div>
                        <p
                            className="text-3xl font-bold tabular-nums"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {totalEntries}
                        </p>
                    </div>

                    {/* Stats Panel (spans remaining) */}
                    <div className="col-span-2  animate-fade-in-up delay-2">
                        <StatsPanel stats={stats} role={user.role} />
                    </div>
                </div>

                {/* Timeline */}
                <div className="animate-fade-in-up delay-3">
                    <Timeline
                        moods={moods}
                        user={user}
                        onMoodDeleted={() => loadData(user)}
                    />
                </div>
            </div>
        </div>
    );
}

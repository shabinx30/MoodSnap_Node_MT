"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MoodForm from "@/components/MoodForm";
import Timeline from "@/components/Timeline";
import StatsPanel from "@/components/StatsPanel";
import { fetchMoods, fetchStats } from "@/lib/api";

export default function UserDashboard() {
    const [user, setUser] = useState<any>(null);
    const [moods, setMoods] = useState([]);
    const [stats, setStats] = useState({});
    const router = useRouter();

    const loadData = useCallback(async (userData: any) => {
        try {
            const [moodsData, statsData] = await Promise.all([
                fetchMoods(),
                fetchStats(),
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
        if (userData.role !== "user") {
            router.push("/admin");
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

    const currentHour = new Date().getHours();
    const greeting =
        currentHour < 12
            ? "Good morning"
            : currentHour < 17
              ? "Good afternoon"
              : "Good evening";

    return (
        <div className="min-h-screen relative">
            {/* Subtle background decoration */}
            <div
                className="absolute top-0 right-0 rounded-full opacity-20 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)",
                    transform: "translate(40%, -40%)",
                }}
            />

            <div className="max-w-5xl mx-auto p-5 md:p-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-10 animate-fade-in-up">
                    <div>
                        <p
                            className="text-sm font-medium mb-1"
                            style={{ color: "var(--fg-muted)" }}
                        >
                            {greeting} ✦
                        </p>
                        <h1
                            className="text-2xl md:text-3xl font-semibold"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {user.name}
                        </h1>
                    </div>

                    <button
                        id="user-logout"
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

                {/* Main Grid */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="animate-fade-in-up delay-1">
                            <MoodForm
                                user={user}
                                onMoodAdded={() => loadData(user)}
                            />
                        </div>
                        <div className="animate-fade-in-up delay-2">
                            <StatsPanel stats={stats} role={user.role} />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 animate-fade-in-up delay-3">
                        <Timeline
                            moods={moods}
                            user={user}
                            onMoodDeleted={() => loadData(user)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

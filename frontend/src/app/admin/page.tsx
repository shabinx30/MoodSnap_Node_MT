"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Timeline from "@/components/Timeline";
import StatsPanel from "@/components/StatsPanel";
import {
    fetchMoods,
    fetchStats,
    fetchUsers,
    updateUserRole,
    login,
    fetchTrend,
} from "@/lib/api";
import { io } from "socket.io-client";
import TrendChart from "@/components/TrendChart";

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [moods, setMoods] = useState<any[]>([]);
    const [stats, setStats] = useState({});
    const [usersList, setUsersList] = useState<any[]>([]);
    const [trendData, setTrendData] = useState<any[]>([]);
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const [moodsData, statsData, usersData, trendDataRes] =
                await Promise.all([
                    fetchMoods(),
                    fetchStats(),
                    fetchUsers(),
                    fetchTrend(),
                ]);
            setMoods(moodsData);
            setStats(statsData);
            setUsersList(usersData);
            setTrendData(trendDataRes);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("moodsnap_user");
        if (stored) {
            const userData = JSON.parse(stored);
            if (userData.role === "admin") {
                setUser(userData);
                loadData();
                setupSocket();
            }
        }
    }, [loadData]);

    const setupSocket = () => {
        const socket = io("http://localhost:5000");
        socket.on("globalStatsUpdate", (newStats) => {
            setStats(newStats);
        });
        socket.on("usersUpdated", () => {
            fetchUsers().then(setUsersList);
        });
        return () => socket.disconnect();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const loggedInUser = await login(email, password);
            if (loggedInUser.role !== "admin") {
                setError("Unauthorised - Not an admin");
                return;
            }
            localStorage.setItem("moodsnap_user", JSON.stringify(loggedInUser));
            setUser(loggedInUser);
            loadData();
            setupSocket();
        } catch {
            setError("Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("moodsnap_user");
        setUser(null);
        router.push("/");
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUserRole(userId, newRole);
            await fetchUsers().then(setUsersList);
        } catch (e) {
            console.error(e);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="card p-8 w-full max-w-[420px]">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Admin Login
                    </h2>
                    {error && (
                        <div className="text-red-500 mb-4 text-center">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field w-full px-4 py-3 mb-4"
                            placeholder="Admin Email"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field w-full px-4 py-3 mb-6"
                            placeholder="Password"
                            required
                        />
                        <button
                            disabled={isLoading}
                            className="btn-primary w-full py-3"
                        >
                            {isLoading ? "Validating..." : "Login to Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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

            <div className="flex flex-col lg:flex-row min-w-[50vw] gap-4 mb-8">
                <StatsPanel stats={stats} role={user.role} />
                <TrendChart trendData={trendData} />
            </div>

            <div className="mb-8 card p-6">
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold mb-4">
                    User Roles Management
                </h2>
                <div className="space-y-4">
                    {usersList.map((u: any) => (
                        <div
                            key={u._id}
                            className="flex justify-between items-center bg-zinc-100 dark:bg-[#2b2b2b] p-4 rounded-lg"
                        >
                            <div>
                                <p className="font-semibold">{u.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {u.email}
                                </p>
                            </div>
                            <select
                                value={u.role}
                                onChange={(e) =>
                                    handleRoleChange(u._id, e.target.value)
                                }
                                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl"
                            >
                                <option className=" dark:bg-black" value="user">User</option>
                                <option className="dark:bg-black" value="admin">Admin</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            <Timeline
                moods={moods}
                user={user}
                onMoodDeleted={() => loadData()}
            />
        </div>
    );
}

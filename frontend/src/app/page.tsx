"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { LogIn } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!username.trim()) {
            setError("Username is required");
            return;
        }

        try {
            const user = await login(username, role);
            localStorage.setItem("moodsnap_user", JSON.stringify(user));

            if (user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/user");
            }
        } catch (err: any) {
            setError("Failed to login. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="glass-panel rounded-2xl p-8 w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-500 to-indigo-500"></div>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                        <span className="text-3xl">✨</span> MoodSnap
                    </h1>
                    <p className="text-gray-400">
                        Track your daily emotional states
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Role
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole("user")}
                                className={`py-3 rounded-xl border transition-all ${
                                    role === "user"
                                        ? "bg-purple-600/20 border-purple-500 text-purple-300"
                                        : "border-gray-700 hover:border-gray-500 text-gray-400"
                                }`}
                            >
                                User
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("admin")}
                                className={`py-3 rounded-xl border transition-all ${
                                    role === "admin"
                                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                                        : "border-gray-700 hover:border-gray-500 text-gray-400"
                                }`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
                    >
                        <LogIn size={18} />
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}

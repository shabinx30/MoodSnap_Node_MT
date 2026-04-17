"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!username.trim()) {
            setError("Please enter a username to continue.");
            return;
        }

        setIsLoading(true);
        try {
            const user = await login(username, role);
            localStorage.setItem("moodsnap_user", JSON.stringify(user));

            if (user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/user");
            }
        } catch {
            setError("Unable to sign in. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)",
                    transform: "translate(30%, -30%)",
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, var(--neutral-bg) 0%, transparent 70%)",
                    transform: "translate(-30%, 30%)",
                }}
            />

            <div className="w-full max-w-[420px] animate-scale-in">
                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <div
                        className="inline-flex items-center bg-[#f0d9cc] dark:bg-[#36302d] justify-center w-16 h-16 rounded-full mb-5 animate-fade-in-up"
                    >
                        <span className="text-2xl">🌿</span>
                    </div>
                    <h1
                        className="text-4xl font-semibold mb-2 animate-fade-in-up delay-1"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        MoodSnap
                    </h1>
                    <p
                        className="animate-fade-in-up delay-2"
                        style={{
                            color: "var(--fg-secondary)",
                            fontSize: "1.05rem",
                        }}
                    >
                        Your daily emotional journal
                    </p>
                </div>

                {/* Card */}
                <div className="card p-8 animate-fade-in-up delay-3">
                    {error && (
                        <div
                            className="mb-6 p-3 rounded-xl text-sm animate-fade-in"
                            style={{
                                background: "var(--angry-bg)",
                                color: "var(--angry)",
                                border: "1px solid rgba(194, 123, 123, 0.2)",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Username */}
                        <div className="mb-6">
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--fg-secondary)" }}
                            >
                                Username
                            </label>
                            <input
                                id="login-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field w-full px-4 py-3"
                                placeholder="e.g. river_stone"
                            />
                        </div>

                        {/* Role Selector */}
                        <div className="mb-8">
                            <label
                                className="block text-sm font-medium mb-3"
                                style={{ color: "var(--fg-secondary)" }}
                            >
                                I'm signing in as
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    id="role-user"
                                    type="button"
                                    onClick={() => setRole("user")}
                                    className="relative py-3.5 rounded-xl border-2 transition-all duration-300 cursor-pointer text-sm font-medium"
                                    style={{
                                        borderColor:
                                            role === "user"
                                                ? "var(--accent)"
                                                : "var(--border)",
                                        background:
                                            role === "user"
                                                ? "var(--accent-glow)"
                                                : "transparent",
                                        color:
                                            role === "user"
                                                ? "var(--accent)"
                                                : "var(--fg-secondary)",
                                    }}
                                >
                                    <span className="mr-1.5">🧑</span> User
                                </button>
                                <button
                                    id="role-admin"
                                    type="button"
                                    onClick={() => setRole("admin")}
                                    className="relative py-3.5 rounded-xl border-2 transition-all duration-300 cursor-pointer text-sm font-medium"
                                    style={{
                                        borderColor:
                                            role === "admin"
                                                ? "var(--accent)"
                                                : "var(--border)",
                                        background:
                                            role === "admin"
                                                ? "var(--accent-glow)"
                                                : "transparent",
                                        color:
                                            role === "admin"
                                                ? "var(--accent)"
                                                : "var(--fg-secondary)",
                                    }}
                                >
                                    <span className="mr-1.5">🛡️</span> Admin
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeDasharray="32"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    Signing in…
                                </span>
                            ) : (
                                <>
                                    Continue
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p
                    className="text-center mt-6 text-xs animate-fade-in-up delay-5"
                    style={{ color: "var(--fg-muted)" }}
                >
                    Mindful tracking for a clearer mind ✦
                </p>
            </div>
        </div>
    );
}

"use client";

import { deleteMood } from "@/lib/api";

const MOOD_META: Record<string, { emoji: string; color: string; bg: string }> =
    {
        happy: { emoji: "😊", color: "var(--happy)", bg: "var(--happy-bg)" },
        neutral: {
            emoji: "😌",
            color: "var(--neutral)",
            bg: "var(--neutral-bg)",
        },
        sad: { emoji: "😔", color: "var(--sad)", bg: "var(--sad-bg)" },
        angry: { emoji: "😤", color: "var(--angry)", bg: "var(--angry-bg)" },
    };

function formatRelativeTime(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Timeline({
    moods,
    user,
    onMoodDeleted,
}: {
    moods: any[];
    user: any;
    onMoodDeleted: () => void;
}) {
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this entry?")) return;
        try {
            await deleteMood(id, user.role);
            onMoodDeleted();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
                <h2
                    className="text-lg font-semibold"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    {user.role === "admin"
                        ? "Global Timeline"
                        : "Recent Entries"}
                </h2>
                {moods.length > 0 && (
                    <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                            background: "var(--bg-secondary)",
                            color: "var(--fg-muted)",
                        }}
                    >
                        {moods.length}{" "}
                        {moods.length === 1 ? "entry" : "entries"}
                    </span>
                )}
            </div>

            {moods.length === 0 ? (
                <div className="text-center py-12">
                    <span className="text-4xl mb-3 block">🌱</span>
                    <p
                        className="text-sm font-medium mb-1"
                        style={{ color: "var(--fg-secondary)" }}
                    >
                        No entries yet
                    </p>
                    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                        {user.role === "admin"
                            ? "Mood entries from all users will appear here."
                            : "Start logging your mood to see entries here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {moods.map((m, idx) => {
                        const meta = MOOD_META[m.mood] || {
                            emoji: "❓",
                            color: "var(--fg-muted)",
                            bg: "var(--bg-secondary)",
                        };

                        return (
                            <div
                                key={m._id}
                                className="flex items-start gap-3.5 p-3.5 rounded-xl transition-all duration-300 group animate-fade-in-up"
                                style={{
                                    background: "var(--bg-primary)",
                                    border: "1px solid var(--border)",
                                    animationDelay: `${Math.min(idx * 0.04, 0.4)}s`,
                                }}
                                onMouseEnter={(e) => {
                                    (
                                        e.currentTarget as HTMLElement
                                    ).style.borderColor = "var(--border-hover)";
                                }}
                                onMouseLeave={(e) => {
                                    (
                                        e.currentTarget as HTMLElement
                                    ).style.borderColor = "var(--border)";
                                }}
                            >
                                {/* Mood Emoji */}
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: meta.bg }}
                                >
                                    {meta.emoji}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span
                                            className="text-sm font-semibold capitalize"
                                            style={{ color: meta.color }}
                                        >
                                            {m.mood}
                                        </span>
                                        {user.role === "admin" && m.userId && (
                                            <span
                                                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                style={{
                                                    background:
                                                        "var(--accent-soft)",
                                                    color: "var(--accent)",
                                                }}
                                            >
                                                @{m.userId.username}
                                            </span>
                                        )}
                                        <span
                                            className="text-[11px] ml-auto shrink-0"
                                            style={{ color: "var(--fg-muted)" }}
                                        >
                                            {formatRelativeTime(m.createdAt)}
                                        </span>
                                    </div>

                                    {m.note && (
                                        <p
                                            className="text-sm leading-relaxed line-clamp-2"
                                            style={{
                                                color: "var(--fg-secondary)",
                                            }}
                                        >
                                            {m.note}
                                        </p>
                                    )}
                                </div>

                                {/* Delete (Admin) */}
                                {user.role === "admin" && (
                                    <button
                                        onClick={() => handleDelete(m._id)}
                                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shrink-0"
                                        style={{
                                            color: "var(--fg-muted)",
                                        }}
                                        onMouseEnter={(e) => {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.color = "var(--angry)";
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background =
                                                "var(--angry-bg)";
                                        }}
                                        onMouseLeave={(e) => {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.color = "var(--fg-muted)";
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background = "transparent";
                                        }}
                                        title="Delete entry"
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
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

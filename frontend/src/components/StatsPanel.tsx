"use client";

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

export default function StatsPanel({
    stats,
    role,
}: {
    stats: Record<string, number>;
    role: string;
}) {
    const total = Object.values(stats).reduce((a, b) => a + b, 0);

    return (
        <div className="card p-6 flex-1">
            <h2
                className="text-lg font-semibold mb-5"
                style={{ fontFamily: "var(--font-display)" }}
            >
                {role === "admin" ? "Global Statistics" : "Your Stats"}
            </h2>

            {total === 0 ? (
                <div className="text-center py-8">
                    <span className="text-3xl mb-3 block">📊</span>
                    <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                        No data available yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {Object.entries(MOOD_META).map(([mood, meta]) => {
                        const count = stats[mood] || 0;
                        const percentage =
                            total > 0 ? Math.round((count / total) * 100) : 0;

                        return (
                            <div
                                key={mood}
                                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group"
                                style={{
                                    background:
                                        count > 0 ? meta.bg : "transparent",
                                }}
                            >
                                {/* Emoji */}
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                                    style={{
                                        background:
                                            count > 0
                                                ? `${meta.color}18`
                                                : "var(--bg-secondary)",
                                    }}
                                >
                                    {meta.emoji}
                                </div>

                                {/* Info + Bar */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span
                                            className="text-sm font-medium capitalize"
                                            style={{
                                                color:
                                                    count > 0
                                                        ? meta.color
                                                        : "var(--fg-muted)",
                                            }}
                                        >
                                            {mood}
                                        </span>
                                        <span
                                            className="text-xs font-medium tabular-nums"
                                            style={{ color: "var(--fg-muted)" }}
                                        >
                                            {count} · {percentage}%
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div
                                        className="h-1.5 rounded-full overflow-hidden"
                                        style={{
                                            background: "var(--bg-secondary)",
                                        }}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all duration-700 ease-out"
                                            style={{
                                                width: `${percentage}%`,
                                                background: meta.color,
                                                opacity: count > 0 ? 1 : 0.3,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Total */}
                    <div
                        className="pt-3 mt-2 flex items-center justify-between text-xs font-medium"
                        style={{
                            borderTop: "1px solid var(--border)",
                            color: "var(--fg-muted)",
                        }}
                    >
                        <span>Total entries</span>
                        <span className="tabular-nums">{total}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

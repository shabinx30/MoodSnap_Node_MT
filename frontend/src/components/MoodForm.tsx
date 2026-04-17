"use client";

import { useState } from "react";
import { createMood } from "@/lib/api";

const MOODS = [
    {
        value: "happy",
        emoji: "😊",
        label: "Happy",
        color: "var(--happy)",
        bg: "var(--happy-bg)",
    },
    {
        value: "neutral",
        emoji: "😌",
        label: "Neutral",
        color: "var(--neutral)",
        bg: "var(--neutral-bg)",
    },
    {
        value: "sad",
        emoji: "😔",
        label: "Sad",
        color: "var(--sad)",
        bg: "var(--sad-bg)",
    },
    {
        value: "angry",
        emoji: "😤",
        label: "Angry",
        color: "var(--angry)",
        bg: "var(--angry-bg)",
    },
];

export default function MoodForm({
    user,
    onMoodAdded,
}: {
    user: any;
    onMoodAdded: () => void;
}) {
    const [selectedMood, setSelectedMood] = useState("happy");
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMood) return;

        setIsSubmitting(true);
        try {
            await createMood(selectedMood, note);
            setNote("");
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
            onMoodAdded();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeMood = MOODS.find((m) => m.value === selectedMood);

    return (
        <div className="card p-6 relative overflow-hidden">
            {/* Decorative accent line */}
            <div
                className="absolute top-0 left-0 h-1 transition-all duration-500 ease-out"
                style={{
                    width: "100%",
                    background: `linear-gradient(90deg, ${activeMood?.color || "var(--accent)"}, transparent)`,
                    opacity: 0.6,
                    borderRadius: "0 0 4px 0",
                }}
            />

            <h2
                className="text-lg font-semibold mb-5"
                style={{ fontFamily: "var(--font-display)" }}
            >
                How are you feeling?
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Mood Selector */}
                <div className="grid grid-cols-4 gap-2.5 mb-5">
                    {MOODS.map((m) => (
                        <button
                            key={m.value}
                            type="button"
                            onClick={() => setSelectedMood(m.value)}
                            className="flex flex-col items-center justify-center py-3.5 px-5 rounded-xl border-2 transition-all duration-300 cursor-pointer group"
                            style={{
                                borderColor:
                                    selectedMood === m.value
                                        ? m.color
                                        : "var(--border)",
                                background:
                                    selectedMood === m.value
                                        ? m.bg
                                        : "transparent",
                                transform:
                                    selectedMood === m.value
                                        ? "translateY(-2px)"
                                        : "translateY(0)",
                                boxShadow:
                                    selectedMood === m.value
                                        ? `0 4px 12px ${m.color}25`
                                        : "none",
                            }}
                        >
                            <span
                                className="text-2xl mb-1 transition-transform duration-300"
                                style={{
                                    transform:
                                        selectedMood === m.value
                                            ? "scale(1.15)"
                                            : "scale(1)",
                                }}
                            >
                                {m.emoji}
                            </span>
                            <span
                                className="text-[11px] font-medium transition-colors duration-200"
                                style={{
                                    color:
                                        selectedMood === m.value
                                            ? m.color
                                            : "var(--fg-muted)",
                                }}
                            >
                                {m.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Note Input */}
                <div className="mb-5">
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What's on your mind? (optional)"
                        rows={3}
                        className="input-field w-full px-4 py-3 resize-none text-sm"
                        style={{ lineHeight: "1.6" }}
                    />
                </div>

                {/* Submit */}
                <button
                    id="mood-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
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
                            Saving…
                        </span>
                    ) : showSuccess ? (
                        <span className="flex items-center gap-2">
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
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Saved!
                        </span>
                    ) : (
                        <>
                            Log Mood
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
                                <path d="M12 5v14M5 12l7 7 7-7" />
                            </svg>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

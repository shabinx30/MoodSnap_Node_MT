"use client";

import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Smile, Frown, Meh, Angry } from "lucide-react";

interface MoodTrendItem {
    _id: {
        date: string;
        mood: string;
    };
    count: number;
}

interface FormattedMoodData {
    date: string;
    happy?: number;
    sad?: number;
    neutral?: number;
    angry?: number;
    [key: string]: string | number | undefined;
}

const CustomTooltip = ({
    active,
    payload,
    label,
}: any) => {
    if (active && payload && payload.length && label) {
        return (
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-[--border] p-4 rounded-2xl shadow-xl animate-scale-in">
                <p className="text-[--fg-secondary] font-medium mb-3 text-sm">
                    {new Date(label).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                    })}
                </p>
                <div className="space-y-2">
                    {payload.map(
                        (
                            entry: {
                                name: string;
                                value: string;
                                color: string;
                            },
                            index: number,
                        ) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-xs font-semibold capitalize text-[--fg-primary]">
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-[--fg-primary]">
                                    {entry.value}
                                </span>
                            </div>
                        ),
                    )}
                </div>
            </div>
        );
    }
    return null;
};

const CustomLegend = ({
    activeMood,
    setActiveMood,
}: {
    activeMood: string | null;
    setActiveMood: (mood: string | null) => void;
}) => {
    const items = [
        { key: "happy", icon: Smile, color: "var(--happy)", label: "Joyful" },
        {
            key: "neutral",
            icon: Meh,
            color: "var(--neutral)",
            label: "Balanced",
        },
        { key: "sad", icon: Frown, color: "var(--sad)", label: "Reflective" },
        { key: "angry", icon: Angry, color: "var(--angry)", label: "Intense" },
    ];

    return (
        <div className="flex flex-wrap gap-2 mt-8 justify-center">
            {items.map((item) => (
                <button
                    key={item.key}
                    onClick={() =>
                        setActiveMood(activeMood === item.key ? null : item.key)
                    }
                    className={`flex items-center gap-2 px-2 py-1 rounded-full border transition-all duration-300 ${
                        activeMood === item.key
                            ? "border-[var(--accent)] bg-[--bg-secondary] shadow-sm translate-y-[-2px]"
                            : "border-[var(--border)] bg-white/50 dark:bg-[#2b2b2b] dark:hover:bg-[#3b3b3b] hover:bg-white hover:border-[var(--border-hover)]"
                    }`}
                >
                    <item.icon size={16} style={{ color: item.color }} />
                    <span className="text-xs font-semibold text-[var(--fg-primary)]">
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default function TrendChart({
    trendData,
}: {
    trendData: MoodTrendItem[];
}) {
    const [activeMood, setActiveMood] = useState<string | null>(null);

    if (!trendData || trendData.length === 0) return null;

    const formattedData: Record<string, FormattedMoodData> = {};
    trendData.forEach((item) => {
        const date = item._id.date;
        const mood = item._id.mood;
        if (!formattedData[date]) {
            formattedData[date] = { date };
        }
        formattedData[date][mood] = item.count;
    });

    const data = Object.values(formattedData).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const moods = [
        { key: "happy", color: "var(--happy)" },
        { key: "neutral", color: "var(--neutral)" },
        { key: "sad", color: "var(--sad)" },
        { key: "angry", color: "var(--angry)" },
    ];

    return (
        <div className="card flex-1 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-glow)] rounded-full -mr-16 -mt-18 blur-3xl opacity-50 transition-opacity group-hover:opacity-80" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2
                        style={{ fontFamily: "var(--font-display)" }}
                        className="text-xl mb-2 font-display font-bold text-[var(--fg-primary)]"
                    >
                        Emotional Flow
                    </h2>
                    <p className="text-sm text-[var(--fg-secondary)] mt-1">
                        Visualize your mood patterns over time
                    </p>
                </div>
            </div>

            <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                        <defs>
                            {moods.map((mood) => (
                                <linearGradient
                                    key={mood.key}
                                    id={`color-${mood.key}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={mood.color}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={mood.color}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="4 4"
                            stroke="var(--border)"
                            opacity={0.5}
                        />

                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "var(--fg-muted)",
                                fontSize: 11,
                                fontWeight: 500,
                            }}
                            tickFormatter={(str) => {
                                try {
                                    const date = new Date(str);
                                    if (isNaN(date.getTime())) return str;
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    });
                                } catch (e) {
                                    return str;
                                }
                            }}
                            dy={10}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={40}
                            tick={{
                                fill: "var(--fg-muted)",
                                fontSize: 11,
                                fontWeight: 500,
                            }}
                        />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                stroke: "var(--accent)",
                                strokeWidth: 1,
                                strokeDasharray: "4 4",
                            }}
                        />

                        {moods.map((mood) => (
                            <Area
                                key={mood.key}
                                type="monotone"
                                dataKey={mood.key}
                                stroke={mood.color}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill={`url(#color-${mood.key})`}
                                activeDot={{
                                    r: 6,
                                    strokeWidth: 0,
                                    fill: mood.color,
                                }}
                                hide={
                                    activeMood !== null &&
                                    activeMood !== mood.key
                                }
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <CustomLegend
                activeMood={activeMood}
                setActiveMood={setActiveMood}
            />
        </div>
    );
}

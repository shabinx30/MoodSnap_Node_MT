const API_BASE = "http://localhost:5000/api";

export const login = async (username: string, role: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, role }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
};

export const fetchMoods = async (userId: string, role: string) => {
    const url = `${API_BASE}/moods?userId=${userId}&role=${role}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch moods");
    return res.json();
};

export const createMood = async (
    userId: string,
    role: string,
    mood: string,
    note: string,
) => {
    const res = await fetch(`${API_BASE}/moods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role, mood, note }),
    });
    if (!res.ok) throw new Error("Failed to create mood");
    return res.json();
};

export const deleteMood = async (id: string, role: string) => {
    const res = await fetch(`${API_BASE}/moods/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error("Failed to delete mood");
    return res.json();
};

export const fetchStats = async (userId: string, role: string) => {
    const url = `${API_BASE}/stats?userId=${userId}&role=${role}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
};

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export const registerUser = async (
    name: string,
    email: string,
    password: string,
) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
};

export const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
};

const getAuthHeaders = () => {
    const stored = localStorage.getItem("moodsnap_user");
    if (stored) {
        const { accessToken } = JSON.parse(stored);
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        };
    }
    return { "Content-Type": "application/json" };
};

export const fetchMoods = async () => {
    const res = await fetch(`${API_BASE}/moods`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Failed to fetch moods");
    return res.json();
};

export const createMood = async (mood: string, note: string) => {
    const res = await fetch(`${API_BASE}/moods`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ mood, note }),
    });
    if (!res.ok) throw new Error("Failed to create mood");
    return res.json();
};

export const deleteMood = async (id: string) => {
    const res = await fetch(`${API_BASE}/moods/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete mood");
    return res.json();
};

export const fetchStats = async () => {
    const res = await fetch(`${API_BASE}/moods/stats`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
};

export const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
};

export const fetchTrend = async () => {
    const res = await fetch(`${API_BASE}/moods/trend`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch trend");
    return res.json();
};

export const updateUserRole = async (id: string, role: string) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error("Failed to update role");
    return res.json();
};

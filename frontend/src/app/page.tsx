"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, registerUser } from "@/lib/api";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            let userData;
            if (isLogin) {
                userData = await login(email, password);
            } else {
                userData = await registerUser(name, email, password);
            }
            
            localStorage.setItem("moodsnap_user", JSON.stringify(userData));
            
            if (userData.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/user");
            }
        } catch {
            setError(isLogin ? "Invalid credentials" : "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="w-full max-w-[420px]">
                <div className="flex flex-col justify-center items-center text-center mb-8">
                    <span className="p-4 w-fit bg-[#f0d9cc] dark:bg-[#37312e] text-3xl rounded-full mb-4">🌿</span>
                    <h1 className="text-4xl font-semibold">MoodSnap</h1>
                    <p className="text-gray-500">Your daily emotional journal</p>
                </div>

                <div className="card p-8 bg-white border shadow-sm rounded-2xl">
                    <div className="flex gap-4 mb-6 border-b pb-2">
                        <button 
                            className={`flex-1 text-center pb-2 font-medium ${isLogin ? 'border-b-2 border-black' : 'text-gray-400'}`}
                            onClick={() => setIsLogin(true)}
                            type="button"
                        >
                            Log In
                        </button>
                        <button 
                            className={`flex-1 text-center pb-2 font-medium ${!isLogin ? 'border-b-2 border-black' : 'text-gray-400'}`}
                            onClick={() => setIsLogin(false)}
                            type="button"
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black dark:text-white">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl"
                                    required={!isLogin}
                                    placeholder="Enter your Name"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl"
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl"
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        <button disabled={isLoading} className="w-full py-3 bg-black text-white rounded-xl font-medium mt-4">
                            {isLoading ? "Please wait..." : (isLogin ? "Log In" : "Sign Up")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

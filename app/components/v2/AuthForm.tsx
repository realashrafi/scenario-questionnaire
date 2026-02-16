// components/AuthForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
    const router = useRouter();
    const [isSignup, setIsSignup] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ name: "", phone: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
        const body = isSignup ? form : { phone: form.phone, password: form.password };

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "خطایی رخ داد");

            localStorage.setItem("token", data.token);
            window.location.reload();
            router.push("/");
        } catch (err: any) {
            setError(err.message || "مشکلی پیش آمد");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 z-50 bg-[#13294B]/20 rounded-xl border border-[#1E3A6D] shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
                {isSignup ? "ثبت‌نام" : "ورود"}
            </h2>

            {error && <p className="text-red-400 text-center mb-6">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
                {isSignup && (
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">نام</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#0A1F44]/20 border border-[#1E3A6D] rounded-lg text-white focus:border-[#FF6B00] focus:outline-none"
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm text-gray-300 mb-2">شماره تلفن</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A1F44]/20 border border-[#1E3A6D] rounded-lg text-white focus:border-[#FF6B00] focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-2">رمز عبور</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A1F44]/20 border border-[#1E3A6D] rounded-lg text-white focus:border-[#FF6B00] focus:outline-none"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        loading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-[#FF6B00] hover:bg-[#ff8533] text-white"
                    }`}
                >
                    {loading ? "در حال انجام..." : isSignup ? "ثبت‌نام" : "ورود"}
                </button>
            </form>

            <p className="mt-6 text-center text-gray-400 text-sm">
                {isSignup ? "حساب دارید؟" : "حساب ندارید؟"}{" "}
                <button
                    type="button"
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-[#FF6B00] hover:underline"
                >
                    {isSignup ? "ورود" : "ثبت‌نام"}
                </button>
            </p>
        </div>
    );
}
// app/components/v2/OfferTab.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Suggestion = {
    id: string;
    suggestion: string;
    createdAt: string;
};

export default function OfferTab() {
    const [suggestion, setSuggestion] = useState("");
    const [previousSuggestions, setPreviousSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingPrevious, setFetchingPrevious] = useState(true);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    // لود پیشنهادهای قبلی
    useEffect(() => {
        const fetchPrevious = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch("/api/suggestions", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("خطا در دریافت");

                const data = await res.json();
                if (data.success) {
                    setPreviousSuggestions(data.suggestions || []);
                }
            } catch (err) {
                console.error("خطا در لود پیشنهادهای قبلی:", err);
            } finally {
                setFetchingPrevious(false);
            }
        };

        fetchPrevious();
    }, []);

    const handleSubmit = async () => {
        if (!suggestion.trim()) {
            setStatus("error");
            setMessage("لطفاً متن پیشنهاد را وارد کنید");
            return;
        }

        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("توکن یافت نشد");

            const res = await fetch("/api/suggestions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ suggestion: suggestion.trim() }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "خطا در ارسال");
            }

            setStatus("success");
            setMessage("پیشنهاد شما با موفقیت ثبت شد.");
            setSuggestion("");

            // اضافه کردن به لیست قبلی (بدون نیاز به refetch کامل)
            const newSuggestion: Suggestion = {
                id: data.insertedId || Date.now().toString(),
                suggestion: suggestion.trim(),
                createdAt: new Date().toISOString(),
            };
            setPreviousSuggestions((prev) => [newSuggestion, ...prev]);
        } catch (err: any) {
            console.error("خطا:", err);
            setStatus("error");
            setMessage(err.message || "خطای سرور. لطفاً دوباره امتحان کنید.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8 md:py-12 px-4">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-100"
            >
                پیشنهاد، انتقاد یا ایده شما
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center text-gray-400 mb-8 max-w-2xl mx-auto"
            >
                نظرات شما به بهبود پروژه کمک می‌کند.
            </motion.p>

            {/* بخش ثبت پیشنهاد جدید */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-3xl mx-auto bg-[#13294B]/30 border border-[#1E3A6D] rounded-xl p-6 md:p-8 mb-12 shadow-xl backdrop-blur-sm"
            >
        <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="پیشنهاد یا ایده خود را اینجا بنویسید..."
            rows={7}
            className="
            w-full bg-[#0A1F44]/60 text-gray-100 placeholder-gray-500
            border border-[#1E3A6D]/70 rounded-lg p-4 text-base
            focus:outline-none focus:border-[#FF6B00]/60
            resize-none
          "
            disabled={loading}
        />

                <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                        {suggestion.trim().length} کاراکتر
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSubmit}
                        disabled={loading || !suggestion.trim()}
                        className={`
              px-10 py-3 font-semibold rounded-xl text-white
              ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"}
            `}
                    >
                        {loading ? "در حال ارسال..." : "ارسال پیشنهاد"}
                    </motion.button>
                </div>

                {status !== "idle" && (
                    <div
                        className={`mt-5 p-4 rounded-lg text-center text-sm ${
                            status === "success" ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"
                        }`}
                    >
                        {message}
                    </div>
                )}
            </motion.div>

            {/* بخش پیشنهادهای قبلی */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                <h2 className="text-xl font-semibold mb-5 text-gray-200 text-center md:text-left">
                    پیشنهادهای قبلی شما
                </h2>

                {fetchingPrevious ? (
                    <div className="text-center text-gray-500 py-8">در حال بارگذاری...</div>
                ) : previousSuggestions.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 bg-[#13294B]/20 rounded-xl border border-[#1E3A6D]/50">
                        هنوز پیشنهادی ثبت نکرده‌اید.
                    </div>
                ) : (
                    <div className="space-y-5">
                        {previousSuggestions.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#0A1F44]/60 border border-[#1E3A6D]/60 rounded-lg p-5 shadow-sm"
                            >
                                <div className="text-sm text-gray-500 mb-2">
                                    {new Date(item.createdAt).toLocaleString("fa-IR", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </div>
                                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                                    {item.suggestion}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
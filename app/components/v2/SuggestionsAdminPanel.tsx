// app/components/v2/SuggestionsAdminPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type SuggestionItem = {
    id: string;
    suggestion: string;
    createdAt: string;
    userId: string;
    userName: string;
    userPhone: string;
};

export default function SuggestionsAdminPanel() {
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/all-suggestions");
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "خطا در بارگذاری پیشنهادها");
            }

            const data = await res.json();
            setSuggestions(data.suggestions || []);
        } catch (err: any) {
            setError(err.message || "ناتوان در بارگذاری لیست پیشنهادها");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen flex items-start justify-center px-4 sm:px-6 py-8 sm:py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
          w-full max-w-2xl lg:max-w-5xl
          bg-[#13294B]/40 backdrop-blur-md
          border border-[#1E3A6D]/60 rounded-2xl
          p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/30
        "
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-100 mb-8 sm:mb-10">
                    مدیریت پیشنهادهای کاربران
                </h1>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8 p-4 rounded-xl text-center bg-red-900/50 border border-red-600/50 text-red-200"
                    >
                        {error}
                    </motion.div>
                )}

                {loading ? (
                    <div className="text-center text-gray-400 py-12 text-lg">
                        در حال بارگذاری پیشنهادها...
                    </div>
                ) : suggestions.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 text-lg">
                        هنوز هیچ پیشنهادی ثبت نشده است
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-right text-gray-300 mb-3">
                            تعداد کل: <span className="font-bold">{suggestions.length}</span>
                        </div>

                        {suggestions.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="
                  bg-[#1A3560]/40 border border-[#2A4A80]/50 rounded-xl p-5
                  hover:bg-[#1E3A6D]/30 transition-colors
                "
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex-1">
                                        <div className="text-gray-100 text-base sm:text-lg font-medium mb-2 whitespace-pre-wrap">
                                            {item.suggestion}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
                                            <div>
                                                کاربر: <span className="text-gray-100">{item.userName}</span>
                                            </div>
                                            <div>
                                                شماره: <span className="font-mono text-gray-100">{item.userPhone}</span>
                                            </div>
                                            <div>
                                                شناسه کاربر:{" "}
                                                <span className="font-mono text-gray-400 text-xs">{item.userId}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-400 whitespace-nowrap self-start sm:self-center">
                                        {formatDate(item.createdAt)}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-10 text-center text-sm gap-2 flex items-center justify-center text-gray-400">
                    <Link href="/" className="text-[#FF6B00] hover:underline">
                        بازگشت
                    </Link>
                    {" • "}
                    <button
                        onClick={loadSuggestions}
                        className="text-[#FF6B00] hover:underline"
                        disabled={loading}
                    >
                        {loading ? "در حال بارگذاری..." : "تازه‌سازی لیست"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
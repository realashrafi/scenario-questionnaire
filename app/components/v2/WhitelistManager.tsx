// app/components/v2/WhitelistManager.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type WhitelistItem = {
    _id: string;
    phone: string;
    name?: string | null;
    addedAt: string;
    active: boolean;
};

export default function WhitelistManager() {
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [list, setList] = useState<WhitelistItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchList();
    }, []);

    const fetchList = async () => {
        setFetching(true);
        try {
            const res = await fetch("/api/whitelist");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "خطا در بارگذاری");
            setList(data.data || []);
        } catch (err: any) {
            setMessage("ناتوان در بارگذاری لیست");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("idle");
        setMessage("");
        setLoading(true);

        if (!phone.trim()) {
            setStatus("error");
            setMessage("شماره تلفن الزامی است");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/whitelist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone.trim(), name: name.trim() || undefined }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "خطا در افزودن");

            setStatus("success");
            setMessage(`شماره ${phone} اضافه شد`);
            setPhone("");
            setName("");
            fetchList();
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "خطا رخ داد");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, phone: string) => {
        if (!confirm(`آیا مطمئن هستید که می‌خواهید شماره ${phone} را حذف کنید؟`)) {
            return;
        }

        try {
            const res = await fetch(`/api/whitelist?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'خطا در حذف');
            }

            setStatus("success");
            setMessage(`شماره ${phone} با موفقیت حذف شد`);
            fetchList(); // بروزرسانی لیست
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "خطا در حذف آیتم");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A1F44] flex items-start justify-center px-4 sm:px-6 py-8 sm:py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
          w-full max-w-2xl lg:max-w-4xl
          bg-[#13294B]/40 backdrop-blur-md
          border border-[#1E3A6D]/60 rounded-2xl
          p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/30
        "
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-100 mb-8 sm:mb-10">
                    مدیریت وایت‌لیست
                </h1>

                {/* فرم */}
                <form onSubmit={handleSubmit} className="space-y-6 mb-10 sm:mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                شماره تلفن <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="0912xxxxxxx"
                                dir="ltr"
                                className="
                  w-full px-4 py-3.5 text-base
                  bg-[#0A1F44]/70 border border-[#1E3A6D]/70 rounded-lg
                  text-gray-100 placeholder-gray-500
                  focus:outline-none focus:border-[#FF6B00]/60 focus:ring-2 focus:ring-[#FF6B00]/20
                "
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">نام</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="اختیاری"
                                className="
                  w-full px-4 py-3.5 text-base
                  bg-[#0A1F44]/70 border border-[#1E3A6D]/70 rounded-lg
                  text-gray-100 placeholder-gray-500
                  focus:outline-none focus:border-[#FF6B00]/60 focus:ring-2 focus:ring-[#FF6B00]/20
                "
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className={`
              w-full py-3.5 sm:py-4 text-base font-medium rounded-xl text-white
              transition-all
              ${loading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#FF6B00] to-orange-600 hover:brightness-110 shadow-lg"
                        }
            `}
                    >
                        {loading ? "در حال افزودن..." : "افزودن شماره"}
                    </motion.button>
                </form>

                {status !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`mb-8 p-4 rounded-xl text-center text-sm sm:text-base ${
                            status === "success"
                                ? "bg-green-900/50 border border-green-600/50 text-green-200"
                                : "bg-red-900/50 border border-red-600/50 text-red-200"
                        }`}
                    >
                        {message}
                    </motion.div>
                )}

                {/* لیست */}
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-200 mb-4">
                        لیست فعلی ({list.length})
                    </h2>

                    {fetching ? (
                        <p className="text-center text-gray-400 py-8">در حال بارگذاری...</p>
                    ) : list.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">هنوز موردی ثبت نشده است</p>
                    ) : (
                        <div className="space-y-4">
                            {list.map((item) => (
                                <div
                                    key={item._id}
                                    className="
            bg-[#1A3560]/40 border border-[#2A4A80]/50 rounded-xl p-4 sm:p-5
            hover:bg-[#1E3A6D]/30 transition-colors flex flex-col sm:flex-row
            sm:items-center sm:justify-between gap-4
          "
                                >
                                    <div className="flex-1">
                                        <div className="font-mono text-base sm:text-lg mb-1">{item.phone}</div>
                                        <div className="text-gray-300 text-sm">{item.name || "—"}</div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-gray-400">
                                            {new Date(item.addedAt).toLocaleDateString("fa-IR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                item.active
                                                    ? "bg-green-800/60 text-green-200"
                                                    : "bg-red-800/60 text-red-200"
                                            }`}
                                        >
              {item.active ? "فعال" : "غیرفعال"}
            </span>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDelete(item._id, item.phone)}
                                            className="bg-red-700/70 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
                                            title="حذف این شماره"
                                        >
                                            حذف
                                        </motion.button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-10 text-center text-sm text-gray-400">
                    <Link href="/" className="text-[#FF6B00] hover:underline">
                        بازگشت
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
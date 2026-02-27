"use client";

import { useState, useEffect } from "react";
import NestedAccordion from "@/app/components/v2/NestedAccordion";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/app/components/v2/Loading";

type Question = {
    title: string;
    period?: string;
    QS?: { [key: string]: Question }[];
};

type Scenario = {
    id: string;
    title: string;
    period: string;
    root: Question;
};

type UserSummary = {
    userId: string;
    name: string;
    phone: string;
    registeredAt: string | null;
    lastActive: string | null;
    progress: number;
    startedScenarios: number;
};

export default function AdminDashboard() {
    const [token, setToken] = useState<string | null>(null);
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
    const [probabilities, setProbabilities] = useState<Record<string, number>>({});
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");

    // لود توکن + سناریوها
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            setError("توکن یافت نشد. لطفاً با حساب ادمین لاگین کنید.");
            setLoading(false);
            return;
        }

        fetch("/questions.json")
            .then((r) => {
                if (!r.ok) throw new Error(`خطا در لود داده‌ها - ${r.status}`);
                return r.json();
            })
            .then((data) => setScenarios(data.scenarios || []))
            .catch((err) => {
                console.error(err);
                setError(err.message || "خطا در بارگذاری ساختار سوالات");
            });
    }, []);

    // لود لیست کاربران
    useEffect(() => {
        if (!token) return;

        const loadUsers = async () => {
            try {
                const res = await fetch("/api/admin/users-summary", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.error || "خطا در بارگذاری کاربران");
                }

                setUsers(data.users || []);
            } catch (err: any) {
                setError(err.message || "خطای ناشناخته");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [token]);

    // لود پاسخ‌های یک کاربر
    const loadUserResponses = async (userId: string) => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/probabilities/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error(`خطا ${res.status}`);

            const data = await res.json();

            if (data.success) {
                setProbabilities(data.probabilities || {});
                setSelectedUser(users.find((u) => u.userId === userId) || null);
            } else {
                setError(data.message || "داده‌ای یافت نشد");
            }
        } catch (err: any) {
            setError(err.message || "خطا در بارگذاری پاسخ‌ها");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh]  border border-blue-500/10 bg-blue-500/5 rounded-md backdrop-blur-xl flex items-center justify-center text-white">
                <Loading />
                <span className="ml-4">در حال بارگذاری...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center text-red-400">
                <div className="text-center p-6">
                    <p className="text-xl">خطا</p>
                    <p className="mt-3 text-sm opacity-80">{error}</p>
                </div>
            </div>
        );
    }

    // صفحه لیست کاربران (جدول یا گرید)
    if (!selectedUser) {
        return (
            <div className="pb-32 pt-8 md:pt-12 sm:px-6 lg:px-8 border border-blue-500/10 bg-blue-500/5 rounded-md backdrop-blur-xl max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 md:mb-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6"
                >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white text-center md:text-left">
                        داشبورد ادمین – پاسخ‌های کاربران ({users.length})
                    </h1>

                    {users.length > 0 && (
                        <div className="flex justify-center sm:justify-end gap-3">
                            <button
                                onClick={() => setViewMode("table")}
                                className={`
                                    px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                    border border-[#2A4A8A]/60
                                    ${viewMode === "table"
                                    ? "bg-[#2A4A8A] text-white shadow-md shadow-[#2A4A8A]/30"
                                    : "bg-[#13294B]/70 text-gray-300 hover:bg-[#1E3A6D]/80"}
                                `}
                            >
                                جدول
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`
                                    px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                    border border-[#2A4A8A]/60
                                    ${viewMode === "grid"
                                    ? "bg-[#2A4A8A] text-white shadow-md shadow-[#2A4A8A]/30"
                                    : "bg-[#13294B]/70 text-gray-300 hover:bg-[#1E3A6D]/80"}
                                `}
                            >
                                کارت
                            </button>
                        </div>
                    )}
                </motion.div>

                {users.length === 0 ? (
                    <div className="text-center text-gray-400 text-xl my-20">
                        هیچ کاربری یافت نشد
                    </div>
                ) : viewMode === "table" ? (
                    <div className="overflow-x-auto rounded-xl border border-[#1E3A6D]/50 bg-[#0A1F44]/40">
                        <table className="min-w-full border-collapse">
                            <thead>
                            <tr className="bg-[#1E3A6D]/90 text-white">
                                <th className="p-4 text-right">نام</th>
                                <th className="p-4 text-right">موبایل</th>
                                <th className="p-4 text-center">پیشرفت</th>
                                <th className="p-4 text-center">سناریوهای شروع‌شده</th>
                                <th className="p-4 text-center">آخرین فعالیت</th>
                                <th className="p-4 text-center">عملیات</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.userId}
                                    className="border-b border-[#2A4A8A]/40 hover:bg-[#1E3A6D]/30 transition-colors"
                                >
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.phone}</td>
                                    <td className="p-4 text-center">
                                        <div className="w-20 mx-auto bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                                                style={{ width: `${user.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs mt-1 block text-gray-300">{user.progress}%</span>
                                    </td>
                                    <td className="p-4 text-center text-gray-300">{user.startedScenarios}</td>
                                    <td className="p-4 text-center text-sm text-gray-400">
                                        {user.lastActive ? new Date(user.lastActive).toLocaleString("fa-IR") : "—"}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => loadUserResponses(user.userId)}
                                            className="px-5 py-2 bg-gradient-to-r from-[#2A4A8A] to-[#3A5AA0] hover:from-[#3A5AA0] hover:to-[#4A6AB0] text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                                        >
                                            مشاهده پاسخ‌ها
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                        {users.map((user) => (
                            <motion.div
                                key={user.userId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.05 * (users.indexOf(user) % 8) }}
                                className={`
                                    bg-gradient-to-br from-[#13294B]/80 to-[#0A1F44]/80 
                                    border border-[#1E3A6D]/60 rounded-xl p-5 md:p-6
                                    hover:border-[#2A4A8A]/80 hover:shadow-xl hover:shadow-black/30
                                    transition-all duration-300 cursor-pointer group
                                `}
                                onClick={() => loadUserResponses(user.userId)}
                            >
                                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#FF6B00] transition-colors truncate">
                                    {user.name}
                                </h3>
                                <p className="text-sm text-gray-300 mb-4">{user.phone}</p>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                            <span>پیشرفت</span>
                                            <span className="font-medium">{user.progress}%</span>
                                        </div>
                                        <div className="h-2.5 bg-[#1E3A6D]/70 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                                                style={{ width: `${user.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm text-gray-300">
                                        <span>سناریوهای شروع‌شده:</span>
                                        <span className="font-medium">{user.startedScenarios}</span>
                                    </div>

                                    <div className="text-sm text-gray-400 truncate">
                                        آخرین فعالیت: {user.lastActive ? new Date(user.lastActive).toLocaleString("fa-IR") : "نامشخص"}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-[#2A4A8A]/40 text-center">
                                    <span className="text-blue-400 group-hover:text-blue-300 font-medium transition-colors">
                                        مشاهده پاسخ‌ها →
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // صفحه نمایش پاسخ‌های کاربر انتخاب‌شده (بدون تغییر)
    return (
        <div className="pb-32 pt-8 md:pt-12  border border-blue-500/10 bg-blue-500/5 rounded-md backdrop-blur-xl sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-10 md:mb-14 flex items-center justify-between flex-wrap gap-4"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                        پاسخ‌های {selectedUser.name}
                    </h1>
                    <p className="text-base text-gray-300 mt-2 opacity-90">
                        {selectedUser.phone} • آخرین فعالیت: {selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleString("fa-IR") : "نامشخص"}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedUser(null)}
                    className="
                        px-8 py-4 text-lg font-semibold
                        bg-gradient-to-r from-gray-700 to-gray-600
                        hover:from-gray-600 hover:to-gray-500
                        text-white rounded-2xl shadow-2xl hover:shadow-3xl
                        transition-all duration-300 flex items-center gap-3
                        border border-gray-500/40
                    "
                >
                    بازگشت به لیست کاربران
                </motion.button>
            </motion.div>

            <div className="space-y-10">
                {scenarios.map((scenario) => (
                    <motion.section
                        key={scenario.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="border border-[#1E3A6D]/70 rounded-xl overflow-hidden bg-[#13294B]/25 shadow-xl shadow-black/30"
                    >
                        <div className="bg-gradient-to-r from-[#1E3A6D] to-[#0F2550] px-6 py-6 md:py-7 border-b border-[#2A4A8A]/60">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                {scenario.title}
                            </h2>
                            <p className="text-base text-gray-300 mt-2 opacity-90">
                                {scenario.period}
                            </p>
                        </div>

                        <NestedAccordion
                            question={scenario.root}
                            path={`Q.${scenario.id}`}
                            probabilities={probabilities}
                            level={0}
                            showProbability={true}
                            showImpact={false}
                        />
                    </motion.section>
                ))}
            </div>
        </div>
    );
}